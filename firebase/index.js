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
  snapshot.val().forEach(topStory => {
    get(ref(db, `/v0/item/${topStory}`)).then((snapshot2) => {
      snapshot2.val().kids.forEach((comment) => {
        get(ref(db, `/v0/item/${comment}`)).then((snapshot3) => {
          sendTopStory(snapshot2.val(), snapshot3.val())
        })
      })
    }).catch((error) => {
      console.error(error);
    });
    
  });
});


const sendTopStory = async (topStory, comment) => {
  
  if(topStory.type == "job" || !topStory.kids || !topStory.title || !comment.by) return;

  topStory["comment"] = comment;
  console.log(topStory)
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