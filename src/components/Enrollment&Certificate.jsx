import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';

const EnrollmentAndCertificate = () => {
  // State management
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    course: '',
    status: 'Pending'
  });
  const [certificateImage, setCertificateImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEnrollments(),
        fetchCertificates(),
        fetchUsers(),
        fetchCourses()
      ]);
    } catch (error) {
      showErrorAlert('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // API calls
  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('https://hicap-backend-4rat.onrender.com/api/enrollments');
      setEnrollments(response.data.data || []);
    } catch (error) {
      showErrorAlert('Failed to fetch enrollments');
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('https://hicap-backend-4rat.onrender.com/api/certificates');
      setCertificates(response.data.data || []);
    } catch (error) {
      showErrorAlert('Failed to fetch certificates');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://hicap-backend-4rat.onrender.com/api/userregister');
      setUsers(response.data.data || []);
    } catch (error) {
      showErrorAlert('Failed to fetch users');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://hicap-backend-4rat.onrender.com/api/course1');
      setCourses(response.data.data || []);
    } catch (error) {
      showErrorAlert('Failed to fetch courses');
    }
  };

  // Alert functions
  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  const showConfirmationAlert = (title, text, confirmCallback) => {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      }
    });
  };

  // Helper functions
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = (item = null) => {
    setCurrentItem(item);
    if (item) {
      setFormData({
        user: item.user?._id || '',
        course: item.course?._id || '',
        status: item.status?.type || 'Pending'
      });
    } else {
      setFormData({
        user: '',
        course: '',
        status: 'Pending'
      });
    }
    setOpenDialog(true);
    setUserSearchTerm('');
    setCourseSearchTerm('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
    setCertificateImage(null);
    setUserSearchTerm('');
    setCourseSearchTerm('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setCertificateImage(e.target.files[0]);
  };

  // Form submissions
  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await axios.put(`https://hicap-backend-4rat.onrender.com/api/enrollments/${currentItem._id}`, formData);
        showSuccessAlert('Enrollment updated successfully');
      } else {
        await axios.post('https://hicap-backend-4rat.onrender.com/api/enrollments', formData);
        showSuccessAlert('Enrollment created successfully');
      }
      fetchEnrollments();
      handleCloseDialog();
    } catch (error) {
      showErrorAlert(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleCertificateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user', formData.user);
      formDataToSend.append('course', formData.course);
      formDataToSend.append('status', JSON.stringify({
        type: formData.status,
        image: certificateImage ? '' : currentItem?.status?.image || ''
      }));
      
      if (certificateImage) {
        formDataToSend.append('image', certificateImage);
      }

      if (currentItem) {
        await axios.put(
          `https://hicap-backend-4rat.onrender.com/api/certificate/${currentItem._id}`, 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSuccessAlert('Certificate updated successfully');
      } else {
        await axios.post(
          'https://hicap-backend-4rat.onrender.com/api/certificate', 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSuccessAlert('Certificate created successfully');
      }
      fetchCertificates();
      handleCloseDialog();
    } catch (error) {
      showErrorAlert(error.response?.data?.message || 'Error processing request');
    }
  };

  const handleDelete = async (type, id) => {
    showConfirmationAlert(
      'Are you sure?',
      `You are about to delete this ${type}. This action cannot be undone.`,
      async () => {
        try {
          if (type === 'enrollment') {
            await axios.delete(`https://hicap-backend-4rat.onrender.com/api/enrollments/${id}`);
            fetchEnrollments();
          } else {
            await axios.delete(`https://hicap-backend-4rat.onrender.com/api/certificate/${id}`);
            fetchCertificates();
          }
          showSuccessAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        } catch (error) {
          showErrorAlert(error.response?.data?.message || 'Error deleting item');
        }
      }
    );
  };

  // Enhanced search functions
  const searchMainItems = (items, type) => {
    if (!searchTerm) return items;
    
    const searchLower = searchTerm.toLowerCase();
    
    return items.filter(item => {
      const userFullName = item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.toLowerCase() : '';
      const courseName = item.course?.name?.toLowerCase() || '';
      const status = type === 'enrollment' 
        ? item.status?.toLowerCase() || ''
        : item.status?.type?.toLowerCase() || '';
      
      return (
        userFullName.includes(searchLower) ||
        courseName.includes(searchLower) ||
        status.includes(searchLower)
      );
    });
  };

  const filterUsers = (users, searchTerm) => {
    if (!searchTerm) return users;
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => {
      const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      return userFullName.includes(searchLower);
    });
  };

  const filterCourses = (courses, searchTerm) => {
    if (!searchTerm) return courses;
    const searchLower = searchTerm.toLowerCase();
    return courses.filter(course => 
      course.name.toLowerCase().includes(searchLower)
    );
  };

  const filteredEnrollments = searchMainItems(enrollments, 'enrollment');
  const filteredCertificates = searchMainItems(certificates, 'certificate');
  const filteredUsers = filterUsers(users, userSearchTerm);
  const filteredCourses = filterCourses(courses, courseSearchTerm);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enrollment & Certificate Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Search by user, course, or status..."
        />
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Enrollments" />
          <Tab label="Certificates" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6">Loading data...</Typography>
        </Box>
      ) : (
        <>
          {selectedTab === 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
              >
                Add New Enrollment
              </Button>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEnrollments.length > 0 ? (
                      filteredEnrollments.map((enrollment) => (
                        <TableRow key={enrollment._id}>
                          <TableCell>{`${enrollment.user?.firstName || ''} ${enrollment.user?.lastName || ''}`}</TableCell>
                          <TableCell>{enrollment.course?.name || 'N/A'}</TableCell>
                          <TableCell>{enrollment.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenDialog(enrollment)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete('enrollment', enrollment._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No enrollments found {searchTerm ? 'matching your search' : ''}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {selectedTab === 1 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
              >
                Add New Certificate
              </Button>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Certificate</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertificates.length > 0 ? (
                      filteredCertificates.map((certificate) => (
                        <TableRow key={certificate._id}>
                          <TableCell>{certificate.user ? `${certificate.user.firstName || ''} ${certificate.user.lastName || ''}` : 'N/A'}</TableCell>
                          <TableCell>{certificate.course?.name || 'N/A'}</TableCell>
                          <TableCell>{certificate.status?.type || 'N/A'}</TableCell>
                          <TableCell>
                            {certificate.status?.image ? (
                              <img
                                src={certificate.status.image}
                                alt="Certificate"
                                style={{ width: 100, height: 'auto', maxHeight: 100, objectFit: 'contain' }}
                              />
                            ) : (
                              'No image'
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenDialog(certificate)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete('certificate', certificate._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No certificates found {searchTerm ? 'matching your search' : ''}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}

      {/* Dialog for creating/editing items */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentItem ? 'Edit' : 'Create New'} {selectedTab === 0 ? 'Enrollment' : 'Certificate'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                options={filteredUsers}
                getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
                value={users.find(user => user._id === formData.user) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, user: newValue?._id || '' });
                }}
                inputValue={userSearchTerm}
                onInputChange={(event, newInputValue) => {
                  setUserSearchTerm(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select User"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Autocomplete
                options={filteredCourses}
                getOptionLabel={(course) => course.name}
                value={courses.find(course => course._id === formData.course) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, course: newValue?._id || '' });
                }}
                inputValue={courseSearchTerm}
                onInputChange={(event, newInputValue) => {
                  setCourseSearchTerm(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Course"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>

            {selectedTab === 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="enrolled">Enrolled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}

            {selectedTab === 1 && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                    required
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Issued">Issued</MenuItem>
                    <MenuItem value="Revoked">Revoked</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                  fullWidth
                >
                  Upload Certificate Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {certificateImage && (
                  <Card sx={{ mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={URL.createObjectURL(certificateImage)}
                      alt="Certificate preview"
                      sx={{ objectFit: 'contain' }}
                    />
                    <CardContent>
                      <Typography variant="body2">
                        {certificateImage.name}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {currentItem?.status?.image && !certificateImage && (
                  <Card sx={{ mb: 2 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={currentItem.status.image}
                      alt="Current certificate"
                      sx={{ objectFit: 'contain' }}
                    />
                  </Card>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={selectedTab === 0 ? handleEnrollmentSubmit : handleCertificateSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.user || !formData.course || (selectedTab === 1 && !certificateImage && !currentItem?.status?.image)}
          >
            {currentItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollmentAndCertificate;