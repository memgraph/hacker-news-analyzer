import { useEffect, useState } from 'react';
import { getPagerank, getTopStories } from '../services/BackendService';
import Graph from '../components/Graph';
import RankTable from '../components/RankTable';
import { Grid } from '@mui/material';

export interface User {
    user_id: string,
    rank: number
}

function Home() {
    const [nodes, setNodes] = useState();
    const [edges, setEdges] = useState();

    const [pagerank, setPagerank] = useState<User[]>();

    useEffect(() => {
        getPagerank().then(res => setPagerank(res));
        getTopStories().then(res => {
            setNodes(res.nodes);
            setEdges(res.edges)
        });
    }, []);
    
    return (
       <Grid container spacing={2}>
            <Grid item xs={8}>
                {nodes && edges && <Graph nodes={nodes} edges={edges}/>}
            </Grid>
            <Grid item xs={4}>
                {pagerank && <RankTable rows={pagerank}/>}        
            </Grid>
        </Grid>
    );
}

export default Home;