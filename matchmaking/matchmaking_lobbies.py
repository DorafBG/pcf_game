import json
import time
import uuid
from typing import Dict, List

import redis

class LobbyManager:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.lobby_prefix = "matchmaking:lobby"
        self.player_lobby_prefix = "matchmaking:player_lobby"
        self.active_lobbies_key = "matchmaking:active_lobbies"

    def create_lobby(
        self,
        player_ids: List[str],
        teams: Dict[str, List[str]],
        game_mode: str,
        region: str
    ) -> str:
        """Create a new game lobby."""
        lobby_id = str(uuid.uuid4())
        lobby_key = f"{self.lobby_prefix}:{lobby_id}"

        lobby_data = {
            "lobby_id": lobby_id,
            "game_mode": game_mode,
            "region": region,
            "status": "waiting",  # waiting, ready, in_game, completed
            "created_at": time.time(),
            "team_a": json.dumps(teams["team_a"]),
            "team_b": json.dumps(teams["team_b"]),
            "ready_players": json.dumps([])
        }

        pipe = self.redis.pipeline()

        # Store lobby data
        pipe.hset(lobby_key, mapping=lobby_data)
        pipe.expire(lobby_key, 600)  # 10 minute TTL

        # Add to active lobbies set
        pipe.sadd(self.active_lobbies_key, lobby_id)

        # Map each player to the lobby
        for player_id in player_ids:
            pipe.set(
                f"{self.player_lobby_prefix}:{player_id}",
                lobby_id,
                ex=600
            )

        pipe.execute()

        # Notify players about the match
        self.notify_players(player_ids, lobby_id, lobby_data)

        return lobby_id

    def notify_players(
        self,
        player_ids: List[str],
        lobby_id: str,
        lobby_data: dict
    ):
        """Notify players about their match via pub/sub."""
        notification = {
            "type": "match_found",
            "lobby_id": lobby_id,
            "game_mode": lobby_data["game_mode"],
            "region": lobby_data["region"]
        }

        for player_id in player_ids:
            channel = f"player:notifications:{player_id}"
            self.redis.publish(channel, json.dumps(notification))

    def player_ready(self, player_id: str, lobby_id: str) -> Dict:
        """Mark a player as ready in the lobby."""
        lobby_key = f"{self.lobby_prefix}:{lobby_id}"

        # Get current ready players
        ready_json = self.redis.hget(lobby_key, "ready_players")
        ready_players = json.loads(ready_json) if ready_json else []

        if player_id not in ready_players:
            ready_players.append(player_id)

        # Update ready players
        self.redis.hset(lobby_key, "ready_players", json.dumps(ready_players))

        # Get all players
        team_a = json.loads(self.redis.hget(lobby_key, "team_a"))
        team_b = json.loads(self.redis.hget(lobby_key, "team_b"))
        all_players = team_a + team_b

        # Check if all players are ready
        all_ready = len(ready_players) == len(all_players)

        if all_ready:
            self.redis.hset(lobby_key, "status", "ready")
            self.start_game(lobby_id)

        return {
            "ready_count": len(ready_players),
            "total_players": len(all_players),
            "all_ready": all_ready
        }

    def start_game(self, lobby_id: str):
        """Start the game and allocate a game server."""
        lobby_key = f"{self.lobby_prefix}:{lobby_id}"

        self.redis.hset(lobby_key, "status", "in_game")

        # Get lobby data for game server
        lobby_data = self.redis.hgetall(lobby_key)

        # Publish game start notification
        team_a = json.loads(lobby_data[b"team_a"])
        team_b = json.loads(lobby_data[b"team_b"])
        all_players = team_a + team_b

        game_notification = {
            "type": "game_starting",
            "lobby_id": lobby_id,
            "server_ip": "192.168.1.100",  # Would come from server allocation
            "server_port": 7777
        }

        for player_id in all_players:
            channel = f"player:notifications:{player_id}"
            self.redis.publish(channel, json.dumps(game_notification))