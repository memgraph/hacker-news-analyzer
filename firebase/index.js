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
const bestStoriesRef = ref(db, "/v0/beststories");


onValue(bestStoriesRef, (snapshot) => {
  const slicedBestStories = snapshot.val().slice(1,31);
  slicedBestStories.forEach(bestStory => {
    get(ref(db, `/v0/item/${bestStory}`)).then((snapshot2) => {
      send(snapshot2.val())
    }).catch((error) => {
      console.error(error);
    });
  });
});


const send = async (bestStory) => {
  const producer = kafka.producer()
  try {
    await producer.connect()
    await producer.send({
      topic: 'best-stories',
      messages: [
        {
          value: JSON.stringify(bestStory)
        }
      ]
    })
    await producer.disconnect()
  } catch (error) {
    console.log(error)
  }
}