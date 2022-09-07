from gqlalchemy import Match, Call
from gqlalchemy.query_builders.memgraph_query_builder import Operator, Order


def get_topstories():
    results = list(
            Match()
            .node(labels="Story", variable="s")
            .to(relationship_type="WRITTEN_BY", variable="w")
            .node(labels="User", variable="u")
            .return_()
            .execute()
        )

    user_nodes = set()
    story_nodes = set()
    written_by_relationships = set()

    for result in results:
        user = result["u"]
        story = result["s"]
        written_by = result["w"]

        user_id = user._id
        user_label = next(iter(user._labels))
        user_name = user._properties["id"]

        story_id = story._id
        story_label = next(iter(story._labels))
        story_title = story._properties["title"]
        story_score = story._properties["score"]
        story_s_id = story._properties["id"]

        written_by_id = written_by._id
        written_by_start = written_by._start_node_id
        written_by_end = written_by._end_node_id
        written_by_type = written_by._type

        user_nodes.add(
            (
                user_id,
                user_label,
                user_name,
            )
        )

        story_nodes.add(
            (
                story_id, 
                story_label, 
                story_title, 
                story_score, 
                story_s_id
            )
        )

        written_by_relationships.add(
            (
                written_by_id, 
                written_by_start, 
                written_by_end, 
                written_by_type
            )
        )

    users = [
        {
            "id": user_id,
            "label": user_label,
            "username": user_name,
        }
        for user_id, user_label, user_name, in user_nodes
    ]

    stories = [
        {
            "id": story_id,
            "label": story_label,
            "story_id": story_s_id,
            "title": story_title,
            "score": story_score,
        }
        for story_id, story_label, story_title, story_score, story_s_id in story_nodes
    ]

    edges = [
        {
            "id": written_by_id, 
            "start": written_by_start, 
            "end": written_by_end, 
            "label": written_by_type}
        for written_by_id, written_by_start, written_by_end, written_by_type in written_by_relationships
    ]

    nodes = users + stories
    response = {"nodes": nodes, "edges": edges}
    return response

def get_pagerank():
    results = list(
            Call("pagerank.get")
            .yield_()
            .with_(["node", "rank"])
            .where(item="node", operator=Operator.LABEL_FILTER, expression="User")
            .return_([("node.id", "user_id"), "rank"])
            .order_by(("rank", Order.DESC))
            .execute()
        )
    return results