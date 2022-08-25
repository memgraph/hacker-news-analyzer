import mgp
import json

@mgp.transformation
def users(messages: mgp.Messages) -> mgp.Record(query = str, parameters=mgp.Nullable[mgp.Map]):
    result_queries = []
    for i in range(messages.total_messages()):
        message = messages.message_at(i)
        user = json.loads(message.payload())
    
        for story in user["submitted"]:
            result_queries.append(mgp.Record(
                query=(
                    '''
                    MERGE (story:Story {id: $storyId})
                    MERGE (user:User {id: $userId})
                    MERGE (user)-[:SUBMITTED]->(story);'''
                ),
                parameters={
                    "userId": user["id"],
                    "karma": user["karma"],
                    "storyId": story
                }
            ))
    return result_queries