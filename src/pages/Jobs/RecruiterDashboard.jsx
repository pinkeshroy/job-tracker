import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Chip,
  MenuItem,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { createJob, getAllJobs } from "../../api/jobApi";
import {
  getApplicationsForJob,
  updateApplication,
} from "../../api/applicationApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salaryRange: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();
      setJobs(res?.jobs || []);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to load jobs",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId, overridePage = 1) => {
    try {
      setSelectedJobId(jobId);
      setPage(overridePage);
      const res = await getApplicationsForJob(jobId, {
        status: statusFilter || undefined,
        sortBy: "appliedAt",
        order: "desc",
        page: overridePage,
        limit,
      });
      setApplications(res.data);
      setPagination(res.pagination);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to fetch applications",
        severity: "error",
      });
    }
  };
  const role = useSelector((state) => state?.auth?.role);
  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "RECRUITER") {
      navigate("/unauthorized");
    }
    fetchJobs();
  }, []);

  const handleJobFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async () => {
    try {
      await createJob(jobForm);
      setSnackbar({
        open: true,
        message: "Job posted successfully!",
        severity: "success",
      });
      setJobDialogOpen(false);
      setJobForm({
        title: "",
        company: "",
        description: "",
        location: "",
        salaryRange: "",
      });
      fetchJobs();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to post job",
        severity: "error",
      });
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await updateApplication(appId, { status });
      setSnackbar({
        open: true,
        message: "Status updated",
        severity: "success",
      });
      fetchApplications(selectedJobId, page);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Recruiter Dashboard
        </Typography>
        <Button variant="contained" onClick={() => setJobDialogOpen(true)}>
          Post New Job
        </Button>
      </Box>

      {/* Job List */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                transition: "0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": { boxShadow: 4, transform: "translateY(-4px)" },
              }}
              onClick={() => fetchApplications(job.id)}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  <WorkIcon
                    fontSize="small"
                    sx={{ mr: 1, verticalAlign: "middle" }}
                  />
                  {job.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip
                    label={job.status}
                    size="small"
                    color={job.status === "OPEN" ? "success" : "default"}
                    variant="outlined"
                  />
                  <Chip
                    icon={<LocationOnIcon />}
                    label={job.location || "Remote"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {job.description?.slice(0, 100) || "No description provided."}
                  {job.description?.length > 100 ? "..." : ""}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Applications */}
      {selectedJobId && (
        <Box mt={5}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            mb={2}
          >
            <Typography variant="h5" fontWeight="bold">
              Applications for Job ID #{selectedJobId}
            </Typography>
            <TextField
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                fetchApplications(selectedJobId, 1);
              }}
              size="small"
              sx={{ width: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="APPLIED">Applied</MenuItem>
              <MenuItem value="INTERVIEW">Interview</MenuItem>
              <MenuItem value="OFFER">Offer</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Box>

          <Grid container spacing={2}>
            {applications.map((app) => (
              <Grid mb={2} item xs={12} sm={6} md={4} key={app.id}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    boxShadow: 1,
                    transition: "0.2s",
                    gap: "5px",
                    minWidth: "350px",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {app.user.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    📧 {app.user.email}
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    📎 Resume:{" "}
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      View
                    </a>
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    📝 {app.coverLetter || "No cover letter"}
                  </Typography>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={app.status}
                      size="small"
                      color={
                        app.status === "OFFER"
                          ? "success"
                          : app.status === "INTERVIEW"
                          ? "warning"
                          : app.status === "REJECTED"
                          ? "error"
                          : "default"
                      }
                    />

                    <TextField
                      select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusUpdate(app.id, e.target.value)
                      }
                      size="small"
                      sx={{ width: 130 }}
                    >
                      <MenuItem value="APPLIED">Applied</MenuItem>
                      <MenuItem value="INTERVIEW">Interview</MenuItem>
                      <MenuItem value="OFFER">Offer</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </TextField>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => fetchApplications(selectedJobId, page - 1)}
              >
                Previous
              </Button>
              <Typography mt={1}>
                Page {page} of {pagination.totalPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={page === pagination.totalPages}
                onClick={() => fetchApplications(selectedJobId, page + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Create Job Dialog */}
      <Dialog
        open={jobDialogOpen}
        onClose={() => setJobDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Post a Job</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              name="title"
              label="Job Title"
              value={jobForm.title}
              onChange={handleJobFormChange}
              fullWidth
            />
            <TextField
              name="company"
              label="Company"
              value={jobForm.company}
              onChange={handleJobFormChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={jobForm.description}
              onChange={handleJobFormChange}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              name="location"
              label="Location"
              value={jobForm.location}
              onChange={handleJobFormChange}
              fullWidth
            />
            <TextField
              name="salaryRange"
              label="Salary Range (e.g. ₹8L–₹12L)"
              value={jobForm.salaryRange}
              onChange={handleJobFormChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateJob}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecruiterDashboard;
