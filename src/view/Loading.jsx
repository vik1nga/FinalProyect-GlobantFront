import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Logo from '../commons/logo';

function Loading() {
  return (
    <Box sx={{height:"100vh", display: 'flex',flexDirection:"column",justifyContent:"center", alignItems:"center" }}>

        <Box sx={{height:"18%",marginBottom:"20%"}}><Logo/></Box>
        
      <CircularProgress thickness={5} size={50} sx={{color:"#bed733"}}>

      </CircularProgress>
      
      <h2>Loading</h2>
    </Box>
  );
}


export default Loading;