from gqlalchemy import Memgraph, Call, MemgraphKafkaStream
import logging
import time
from fastapi.middleware.cors import CORSMiddleware


from fastapi import FastAPI

app = FastAPI()

memgraph = Memgraph()

log = logging.getLogger(__name__)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_log():
    logging.basicConfig(level=logging.DEBUG)
    log.info("Logging enabled")


def connect_to_memgraph():
    connection_established = False
    while not connection_established:
        try:
            if memgraph._get_cached_connection().is_active():
                connection_established = True
        except:
            log.info("Memgraph probably isn't running.")
            time.sleep(4)

def get_pagerank():
    results = list(
            Call("pagerank.get")
            .yield_()
            .with_({"node": "node", "rank": "rank"})
            .add_custom_cypher("WHERE node:User")
            .return_({"node.id": "user_id", "rank": "rank"})
            .order_by("rank DESC")
            .execute()
        )
    return results

@app.get("/pagerank")
def get_user_rank():
    results = get_pagerank()
    return results

def connect_to_stream():
    streamTopStories = MemgraphKafkaStream(
        name="top_stories_stream",
        topics=["top-stories"],
        transform="stories.stories",
        bootstrap_servers="broker:9092",
    )
    memgraph.create_stream(streamTopStories)
    log.info("Created stream")
    memgraph.start_stream(streamTopStories)
    log.info("Started stream")

@app.on_event("startup")
def startup_event():
    init_log()
    connect_to_memgraph()
    connect_to_stream()

   