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
  const slicedTopStories = snapshot.val().slice(1,31);
  slicedTopStories.forEach(topStory => {
    get(ref(db, `/v0/item/${topStory}`)).then((snapshot2) => {
      sendTopStory(snapshot2.val())
      get(ref(db, `/v0/user/${snapshot2.val().by}`)).then((snapshot3) => {
        sendUser(snapshot3.val())
      })
    }).catch((error) => {
      console.error(error);
    });
    
  });
});

const sendTopStory = async (topStory) => {
  if(topStory.type === "job") return;
  if(!topStory.kids) return;
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

const sendUser = async (user) => {
  const producer = kafka.producer();
  console.log(user)
  try {
    await producer.connect()
    await producer.send({
      topic: 'users',
      messages: [
        {
          value: JSON.stringify(user)
        }
      ]
    })
    await producer.disconnect()
  } catch (error) {
    console.log(error)
  }
}