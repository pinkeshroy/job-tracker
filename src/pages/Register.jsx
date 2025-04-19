import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { setCredentials } from "../store/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      const data = await registerUser(form); // API call
      dispatch(setCredentials({ token: data.data.token }));
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register for Job Tracker
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Box>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ marginLeft: 1 }}
            >
              Password must be at least 6 characters
            </Typography>
          </Box>

          <TextField
            label="Role"
            name="role"
            select
            value={form.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="RECRUITER">Recruiter</MenuItem>
          </TextField>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={18} />}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>
        {/* Registration message */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?
          </Typography>
          <Button onClick={() => navigate('/login')} sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
