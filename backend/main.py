from gqlalchemy import Memgraph, MemgraphKafkaStream

memgraph = Memgraph()

def main():
    stream = MemgraphKafkaStream(
        name="best_stories_stream",
        topics=["best-stories"],
        transform="best_stories.stories",
        bootstrap_servers="broker:9092",
    )
    memgraph.create_stream(stream)
    memgraph.start_stream(stream)


if __name__ == '__main__':
    main()