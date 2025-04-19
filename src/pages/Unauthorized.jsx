// pages/Unauthorized.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const Unauthorized = () => (
  <Container sx={{ mt: 10 }}>
    <Typography variant="h4" color="error">
      ⛔ Unauthorized Resource
    </Typography>
    <Typography>
      You do not have permission to view this page.
    </Typography>
  </Container>
);

export default Unauthorized;
