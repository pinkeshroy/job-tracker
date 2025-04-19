import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) {
        navigate('/login');
      } else if (role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/jobs');
      }
    }, 1000); // 1s delay

    return () => clearTimeout(timer);
  }, [token, role, navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Checking role & redirecting...</Typography>
    </Box>
  );
};

export default Home;
