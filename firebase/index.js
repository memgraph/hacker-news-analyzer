import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, onValue } from "firebase/database";
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'firebase',
  brokers: ['broker:9092'],
  connectionTimeout: 5000
})

const producer = kafka.producer();

const firebaseConfig = {
    databaseURL: "https://hacker-news.firebaseio.com",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const topStoriesRef = ref(db, "/v0/topstories");

const sending = (story) => {
  if(story.val().kids) {
    story.val().kids.forEach((commentId) => {
      sendTopStory(story.val(), {
        id: commentId
      })
    })
  }
}

const sendTopStory = async (topStory, comment) => {
  if (topStory.type == "job" || !topStory.kids || !topStory.title) return;
  topStory["comment"] = comment;
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

onValue(topStoriesRef, (snapshot) => {
  const topStories = snapshot.val().slice(1,35);
  topStories.forEach(topStory => {
    get(ref(db, `/v0/item/${topStory}`)).then((story) => {
      sending(story);
      get(ref(db, `/v0/user/${story.val().by}`)).then(user => {
        user.val().submitted.forEach(userStoryId => {
          get(ref(db, `/v0/item/${userStoryId}`)).then(userStory => {
              sending(userStory);
          })
        })  
      })
    }).catch((error) => {
      console.error(error);
    });
  });
});