import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs } from '../../store/jobSlice';
import { getAllJobs } from '../../api/jobApi';
import { applyToJob } from '../../api/applicationApi';

const ViewJobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        dispatch(setJobs(data?.jobs));
      } catch (err) {
        console.error('Failed to load jobs', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [dispatch]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setResumeUrl('');
    setCoverLetter('');
    setFormError('');
  };

  const handleSubmitApplication = async () => {
    setFormError('');

    if (!resumeUrl.trim() || !coverLetter.trim()) {
      setFormError('Both Resume URL and Cover Letter are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { resumeUrl, coverLetter };
      await applyToJob(selectedJob.id, payload);

      setSnackbar({
        open: true,
        message: 'Application submitted successfully.',
        severity: 'success',
      });
      handleCloseForm();
    } catch (error) {
      const errMsg = error?.response?.data?.error || 'Failed to apply. Please try again.';
      setSnackbar({ open: true, message: errMsg, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Browse Available Jobs
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Job Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          mt: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} variant="outlined" sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
                <Skeleton variant="rounded" width={100} height={36} sx={{ mt: 2 }} />
              </Card>
            ))
          : jobs.map((job) => (
              <Card
                key={job.id}
                variant="outlined"
                sx={{
                  p: 2,
                  transition: '0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <WorkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {job.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip
                      label={job.status}
                      size="small"
                      color={job.status === 'OPEN' ? 'success' : 'default'}
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocationOnIcon />}
                      label={job.location || 'Remote'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description?.slice(0, 120) || 'No description provided.'}
                    {job.description?.length > 120 ? '...' : ''}
                  </Typography>
                </CardContent>

                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => handleApplyClick(job)}
                  disabled={job.status !== 'OPEN'}
                >
                  Apply
                </Button>
              </Card>
            ))}
      </Box>

      {/* Application Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <TextField
            margin="dense"
            label="Resume Link (Google Drive / PDF URL)"
            placeholder="https://drive.google.com/..."
            fullWidth
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Cover Letter"
            placeholder="Why are you a great fit for this job?"
            fullWidth
            multiline
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitApplication} disabled={submitting}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewJobs;
