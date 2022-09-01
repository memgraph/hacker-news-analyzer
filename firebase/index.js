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
const bestStoriesRef = ref(db, "/v0/beststories")

onValue(topStoriesRef, (snapshot) => {
  snapshot.val().forEach(topStory => {
    get(ref(db, `/v0/item/${topStory}`)).then((snapshot2) => {
      sendTopStory(snapshot2.val())
    }).catch((error) => {
      console.error(error);
    });
    
  });
});

onValue(bestStoriesRef, (snapshot) => {
  snapshot.val().forEach(bestStory => {
    get(ref(db, `/v0/item/${bestStory}`)).then((snapshot2) => {
      sendTopStory(snapshot2.val())
    }).catch((error) => {
      console.error(error);
    });
  });
})

const sendTopStory = async (topStory) => {
  
  if(topStory.type == "job" || !topStory.kids || !topStory.title) return;

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