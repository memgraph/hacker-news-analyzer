import axios from "axios"

const baseURL = "http://localhost:8000";
const client = axios.create({ 
    baseURL : baseURL,
    headers: {'Access-Control-Allow-Origin': '*'}
});



export async function getTopStories() {
    const response = await client.get("/pagerank");
    return response;
}