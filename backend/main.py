from gqlalchemy import Memgraph, MemgraphKafkaStream

memgraph = Memgraph()

def main():
    streamTopStories = MemgraphKafkaStream(
        name="top_stories_stream",
        topics=["top-stories"],
        transform="stories.stories",
        bootstrap_servers="broker:9092",
    )
    memgraph.create_stream(streamTopStories)
    memgraph.start_stream(streamTopStories)
   

if __name__ == '__main__':
    main()