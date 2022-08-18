import React, { useEffect, useState } from "react";
import { getTopStories } from "../services/BackendService";

function Home() {
    const [topStories, setTopStories] = useState();
    useEffect(() => {
        /* getTopStories().then(res => setTopStories(res.data)) */
    }, [])
    return (
        <>
        {console.log(topStories)}
        </>
    );
}

export default Home;