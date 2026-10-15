import redis
import time 
import Optional
import List
import Dict

import time
from typing import Dict, List, Optional

import redis


class SkillBasedMatcher:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.queue_prefix = "matchmaking:queue"
        self.player_prefix = "matchmaking:player"

        # Matching parameters
        self.initial_skill_range = 50
        self.max_skill_range = 500
        self.skill_range_expansion_rate = 25  # Per second
        self.players_per_match = 2  # 1v1 game

    def find_match(self, region: str, game_mode: str) -> Optional[List[str]]:
        """Find players for a match within skill range."""
        queue_key = f"{self.queue_prefix}:{region}:{game_mode}"

        # Get all players in queue
        players_with_scores = self.redis.zrange(
            queue_key, 0, -1, withscores=True
        )

        if len(players_with_scores) < self.players_per_match:
            return None

        # Try to find a valid match
        for anchor_id, anchor_skill in players_with_scores:
            anchor_id = anchor_id.decode() if isinstance(anchor_id, bytes) else anchor_id

            # Get anchor player's queue time for skill range expansion
            player_data = self.redis.hgetall(f"{self.player_prefix}:{anchor_id}")
            if not player_data:
                continue

            queue_time = float(player_data.get(b"queue_time", time.time()))
            wait_seconds = time.time() - queue_time

            # Calculate expanded skill range based on wait time
            skill_range = min(
                self.initial_skill_range + (wait_seconds * self.skill_range_expansion_rate),
                self.max_skill_range
            )

            # Find players within skill range
            min_skill = anchor_skill - skill_range
            max_skill = anchor_skill + skill_range

            candidates = self.redis.zrangebyscore(
                queue_key, min_skill, max_skill
            )

            if len(candidates) >= self.players_per_match:
                # Select players for the match
                selected = [
                    c.decode() if isinstance(c, bytes) else c
                    for c in candidates[:self.players_per_match]
                ]
                return selected

        return None

    def create_balanced_teams(self, player_ids: List[str]) -> Dict[str, List[str]]:
        """Create balanced teams from matched players."""
        # Get all player skill ratings
        players_with_skills = []
        for player_id in player_ids:
            player_data = self.redis.hgetall(f"{self.player_prefix}:{player_id}")
            if player_data:
                skill = int(player_data.get(b"skill_rating", 1000))
                players_with_skills.append((player_id, skill))

        # Sort by skill
        players_with_skills.sort(key=lambda x: x[1], reverse=True)

        # Alternate assignment for balance (snake draft)
        team_a = []
        team_b = []

        for i, (player_id, skill) in enumerate(players_with_skills):
            if i % 4 in [0, 3]:  # 0, 3, 4, 7, 8...
                team_a.append(player_id)
            else:  # 1, 2, 5, 6, 9...
                team_b.append(player_id)

        return {"team_a": team_a, "team_b": team_b}