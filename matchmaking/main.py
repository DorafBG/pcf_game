import os
from contextlib import asynccontextmanager

import redis
from fastapi import FastAPI, Query, Request
from pydantic import BaseModel, Field

from .matchmaking_service import MatchmakingService


redis_client = redis.Redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379/0")
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_client.ping()
    service = MatchmakingService(redis_client)
    service.start()
    app.state.matchmaking = service
    yield
    service.stop()
    redis_client.close()


app = FastAPI(title="PCF Matchmaking", lifespan=lifespan)


class QueueRequest(BaseModel):
    player_id: str = Field(min_length=1)
    skill_rating: int = Field(ge=0)
    region: str = Field(min_length=1)
    game_mode: str = Field(min_length=1)


@app.get("/health")
def health():
    redis_client.ping()
    return {"status": "ok", "service": "matchmaking"}


@app.post("/queue", status_code=202)
def join_queue(payload: QueueRequest, request: Request):
    return request.app.state.matchmaking.queue_player(
        player_id=payload.player_id,
        skill_rating=payload.skill_rating,
        region=payload.region,
        game_mode=payload.game_mode,
    )


@app.delete("/queue/{player_id}")
def leave_queue(
    player_id: str,
    request: Request,
    region: str = Query(min_length=1),
    game_mode: str = Query(min_length=1),
):
    request.app.state.matchmaking.cancel_queue(player_id, region, game_mode)
    return {"status": "cancelled", "player_id": player_id}