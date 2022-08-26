import axios from "axios"

const baseURL = "https://hacker-news.firebaseio.com/v0/";
const client = axios.create({ 
    baseURL : baseURL,
    headers: {'Access-Control-Allow-Origin': '*'}
});



export async function getTopStories() {
    const response = await client.get("/topstories.json?print=pretty")
    return response;
}