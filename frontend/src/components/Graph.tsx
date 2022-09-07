import { Orb } from '@memgraph/orb';
import { useEffect } from 'react';

interface GraphProps {
    nodes: any;
    edges: any
}
function Graph({ nodes, edges } : GraphProps) {
    useEffect(() => {
        const container: HTMLElement = document.getElementById("graph")!;
        const orb = new Orb(container);
        orb.data.setup({ nodes, edges });

        orb.data.getNodes().filter((node) => node.getLabel() === "Story")
                .forEach((node) => {
                    node.properties = {
                        color: '#BAB8BB',
                        fontSize: 2,
                        size: 2,
                        label: node.data.title,
                    };
                });
        orb.data.getNodes().filter((node) => node.getLabel() === "User")
                .forEach((node) => {
                    node.properties = {
                        color: '#8C0082',
                        fontSize: 18,
                        size: 22,
                        label: node.data.username,
                    };
                });
        
        orb.view.setSettings({
            render: {
                labelsIsEnabled: true,
                labelsOnEventIsEnabled: true,
            },
            });
        orb.view.render(() => {
            orb.view.recenter();
        });
    }, []);

    return (
        <div style={{ height: "800px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div id="graph" style={{ flex: "1", width: "100%" }}>Hi graph!</div>
            </div>
        </div>
    );
}

export default Graph;