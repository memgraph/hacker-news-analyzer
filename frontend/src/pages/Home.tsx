import { Orb } from '@memgraph/orb';
import { useEffect } from 'react';


const nodes = [
    { id: 0, label: 'Node A' },
    { id: 1, label: 'Node B' },
    { id: 2, label: 'Node C' },
  ];
  const edges = [
    { id: 0, start: 0, end: 0, label: 'Edge Q' },
    { id: 1, start: 0, end: 1, label: 'Edge W' },
    { id: 2, start: 0, end: 2, label: 'Edge E' },
    { id: 3, start: 1, end: 2, label: 'Edge T' },
    { id: 4, start: 2, end: 2, label: 'Edge Y' },
    { id: 5, start: 0, end: 1, label: 'Edge V' },
  ]

function Home() {

    useEffect(() => {
        console.log("participant is here");
        console.log(nodes);
        console.log(edges);
        const container: HTMLElement = document.getElementById("graph")!;
        const orb = new Orb(container);


        // Initialize nodes and edges
        orb.data.setup({ nodes, edges });
        console.log(orb.data.getNodes())
        console.log(orb.data.getEdges())

    
        orb.view.render(() => {
            orb.view.recenter();
        });
    }, []);


    return (
        <div style={{ height: "764px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div id="graph" style={{ flex: "1", width: "100%", zIndex: "2" }}>Hi graph!</div>
            </div>
        </div>
    )
}

export default Home;