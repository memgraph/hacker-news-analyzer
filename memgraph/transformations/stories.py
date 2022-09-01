import mgp
import json


@mgp.transformation
def stories(messages: mgp.Messages) -> mgp.Record(query = str, parameters=mgp.Nullable[mgp.Map]):
    result_queries = []
    for i in range(messages.total_messages()):
        message = messages.message_at(i)
        story = json.loads(message.payload())

        for kid in story["kids"]:
            result_queries.append(mgp.Record(
                query=(
                    '''
                    MERGE (c:Comment {id: $commentId})
                    MERGE (s:Story:TopStory {id: $storyId})
                    SET s.score=$score
                    SET s.title=$title
                    MERGE (u:User {id: $by})
                    MERGE (u)-[:SUBMITTED]->(s)
                    MERGE (s)-[:HAS]->(c);'''
                ),
                parameters={
                    "commentId": kid,
                    "storyId": story["id"],
                    "title": story["title"],
                    "score": story["score"],
                    "by": story["by"]
                }
            ))
    return result_queries