import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Box sx={{ p: 3 }}>{children}</Box>
    </>
  );
};

export default Layout;
