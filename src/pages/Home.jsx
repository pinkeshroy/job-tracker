import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';

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
    }, 1800);

    return () => clearTimeout(timer);
  }, [token, role, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right top, #a18cd1, #fbc2eb)',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 420,
          textAlign: 'center',
          background: 'linear-gradient(to bottom, #ffffff, #f3e5f5)',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(to right, #2196f3, #e91e63)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Job Tracker
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, fontWeight: 500 }}
        >
          Hold tight! We’re preparing your personalized dashboard.
        </Typography>

        <CircularProgress thickness={5} sx={{ color: '#7b1fa2' }} />

        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 2, color: '#6a1b9a' }}
        >
          Redirecting in a moment...
        </Typography>

        <LinearProgress
          sx={{
            mt: 3,
            borderRadius: 10,
            height: 6,
            backgroundColor: '#ede7f6',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#ab47bc',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Home;
