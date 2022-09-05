import { Orb } from '@memgraph/orb';
import { useEffect, useState } from 'react';
import { getTopStories } from '../services/BackendService';
import React from "react";

interface User {
    user_id: string,
    rank: number
}

interface Nodes {
    id: number,
    user_id: string,
    rank: number
}

function Home() {
    const [nodes, setNodes] = useState<Nodes[]>();
    const [users, setUsers] = useState<User[]>();
    const [edges, setEdges] = useState();
    useEffect(() => {
        getTopStories().then(res => setUsers(res.data));
    }, []);
   
    useEffect(() => {
        if(users) {
            const userNodes: Nodes[]  = users.map((user, index) => {
                return {
                    id: index+1,
                    user_id: user.user_id,
                    rank: user.rank
                }
            });
            console.log(userNodes)
            setNodes(userNodes);
            console.log("participant is here");
            console.log(nodes);
            console.log(edges);
            const container: HTMLElement = document.getElementById("participant")!;
            const orb = new Orb(container);
            orb.data.setDefaultStyle({
                getNodeStyle(node) {
                  const basicStyle = {
                    color: '#FB6E00',
                    colorHover: '#e7644e',
                    colorSelected: '#e7644e',
                    fontSize: 8,
                    label: node.data.user_id,
                    size: node.data.rank * 400,
                  };
                  return {
                    ...node.properties,
                    ...basicStyle
                  };
                },
               
              });
          
            // Initialize nodes and edges
            orb.data.setup({ nodes, edges });
            console.log(orb.data.getNodes())
            console.log(orb.data.getEdges())
           
            
            orb.view.render(() => {

                orb.view.recenter();

            });
        }
    }, [users]);

    return (
        <div style={{ height: "800px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div id="participant" style={{ flex: "1", width: "100%" }}>Hi graph!</div>
            </div>
        </div>
    )
}

export default Home;