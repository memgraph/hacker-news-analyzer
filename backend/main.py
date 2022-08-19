
from functools import wraps
import logging
import os
import time
from unicodedata import name
from gqlalchemy import Memgraph, MemgraphKafkaStream
from time import sleep


log = logging.getLogger(__name__)
memgraph = Memgraph()


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

def connect_to_memgraph():
    connection_established = False
    while not connection_established:
        if memgraph._get_cached_connection().is_active():
            connection_established = True

def main():
    stream = MemgraphKafkaStream(
        name="best_stories_stream",
        topics=["best-stories"],
        transform="best_stories.stories",
        bootstrap_servers="broker:9092",
    )
    memgraph.create_stream(stream)
    memgraph.start_stream(stream)
    print(memgraph.get_streams())


if __name__ == '__main__':
    main()