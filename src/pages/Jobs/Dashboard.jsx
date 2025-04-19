import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SearchIcon from '@mui/icons-material/Search';
import { getAllApplications, deleteApplication, updateApplication } from '../../api/applicationApi';
import { debounce } from 'lodash';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: 'appliedAt', sort: 'desc' }]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, resumeUrl: '', coverLetter: '' });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, meta } = await getAllApplications({
        page: page + 1,
        limit: pageSize,
        sortBy: sortModel[0]?.field || 'appliedAt',
        order: sortModel[0]?.sort || 'desc',
      });

      setApplications(data);
      setRowCount(meta.total);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch applications', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, pageSize, sortModel]);

  useEffect(() => {
    const filteredData = applications.filter((app) =>
      app.job.title.toLowerCase().includes(search.toLowerCase()) ||
      app.status.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
  }, [search, applications]);

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      setSnackbar({ open: true, message: 'Application deleted', severity: 'success' });
      fetchApplications();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const handleEditOpen = (row) => {
    setEditForm({
      id: row.id,
      resumeUrl: row.resumeUrl || '',
      coverLetter: row.coverLetter || '',
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm({ id: null, resumeUrl: '', coverLetter: '' });
  };

  const handleEditSubmit = async () => {
    try {
      await updateApplication(editForm.id, {
        resumeUrl: editForm.resumeUrl,
        coverLetter: editForm.coverLetter,
      });
      setSnackbar({ open: true, message: 'Application updated successfully', severity: 'success' });
      handleEditClose();
      fetchApplications();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update application';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const stats = useMemo(() => ({
    total: rowCount,
    interviews: filtered.filter((a) => a.status === 'INTERVIEW').length,
    offers: filtered.filter((a) => a.status === 'OFFER').length,
  }), [filtered, rowCount]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'jobTitle', headerName: 'Job Title', width: 200 },
    { field: 'company', headerName: 'Company', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'OFFER' ? 'success'
              : params.value === 'INTERVIEW' ? 'warning'
                : params.value === 'REJECTED' ? 'error'
                  : 'default'
          }
          variant="outlined"
        />
      ),
    },
    { field: 'appliedAt', headerName: 'Applied At', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEditOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = filtered.map((app) => ({
    id: app.id,
    jobTitle: app.job?.title,
    company: app.job?.company,
    status: app.status,
    resumeUrl: app.resumeUrl,
    coverLetter: app.coverLetter,
    appliedAt: new Date(app.appliedAt).toLocaleDateString(),
  }));

  const debouncedSearch = debounce((value) => setSearch(value), 300);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Job Applications Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Applied', value: stats.total, icon: <WorkOutlineIcon color="primary" fontSize="large" /> },
          { label: 'Interviews', value: stats.interviews, icon: <QuestionAnswerIcon color="warning" fontSize="large" /> },
          { label: 'Offers', value: stats.offers, icon: <LocalOfferIcon color="success" fontSize="large" /> },
        ].map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                transition: '0.3s',
                borderLeft: `6px solid ${index === 0 ? '#1976d2' : index === 1 ? '#ed6c02' : '#2e7d32'}`,
                '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Bar */}
      <Box mb={2}>
        <TextField
          label="Search by job title or status"
          fullWidth
          onChange={(e) => debouncedSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ backgroundColor: '#fff', boxShadow: 1, borderRadius: 1 }}
        />
      </Box>

      {/* Data Table */}
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        page={page}
        rowCount={rowCount}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newSize) => setPageSize(newSize)}
        rowsPerPageOptions={[10, 25, 50]}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        loading={loading}
        disableSelectionOnClick
        sx={{
          borderRadius: 2,
          backgroundColor: '#fff',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#fafafa',
          },
        }}
      />

      {/* Backdrop loader */}
      <Backdrop open={loading} sx={{ zIndex: 1201 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Application</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Resume URL</Typography>
          <TextField
            fullWidth
            placeholder="https://your-resume.pdf"
            value={editForm.resumeUrl}
            onChange={(e) => setEditForm({ ...editForm, resumeUrl: e.target.value })}
          />

          <Typography variant="subtitle2" mt={2} gutterBottom>Cover Letter</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder="A brief cover letter..."
            value={editForm.coverLetter}
            onChange={(e) => setEditForm({ ...editForm, coverLetter: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
