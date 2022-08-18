from array import array
from typing import List, Union
from argparse import ArgumentParser
from functools import wraps

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

from gqlalchemy import Memgraph, Match, Call
import logging
import os
import time

memgraph = Memgraph()

log = logging.getLogger(__name__)

app = FastAPI()


class Story(BaseModel):
    by: str
    descendants: int
    id: int
    kids: List[int] = []    
    score: int
    time: int
    title: str
    type: str
    url: str

def log_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        log.info(f"Time for {func.__name__} is {duration}")
        return result

    return wrapper


def init_log():
    logging.basicConfig(level=logging.DEBUG)
    log.info("Logging enabled")
    logging.getLogger("werkzeug").setLevel(logging.WARNING)


def parse_args():
    """Parse command line arguments."""

    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="0.0.0.0", help="Host address.")
    parser.add_argument("--port", default=5000, type=int, help="App port.")
    parser.add_argument(
        "--debug",
        default=True,
        action="store_true",
        help="Run web server in debug mode.",
    )
    parser.add_argument(
        "--populate",
        dest="populate",
        action="store_true",
        help="Run app with data loading.",
    )
    parser.set_defaults(populate=False)
    log.info(__doc__)
    return parser.parse_args()

@app.post("/beststories")
def post_best_stories(story: Story):
    print("POSTED")
    return story


if __name__ == '__main__':
    uvicorn.run(app)