import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  User, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Download
} from 'lucide-react';

const EnrollmentCertificateAdmin = () => {
  // State management
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('enrollments');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    course: '',
    enrollment: '',
    status: 'Pending'
  });
  const [certificateImage, setCertificateImage] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Mock API functions (replace with actual API calls)
  const api = {
    enrollments: {
      getAll: async () => {
        // Simulating API call with sample data
        return {
          success: true,
          data: [
            {
              _id: '688d9fd370d147234232e4f8',
              user: {
                _id: '68833a96cf0dbd0119c3db24',
                firstName: 'Ganapathi',
                lastName: 'Varma',
                email: 'varma@gmail.com',
                profilePicture: null
              },
              course: {
                _id: '6889061c4a243533caea224f',
                name: 'PYTHON',
                image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1753810458/uploads/jiscmschue6ndmvvsiif.webp'
              },
              performance: {
                theoreticalPercentage: 70,
                practicalPercentage: 92,
                grade: 'A'
              },
              status: 'enrolled',
              rank: 1
            },
            {
              _id: '688da08570d147234232e4fb',
              user: {
                _id: '688339b4cf0dbd0119c3db21',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                profilePicture: null
              },
              course: {
                _id: '6889061c4a243533caea224f',
                name: 'PYTHON',
                image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1753810458/uploads/jiscmschue6ndmvvsiif.webp'
              },
              performance: {
                theoreticalPercentage: 82,
                practicalPercentage: 70,
                grade: 'A'
              },
              status: 'enrolled',
              rank: 3
            }
          ]
        };
      },
      create: async (data) => ({ success: true }),
      update: async (id, data) => ({ success: true }),
      delete: async (id) => ({ success: true })
    },
    certificates: {
      getAll: async () => ({
        success: true,
        data: [
          {
            _id: '688dbd22cdfda9419251425f',
            user: {
              _id: '688339b4cf0dbd0119c3db21',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com'
            },
            enrollment: {
              _id: '688da08570d147234232e4fb',
              course: {
                _id: '6889061c4a243533caea224f',
                name: 'PYTHON',
                image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1753810458/uploads/jiscmschue6ndmvvsiif.webp'
              }
            },
            status: {
              type: 'Completed',
              image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1754119460/uploads/aqrngl0pm6ef8wkbxmao.png'
            }
          }
        ]
      }),
      create: async (data) => ({ success: true }),
      update: async (id, data) => ({ success: true }),
      delete: async (id) => ({ success: true })
    },
    users: {
      getAll: async () => ({
        success: true,
        data: [
          { _id: '68833a96cf0dbd0119c3db24', firstName: 'Ganapathi', lastName: 'Varma', email: 'varma@gmail.com' },
          { _id: '688339b4cf0dbd0119c3db21', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
          { _id: '68839831a3e1d9e110f71081', firstName: 'Vijay', lastName: 'N', email: 'admin@gmail.com' }
        ]
      })
    },
    courses: {
      getAll: async () => ({
        success: true,
        data: [
          {
            _id: '6889061c4a243533caea224f',
            name: 'PYTHON',
            image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1753810458/uploads/jiscmschue6ndmvvsiif.webp'
          },
          {
            _id: '688906d54a243533caea225d',
            name: 'UI DESIGN',
            image: 'https://res.cloudinary.com/dwmna13fi/image/upload/v1753810643/uploads/wg27orxarhaeie06j4p2.jpg'
          }
        ]
      })
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [enrollmentsRes, certificatesRes, usersRes, coursesRes] = await Promise.all([
        api.enrollments.getAll(),
        api.certificates.getAll(),
        api.users.getAll(),
        api.courses.getAll()
      ]);

      setEnrollments(enrollmentsRes.data || []);
      setCertificates(certificatesRes.data || []);
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      showNotification('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const getUserFullName = (user) => {
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'enrolled': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Issued': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Revoked': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    if (item) {
      if (selectedTab === 'enrollments') {
        setFormData({
          user: item.user?._id || '',
          course: item.course?._id || '',
          enrollment: item._id || '',
          status: item.status || 'Pending'
        });
      } else {
        setFormData({
          user: item.user?._id || '',
          course: item.enrollment?.course?._id || '',
          enrollment: item.enrollment?._id || '',
          status: item.status?.type || 'Pending'
        });
      }
    } else {
      setFormData({
        user: '',
        course: '',
        enrollment: '',
        status: 'Pending'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setCertificateImage(null);
    setFormData({
      user: '',
      course: '',
      enrollment: '',
      status: 'Pending'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTab === 'enrollments') {
        const submitData = {
          user: formData.user,
          course: formData.course,
          status: formData.status
        };

        if (currentItem) {
          await api.enrollments.update(currentItem._id, submitData);
          showNotification('Enrollment updated successfully');
        } else {
          await api.enrollments.create(submitData);
          showNotification('Enrollment created successfully');
        }
      } else {
        // Certificate handling would include FormData for image upload
        const action = currentItem ? 'updated' : 'created';
        showNotification(`Certificate ${action} successfully`);
      }
      
      loadData();
      handleCloseModal();
    } catch (error) {
      showNotification('Operation failed', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        if (type === 'enrollment') {
          await api.enrollments.delete(id);
        } else {
          await api.certificates.delete(id);
        }
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        loadData();
      } catch (error) {
        showNotification('Delete operation failed', 'error');
      }
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const searchLower = searchTerm.toLowerCase();
    const userFullName = getUserFullName(enrollment.user).toLowerCase();
    const courseName = enrollment.course?.name?.toLowerCase() || '';
    const status = enrollment.status?.toLowerCase() || '';
    
    return userFullName.includes(searchLower) || 
           courseName.includes(searchLower) || 
           status.includes(searchLower);
  });

  const filteredCertificates = certificates.filter(certificate => {
    const searchLower = searchTerm.toLowerCase();
    const userFullName = getUserFullName(certificate.user).toLowerCase();
    const courseName = certificate.enrollment?.course?.name?.toLowerCase() || '';
    const status = certificate.status?.type?.toLowerCase() || '';
    
    return userFullName.includes(searchLower) || 
           courseName.includes(searchLower) || 
           status.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enrollment & Certificate Management</h1>
        <p className="text-gray-600">Manage student enrollments and certificates</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Search and Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by user, course, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New {selectedTab === 'enrollments' ? 'Enrollment' : 'Certificate'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('enrollments')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'enrollments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Enrollments ({enrollments.length})
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('certificates')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              selectedTab === 'certificates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certificates ({certificates.length})
            </div>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Enrollments Tab */}
          {selectedTab === 'enrollments' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollments.length > 0 ? (
                      filteredEnrollments.map((enrollment) => (
                        <tr key={enrollment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                  {enrollment.user?.firstName?.charAt(0)}{enrollment.user?.lastName?.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getUserFullName(enrollment.user)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {enrollment.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={enrollment.course?.image}
                                alt={enrollment.course?.name}
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.course?.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.performance ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Theory:</span>
                                  <span className={`text-sm font-medium ${getPerformanceColor(enrollment.performance.theoreticalPercentage)}`}>
                                    {enrollment.performance.theoreticalPercentage}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Practical:</span>
                                  <span className={`text-sm font-medium ${getPerformanceColor(enrollment.performance.practicalPercentage)}`}>
                                    {enrollment.performance.practicalPercentage}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Grade: {enrollment.performance.grade}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No data</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenModal(enrollment)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('enrollment', enrollment._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No enrollments found {searchTerm && 'matching your search'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {selectedTab === 'certificates' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCertificates.length > 0 ? (
                      filteredCertificates.map((certificate) => (
                        <tr key={certificate._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                  {certificate.user?.firstName?.charAt(0)}{certificate.user?.lastName?.charAt(0)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getUserFullName(certificate.user)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {certificate.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={certificate.enrollment?.course?.image}
                                alt={certificate.enrollment?.course?.name}
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                              <div className="text-sm font-medium text-gray-900">
                                {certificate.enrollment?.course?.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(certificate.status?.type)}`}>
                              {certificate.status?.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {certificate.status?.image ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={certificate.status.image}
                                  alt="Certificate"
                                  className="h-16 w-20 object-cover rounded border"
                                />
                                <button
                                  onClick={() => window.open(certificate.status.image, '_blank')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">No certificate</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenModal(certificate)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('certificate', certificate._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No certificates found {searchTerm && 'matching your search'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentItem ? 'Edit' : 'Create New'} {selectedTab === 'enrollments' ? 'Enrollment' : 'Certificate'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User *
                  </label>
                  <select
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {getUserFullName(user)} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Enrollment Selection for Certificates */}
                {selectedTab === 'certificates' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Enrollment (Optional)
                    </label>
                    <select
                      value={formData.enrollment}
                      onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose an enrollment...</option>
                      {enrollments.map(enrollment => (
                        <option key={enrollment._id} value={enrollment._id}>
                          {getUserFullName(enrollment.user)} - {enrollment.course?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {selectedTab === 'enrollments' ? (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="completed">Completed</option>
                      </>
                    ) : (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="Issued">Issued</option>
                        <option value="Completed">Completed</option>
                        <option value="Revoked">Revoked</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Certificate Image Upload */}
                {selectedTab === 'certificates' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Image {!currentItem?.status?.image && '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="certificate-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Drop certificate image here or click to upload
                          </span>
                          <input
                            id="certificate-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCertificateImage(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {certificateImage && (
                      <div className="mt-4">
                        <img
                          src={URL.createObjectURL(certificateImage)}
                          alt="Certificate preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <p className="mt-2 text-sm text-gray-600">{certificateImage.name}</p>
                      </div>
                    )}

                    {/* Current Image */}
                    {currentItem?.status?.image && !certificateImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current certificate:</p>
                        <img
                          src={currentItem.status.image}
                          alt="Current certificate"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      selectedTab === 'enrollments' 
                        ? (!formData.user || !formData.course)
                        : (!formData.user || !formData.course || (!certificateImage && !currentItem?.status?.image))
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentCertificateAdmin;