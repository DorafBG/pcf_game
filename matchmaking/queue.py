import redis
from dataclasses import dataclass

@dataclass
class Player:
    player_id: str
    skill_rating: int
    region: str
    game_mode: str
    queue_time: float

class MatchmakingQueue:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.queue_prefix = "matchmaking:queue"
        self.player_prefix = "matchmaking:player"
        self.lobby_prefix = "matchmaking:lobby"

    def add_player_to_queue(self, player: Player) -> bool:
        """Add a player to the matchmaking queue."""
        queue_key = f"{self.queue_prefix}:{player.region}:{player.game_mode}"
        player_key = f"{self.player_prefix}:{player.player_id}"

        # Store player metadata
        player_data = {
            "player_id": player.player_id,
            "skill_rating": player.skill_rating,
            "region": player.region,
            "game_mode": player.game_mode,
            "queue_time": player.queue_time
        }

        # Use a transactional pipeline for atomic operation
        pipe = self.redis.pipeline()

        # Store player info in hash
        pipe.hset(player_key, mapping=player_data)
        pipe.expire(player_key, 300)  # 5 minute TTL

        # Add to sorted set with skill rating as score
        pipe.zadd(queue_key, {player.player_id: player.skill_rating})

        pipe.execute()
        return True

    def remove_player_from_queue(self, player_id: str, region: str, game_mode: str) -> bool:
        """Remove a player from the matchmaking queue."""
        queue_key = f"{self.queue_prefix}:{region}:{game_mode}"
        player_key = f"{self.player_prefix}:{player_id}"

        pipe = self.redis.pipeline()
        pipe.zrem(queue_key, player_id)
        pipe.delete(player_key)
        pipe.execute()
        return True

    def get_queue_size(self, region: str, game_mode: str) -> int:
        """Get the current queue size."""
        queue_key = f"{self.queue_prefix}:{region}:{game_mode}"
        return self.redis.zcard(queue_key)