import time
import threading
from typing import Dict

import redis

from .matchmaking_algorithm import SkillBasedMatcher
from .matchmaking_lobbies import LobbyManager
from .queue import MatchmakingQueue, Player

class MatchmakingService:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.queue = MatchmakingQueue(redis_client)
        self.matcher = SkillBasedMatcher(redis_client)
        self.lobby_manager = LobbyManager(redis_client)
        self.running = False
        self.regions = ["na", "eu", "asia", "oceania"]
        self.game_modes = ["ranked", "casual", "competitive"]

    def start(self):
        """Start the matchmaking service."""
        self.running = True
        self.worker_thread = threading.Thread(target=self._matchmaking_loop)
        self.worker_thread.start()
        print("Matchmaking service started")

    def stop(self):
        """Stop the matchmaking service."""
        self.running = False
        self.worker_thread.join()
        print("Matchmaking service stopped")

    def _matchmaking_loop(self):
        """Main matchmaking loop."""
        while self.running:
            for region in self.regions:
                for game_mode in self.game_modes:
                    self._process_queue(region, game_mode)

            # Small delay to prevent CPU spinning
            time.sleep(0.1)

    def _process_queue(self, region: str, game_mode: str):
        """Process a specific queue for matches."""
        queue_size = self.queue.get_queue_size(region, game_mode)

        if queue_size < self.matcher.players_per_match:
            return

        # Try to find a match
        matched_players = self.matcher.find_match(region, game_mode)

        if matched_players:
            # Create balanced teams
            teams = self.matcher.create_balanced_teams(matched_players)

            # Create the lobby
            lobby_id = self.lobby_manager.create_lobby(
                matched_players, teams, game_mode, region
            )

            # Remove matched players from queue
            for player_id in matched_players:
                self.queue.remove_player_from_queue(player_id, region, game_mode)

            print(f"Match created: {lobby_id} with {len(matched_players)} players")

    def queue_player(
        self,
        player_id: str,
        skill_rating: int,
        region: str,
        game_mode: str
    ) -> Dict:
        """Add a player to the matchmaking queue."""
        player = Player(
            player_id=player_id,
            skill_rating=skill_rating,
            region=region,
            game_mode=game_mode,
            queue_time=time.time()
        )

        self.queue.add_player_to_queue(player)

        return {
            "status": "queued",
            "estimated_wait": self._estimate_wait_time(region, game_mode),
            "queue_position": self.queue.get_queue_size(region, game_mode)
        }

    def cancel_queue(self, player_id: str, region: str, game_mode: str) -> bool:
        """Remove a player from the queue."""
        return self.queue.remove_player_from_queue(player_id, region, game_mode)

    def _estimate_wait_time(self, region: str, game_mode: str) -> int:
        """Estimate wait time based on queue size."""
        queue_size = self.queue.get_queue_size(region, game_mode)

        # Simple estimation: more players = faster matches
        if queue_size >= self.matcher.players_per_match * 2:
            return 5  # seconds
        elif queue_size >= self.matcher.players_per_match:
            return 15
        else:
            return 60