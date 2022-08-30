import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, onValue } from "firebase/database";
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'firebase',
  brokers: ['broker:9092'],
})



// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    databaseURL: "https://hacker-news.firebaseio.com",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const topStoriesRef = ref(db, "/v0/topstories");

onValue(topStoriesRef, (snapshot) => {
  const topStories = snapshot.val().slice(1,35);
  topStories.forEach(topStory => {
    get(ref(db, `/v0/item/${topStory}`)).then((story) => {
      get(ref(db, `/v0/user/${story.val().by}`)).then(user => {
        if(user.val().submitted) {
          user.val().submitted.forEach(userStoryId => {
            get(ref(db, `/v0/item/${userStoryId}`)).then(userStory => {
              if(userStory.val().kids) {
                userStory.val().kids.forEach((commentUserStoryId) => {
                  get(ref(db, `/v0/item/${commentUserStoryId}`)).then((commentUserStory) => {
                    sendTopStory(userStory.val(), commentUserStory.val())
                  })
                })
              }
            })
          })
        }
      })

      if(story.val().kids) {
        story.val().kids.forEach((commentId) => {
          get(ref(db, `/v0/item/${commentId}`)).then((comment) => {
            sendTopStory(story.val(), comment.val())
          })
        })
      }
    }).catch((error) => {
      console.error(error);
    });
    
  });
});


const sendTopStory = async (topStory, comment) => {
  
  if(topStory.type == "job" || !topStory.kids || !topStory.title || !comment.by) return;

  topStory["comment"] = comment;
  const producer = kafka.producer();
  try {
    await producer.connect()
    await producer.send({
      topic: 'top-stories',
      messages: [
        {
          value: JSON.stringify(topStory)
        }
      ]
    })
    await producer.disconnect()
  } catch (error) {
    console.log(error)
  }
}