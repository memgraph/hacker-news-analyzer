import { useEffect, useState } from 'react';
import { getPagerank, getTopStories } from '../services/BackendService';
import Graph from '../components/Graph';
import RankTable from '../components/RankTable';
import { Fab, Grid } from '@mui/material';
import { ReplayCircleFilledOutlined } from '@mui/icons-material';

export interface User {
    user_id: string,
    rank: number
}

function Home() {
    const [nodes, setNodes] = useState();
    const [edges, setEdges] = useState();

    const [pagerank, setPagerank] = useState<User[]>();
    const [reload, setReload] = useState(true);

    useEffect(() => {
        if(reload) {
            getPagerank().then(res => setPagerank(res));
            getTopStories().then(res => {
                setNodes(res.nodes);
                setEdges(res.edges)
            });
            setReload(false);
        }
    }, [reload]);

    const handleClick = () => {
        setReload(true);
    }
    
    return (
       <Grid container spacing={2}>
            <Grid item xs={8} sx={{position: 'relative'}}>
                <Grid>
                    <Grid>
                        {nodes && edges && <Graph nodes={nodes} edges={edges}/>}

                    </Grid>
                    <Grid>
                        <Fab sx={{position: 'absolute', bottom: 16, right: 16}} color="primary">
                            <ReplayCircleFilledOutlined onClick={handleClick}/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                {pagerank && <RankTable rows={pagerank}/>}        
            </Grid>
        </Grid>
    );
}

export default Home;