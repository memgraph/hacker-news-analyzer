import mgp
import json


@mgp.transformation
def stories(messages: mgp.Messages) -> mgp.Record(query = str, parameters=mgp.Nullable[mgp.Map]):
    result_queries = []
    for i in range(messages.total_messages()):
        message = messages.message_at(i)
        best_stories = json.loads(message.payload().decode('utf8'))
        result_queries.append(mgp.Record (
            query=(
                "MERGE (s {id: $storyId, by: $by, score: $score, title: $title});"
            ),
            parameters={
                "storyId": best_stories["id"],
                "title": best_stories["title"],
                "score": best_stories["score"],
                "by": best_stories["by"]
            }))
    return result_queries