import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { setCredentials } from '../store/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({ email: '', password: '' });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // clear error on typing
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError('Please enter both email and password');
    }

    try {
      setLoading(true);
      const data = await loginUser(form.email, form.password);
      dispatch(setCredentials({ token: data.data.token }));
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login to Job Tracker
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={18} />}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        {/* Registration message */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don't have an account?
          </Typography>
          <Button onClick={() => navigate('/register')} sx={{ mt: 1 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
