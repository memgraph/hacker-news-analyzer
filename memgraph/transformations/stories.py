import mgp
import json


@mgp.transformation
def stories(messages: mgp.Messages) -> mgp.Record(query = str, parameters=mgp.Nullable[mgp.Map]):
    result_queries = []
    for i in range(messages.total_messages()):
        message = messages.message_at(i)
        story = json.loads(message.payload())
        comment = story["comment"]
        result_queries.append(mgp.Record(
            query=(
                '''
                MERGE (c:Comment {id: $commentId, by: $commentBy})
                MERGE (uc:User {id: $commentBy})
                MERGE (uc)-[:COMMENTED]->(c)              
                MERGE (s:Story {id: $storyId})
                SET s.score=$score
                SET s.title=$title
                MERGE (u:User {id: $by})
                MERGE (u)-[:SUBMITTED]->(s)
                MERGE (s)-[:HAS]->(c);'''
            ),
            parameters={
                "commentId": comment["id"],
                "commentBy": comment["by"],
                "storyId": story["id"],
                "title": story["title"],
                "score": story["score"],
                "by": story["by"]
            }
        )) 
    return result_queries