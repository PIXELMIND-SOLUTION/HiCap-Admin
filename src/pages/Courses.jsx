import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  BookOpen,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import Swal from 'sweetalert2';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mode: 'online',
    category: '',
    subcategory: '',
    duration: '',
    price: '',
    noOfLessons: '',
    noOfStudents: '',
    image: '',
    faq: [{ question: '', answer: '' }],
    courseObject: [{ title: '', content: '' }],
    features: [{ title: '', image: '' }],
    rating: 0,
    reviewCount: 0,
    isPopular: false,
    isHighRated: false,
    status: 'available'
  });
  const [formErrors, setFormErrors] = useState({});
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const API_BASE_URL = 'https://hicap-backend-4rat.onrender.com/api/course1';

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Course name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.subcategory.trim()) errors.subcategory = 'Subcategory is required';
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.noOfLessons) errors.noOfLessons = 'Number of lessons is required';
    
    // Validate FAQs
    formData.faq.forEach((faq, index) => {
      if (!faq.question.trim()) errors[`faq-${index}-question`] = 'Question is required';
      if (!faq.answer.trim()) errors[`faq-${index}-answer`] = 'Answer is required';
    });

    // Validate course objects
    formData.courseObject.forEach((obj, index) => {
      if (!obj.title.trim()) errors[`courseObject-${index}-title`] = 'Title is required';
      if (!obj.content.trim()) errors[`courseObject-${index}-content`] = 'Content is required';
    });

    // Validate features
    formData.features.forEach((feature, index) => {
      if (!feature.title.trim()) errors[`features-${index}-title`] = 'Title is required';
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      if (data.success) {
        setCourses(data.data || []);
      } else {
        Swal.fire('Error', 'Failed to fetch courses', 'error');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire('Error', 'Failed to fetch courses', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fill all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Create a course data object
      const courseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        mode: formData.mode,
        category: formData.category.trim(),
        subcategory: formData.subcategory.trim(),
        duration: formData.duration.trim(),
        price: parseFloat(formData.price),
        noOfLessons: parseInt(formData.noOfLessons),
        noOfStudents: parseInt(formData.noOfStudents) || 0,
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        isPopular: formData.isPopular,
        isHighRated: formData.isHighRated,
        status: formData.status,
        faq: formData.faq.map(faq => ({
          question: faq.question.trim(),
          answer: faq.answer.trim()
        })),
        courseObject: formData.courseObject.map(obj => ({
          title: obj.title.trim(),
          content: obj.content.trim()
        })),
        features: formData.features.map(feature => ({
          title: feature.title.trim(),
          image: feature.image // Will be handled separately
        }))
      };

      // Append the course data as JSON
      formDataToSend.append('data', JSON.stringify(courseData));

      // Handle main image
      if (formData.image) {
        if (formData.image instanceof File) {
          formDataToSend.append('image', formData.image);
        } else if (typeof formData.image === 'string') {
          // If it's an existing image URL, include it in the data
          courseData.image = formData.image;
        }
      }

      // Handle feature images
      formData.features.forEach((feature, index) => {
        if (feature.image && feature.image instanceof File) {
          formDataToSend.append(`features[${index}][image]`, feature.image);
        }
      });

      const method = modalMode === 'create' ? 'POST' : 'PUT';
      const url = modalMode === 'create' ? API_BASE_URL : `${API_BASE_URL}/${selectedCourse._id}`;

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save course');
      }

      if (data.success) {
        Swal.fire(
          'Success',
          modalMode === 'create' ? 'Course created successfully!' : 'Course updated successfully!',
          'success'
        );
        fetchCourses();
        setShowModal(false);
        resetForm();
      } else {
        throw new Error(data.message || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      Swal.fire('Error', error.message || 'Failed to save course', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'main') {
      setFormData(prev => ({ ...prev, image: file }));
    } else if (type === 'feature' && index !== null) {
      const updatedFeatures = [...formData.features];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        image: file
      };
      setFormData(prev => ({ ...prev, features: updatedFeatures }));
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          Swal.fire(
            'Deleted!',
            'Course has been deleted.',
            'success'
          );
          fetchCourses();
        } else {
          Swal.fire('Error', data.message || 'Failed to delete course', 'error');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        Swal.fire('Error', 'Failed to delete course', 'error');
      }
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      mode: 'online',
      category: '',
      subcategory: '',
      duration: '',
      price: '',
      noOfLessons: '',
      noOfStudents: '',
      image: '',
      faq: [{ question: '', answer: '' }],
      courseObject: [{ title: '', content: '' }],
      features: [{ title: '', image: '' }],
      rating: 0,
      reviewCount: 0,
      isPopular: false,
      isHighRated: false,
      status: 'available'
    });
    setFormErrors({});
    setSelectedCourse(null);
  };

  // Open modal with course data
  const openModal = (mode, course = null) => {
    setModalMode(mode);
    if (course) {
      setSelectedCourse(course);
      setFormData({
        name: course.name || '',
        description: course.description || '',
        mode: course.mode || 'online',
        category: course.category || '',
        subcategory: course.subcategory || '',
        duration: course.duration || '',
        price: course.price || '',
        noOfLessons: course.noOfLessons || '',
        noOfStudents: course.noOfStudents || '',
        image: course.image || '',
        faq: course.faq?.length > 0 ? course.faq : [{ question: '', answer: '' }],
        courseObject: course.courseObject?.length > 0 ? course.courseObject : [{ title: '', content: '' }],
        features: course.features?.length > 0 ? course.features : [{ title: '', image: '' }],
        rating: course.rating || 0,
        reviewCount: course.reviewCount || 0,
        isPopular: course.isPopular || false,
        isHighRated: course.isHighRated || false,
        status: course.status || 'available'
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  // Helper functions for dynamic form fields
  const addArrayItem = (field) => {
    const newItem = field === 'faq' 
      ? { question: '', answer: '' }
      : field === 'courseObject'
      ? { title: '', content: '' }
      : { title: '', image: '' };
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], newItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const toggleExpandCourse = (id) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  // Pagination and filtering
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const categories = [...new Set(courses.map(course => course.category).filter(Boolean))];
  const statusOptions = ['available', 'coming soon', 'archived'];

  // Helper function to get image source
  const getImageSrc = (image) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  // Render the component
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="h4 mb-1">Course Management</h1>
              <p className="text-muted mb-0">Manage your courses, lessons, and content</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button 
                variant="primary" 
                onClick={() => openModal('create')}
                className="d-inline-flex align-items-center"
              >
                <Plus size={18} className="me-1" />
                Add New Course
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <Filter size={18} />
                </InputGroup.Text>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Courses Table */}
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Mode</th>
                      <th>Price</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCourses.length > 0 ? (
                      currentCourses.map(course => (
                        <React.Fragment key={course._id}>
                          <tr>
                            <td>
                              <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => toggleExpandCourse(course._id)}
                                className="p-0"
                              >
                                {expandedCourse === course._id ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </Button>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {course.image && (
                                  <img 
                                    src={course.image} 
                                    alt={course.name} 
                                    className="rounded me-3" 
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                  />
                                )}
                                <div>
                                  <div className="fw-semibold">{course.name}</div>
                                  <div className="text-muted small">{course.duration}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>{course.category}</div>
                              <div className="text-muted small">{course.subcategory}</div>
                            </td>
                            <td>
                              <Badge bg={course.mode === 'online' ? 'info' : 'warning'}>
                                {course.mode}
                              </Badge>
                            </td>
                            <td className="fw-semibold">₹{course.price}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Users size={16} className="me-1" />
                                {course.noOfStudents || 0}
                              </div>
                            </td>
                            <td>
                              <Badge 
                                bg={
                                  course.status === 'available' ? 'success' : 
                                  course.status === 'coming soon' ? 'primary' : 'secondary'
                                }
                              >
                                {course.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  onClick={() => openModal('view', course)}
                                  title="View"
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  onClick={() => openModal('edit', course)}
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  onClick={() => deleteCourse(course._id)}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {expandedCourse === course._id && (
                            <tr>
                              <td colSpan="8">
                                <div className="p-3 bg-light">
                                  <Row>
                                    <Col md={6}>
                                      <h6 className="fw-semibold mb-3">Course Details</h6>
                                      <p>{course.description}</p>
                                      <div className="d-flex flex-wrap gap-2 mb-3">
                                        <Badge bg="light" text="dark">
                                          <Clock size={14} className="me-1" />
                                          {course.noOfLessons} lessons
                                        </Badge>
                                        <Badge bg="light" text="dark">
                                          <Star size={14} className="me-1" />
                                          {course.rating} ({course.reviewCount} reviews)
                                        </Badge>
                                        {course.isPopular && (
                                          <Badge bg="warning" text="dark">
                                            Popular
                                          </Badge>
                                        )}
                                        {course.isHighRated && (
                                          <Badge bg="danger" text="white">
                                            High Rated
                                          </Badge>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md={6}>
                                      <h6 className="fw-semibold mb-3">Features</h6>
                                      <Row>
                                        {course.features?.map((feature, index) => (
                                          <Col key={index} xs={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                              {feature.image && (
                                                <img 
                                                  src={feature.image} 
                                                  alt={feature.title} 
                                                  className="rounded me-2" 
                                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }} 
                                                />
                                              )}
                                              <span>{feature.title}</span>
                                            </div>
                                          </Col>
                                        ))}
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredCourses.length > itemsPerPage && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Course Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Add New Course' : 
             modalMode === 'edit' ? 'Edit Course' : 'Course Details'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {modalMode === 'view' ? (
              <div>
                {selectedCourse?.image && (
                  <img
                    src={selectedCourse.image}
                    alt={selectedCourse.name}
                    className="img-fluid rounded mb-4"
                  />
                )}
                <Row>
                  <Col md={6}>
                    <h5 className="fw-semibold">Basic Information</h5>
                    <dl className="row">
                      <dt className="col-sm-4">Name</dt>
                      <dd className="col-sm-8">{selectedCourse?.name}</dd>

                      <dt className="col-sm-4">Description</dt>
                      <dd className="col-sm-8">{selectedCourse?.description}</dd>

                      <dt className="col-sm-4">Category</dt>
                      <dd className="col-sm-8">{selectedCourse?.category}</dd>

                      <dt className="col-sm-4">Subcategory</dt>
                      <dd className="col-sm-8">{selectedCourse?.subcategory}</dd>

                      <dt className="col-sm-4">Mode</dt>
                      <dd className="col-sm-8">
                        <Badge bg={selectedCourse?.mode === 'online' ? 'info' : 'warning'}>
                          {selectedCourse?.mode}
                        </Badge>
                      </dd>

                      <dt className="col-sm-4">Duration</dt>
                      <dd className="col-sm-8">{selectedCourse?.duration}</dd>

                      <dt className="col-sm-4">Price</dt>
                      <dd className="col-sm-8">₹{selectedCourse?.price}</dd>
                    </dl>
                  </Col>
                  <Col md={6}>
                    <h5 className="fw-semibold">Additional Information</h5>
                    <dl className="row">
                      <dt className="col-sm-4">Lessons</dt>
                      <dd className="col-sm-8">{selectedCourse?.noOfLessons}</dd>

                      <dt className="col-sm-4">Students</dt>
                      <dd className="col-sm-8">{selectedCourse?.noOfStudents}</dd>

                      <dt className="col-sm-4">Rating</dt>
                      <dd className="col-sm-8">
                        <Star size={16} className="text-warning me-1" />
                        {selectedCourse?.rating} ({selectedCourse?.reviewCount} reviews)
                      </dd>

                      <dt className="col-sm-4">Status</dt>
                      <dd className="col-sm-8">
                        <Badge 
                          bg={
                            selectedCourse?.status === 'available' ? 'success' : 
                            selectedCourse?.status === 'coming soon' ? 'primary' : 'secondary'
                          }
                        >
                          {selectedCourse?.status}
                        </Badge>
                      </dd>

                      <dt className="col-sm-4">Popular</dt>
                      <dd className="col-sm-8">
                        {selectedCourse?.isPopular ? 'Yes' : 'No'}
                      </dd>

                      <dt className="col-sm-4">High Rated</dt>
                      <dd className="col-sm-8">
                        {selectedCourse?.isHighRated ? 'Yes' : 'No'}
                      </dd>
                    </dl>
                  </Col>
                </Row>

                {selectedCourse?.features?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="fw-semibold">Features</h5>
                    <Row>
                      {selectedCourse.features.map((feature, index) => (
                        <Col key={index} md={6} className="mb-3">
                          <Card>
                            <Card.Body>
                              <div className="d-flex align-items-center">
                                {feature.image && (
                                  <img 
                                    src={feature.image} 
                                    alt={feature.title} 
                                    className="rounded me-3" 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                  />
                                )}
                                <h6 className="mb-0">{feature.title}</h6>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {selectedCourse?.faq?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="fw-semibold">FAQ</h5>
                    <div className="accordion" id="faqAccordion">
                      {selectedCourse.faq.map((faq, index) => (
                        <Card key={index} className="mb-2">
                          <Card.Header>
                            <h6 className="mb-0">
                              <button 
                                className="btn btn-link" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target={`#faqCollapse${index}`}
                              >
                                {faq.question}
                              </button>
                            </h6>
                          </Card.Header>
                          <div id={`faqCollapse${index}`} className="collapse" data-bs-parent="#faqAccordion">
                            <Card.Body>
                              {faq.answer}
                            </Card.Body>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCourse?.courseObject?.length > 0 && (
                  <div className="mt-4">
                    <h5 className="fw-semibold">Course Content</h5>
                    <div className="list-group">
                      {selectedCourse.courseObject.map((obj, index) => (
                        <div key={index} className="list-group-item">
                          <h6 className="mb-1">{obj.title}</h6>
                          <p className="mb-0 text-muted">{obj.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      isInvalid={!!formErrors.name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      isInvalid={!!formErrors.description}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.description}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          isInvalid={!!formErrors.category}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.category}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subcategory *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                          isInvalid={!!formErrors.subcategory}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.subcategory}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mode</Form.Label>
                        <Form.Select
                          value={formData.mode}
                          onChange={(e) => setFormData({...formData, mode: e.target.value})}
                        >
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="hybrid">Hybrid</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price (₹) *</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          isInvalid={!!formErrors.price}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.price}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration *</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          isInvalid={!!formErrors.duration}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.duration}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Lessons *</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.noOfLessons}
                          onChange={(e) => setFormData({...formData, noOfLessons: e.target.value})}
                          isInvalid={!!formErrors.noOfLessons}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.noOfLessons}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Number of Students</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.noOfStudents}
                          onChange={(e) => setFormData({...formData, noOfStudents: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rating (0-5)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => setFormData({...formData, rating: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Review Count</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.reviewCount}
                          onChange={(e) => setFormData({...formData, reviewCount: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Popular Course"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="High Rated"
                          checked={formData.isHighRated}
                          onChange={(e) => setFormData({...formData, isHighRated: e.target.checked})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Course Image</Form.Label>
                    <div className="d-flex align-items-center">
                      {formData.image && (
                        <img
                          src={getImageSrc(formData.image)}
                          alt="Course preview"
                          className="img-thumbnail me-3"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'main')}
                        />
                        <Form.Text className="text-muted">
                          Upload a course image
                        </Form.Text>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {modalMode !== 'view' && (
              <>
                {/* Features Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">Features</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addArrayItem('features')}
                    >
                      <Plus size={16} className="me-1" />
                      Add Feature
                    </Button>
                  </div>
                  {formData.features.map((feature, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">Feature {index + 1}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeArrayItem('features', index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Title *</Form.Label>
                              <Form.Control
                                type="text"
                                value={feature.title}
                                onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)}
                                isInvalid={!!formErrors[`features-${index}-title`]}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {formErrors[`features-${index}-title`]}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Image</Form.Label>
                              <div className="d-flex align-items-center">
                                {feature.image && (
                                  <img
                                    src={getImageSrc(feature.image)}
                                    alt="Feature preview"
                                    className="img-thumbnail me-3"
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                  />
                                )}
                                <div>
                                  <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'feature', index)}
                                  />
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {/* FAQ Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">FAQ</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addArrayItem('faq')}
                    >
                      <Plus size={16} className="me-1" />
                      Add FAQ
                    </Button>
                  </div>
                  {formData.faq.map((faq, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">FAQ {index + 1}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeArrayItem('faq', index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Form.Group className="mb-3">
                          <Form.Label>Question *</Form.Label>
                          <Form.Control
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateArrayItem('faq', index, 'question', e.target.value)}
                            isInvalid={!!formErrors[`faq-${index}-question`]}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors[`faq-${index}-question`]}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Answer *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => updateArrayItem('faq', index, 'answer', e.target.value)}
                            isInvalid={!!formErrors[`faq-${index}-answer`]}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors[`faq-${index}-answer`]}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {/* Course Content Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-semibold mb-0">Course Content</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addArrayItem('courseObject')}
                    >
                      <Plus size={16} className="me-1" />
                      Add Content
                    </Button>
                  </div>
                  {formData.courseObject.map((obj, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold">Content {index + 1}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeArrayItem('courseObject', index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <Form.Group className="mb-3">
                          <Form.Label>Title *</Form.Label>
                          <Form.Control
                            type="text"
                            value={obj.title}
                            onChange={(e) => updateArrayItem('courseObject', index, 'title', e.target.value)}
                            isInvalid={!!formErrors[`courseObject-${index}-title`]}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors[`courseObject-${index}-title`]}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Content *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={obj.content}
                            onChange={(e) => updateArrayItem('courseObject', index, 'content', e.target.value)}
                            isInvalid={!!formErrors[`courseObject-${index}-content`]}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {formErrors[`courseObject-${index}-content`]}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            {modalMode !== 'view' && (
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-1" />
                    {modalMode === 'create' ? 'Create Course' : 'Update Course'}
                  </>
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Courses;