import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    databaseURL: "https://hacker-news.firebaseio.com",
};
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(app));
get(child(dbRef, `/v0/topstories`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
