import { Orb } from '@memgraph/orb';
import { useEffect, useState } from 'react';
import { getTopStories } from '../services/BackendService';
import React from "react";



function Home() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [topStories, setTopStories] = useState();
    useEffect(() => {
        
        getTopStories().then(res => setTopStories(res.data))
   /*      const container: HTMLElement = document.getElementById("graph")!;
        const orb = new Orb(container);


        // Initialize nodes and edges
        orb.data.setup({ nodes, edges });
        console.log(orb.data.getNodes())
        console.log(orb.data.getEdges())

    
        orb.view.render(() => {
            orb.view.recenter();
        }); */
        if(topStories) {
            console.log(topStories)
        }
    }, [topStories]);



    return (
        /* <div style={{ height: "764px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div id="graph" style={{ flex: "1", width: "100%", zIndex: "2" }}>Hi graph!</div>
            </div>
        </div> */ 
        <h1>HOME</h1>
    )
}

export default Home;