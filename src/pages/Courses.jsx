import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', or 'view'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mode: 'Online',
    category: '',
    subcategory: 'course',
    duration: '',
    noOfLessons: 0,
    noOfStudents: 0,
    faq: [],
    features: [],
    reviews: [],
    toolsImages: [],
    image: null,
    logoImage: null,
    pdf: null,
    featureImages: [],
    reviewImages: [],
    toolsImagesFiles: []
  });

  // State for individual inputs
  const [faqInput, setFaqInput] = useState({ question: '', answer: '' });
  const [featureInput, setFeatureInput] = useState({ title: '', image: null });
  const [reviewInput, setReviewInput] = useState({ 
    name: '', 
    rating: '', 
    content: '', 
    image: null 
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://hicap-backend-4rat.onrender.com/api/courseController');
      setCourses(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0] || null
    });
  };

  // Handle multiple file inputs
  const handleMultiFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: Array.from(files)
    });
  };

  // Handle FAQ input changes
  const handleFaqInputChange = (e) => {
    const { name, value } = e.target;
    setFaqInput({
      ...faqInput,
      [name]: value
    });
  };

  // Add FAQ to form data
  const addFaq = () => {
    if (faqInput.question && faqInput.answer) {
      setFormData({
        ...formData,
        faq: [...formData.faq, { question: faqInput.question, answer: faqInput.answer }]
      });
      setFaqInput({ question: '', answer: '' });
    }
  };

  // Remove FAQ from form data
  const removeFaq = (index) => {
    const updatedFaq = [...formData.faq];
    updatedFaq.splice(index, 1);
    setFormData({
      ...formData,
      faq: updatedFaq
    });
  };

  // Handle feature input change
  const handleFeatureInputChange = (e) => {
    const { name, value } = e.target;
    setFeatureInput({
      ...featureInput,
      [name]: value
    });
  };

  // Handle feature image upload
  const handleFeatureImageChange = (e) => {
    setFeatureInput({
      ...featureInput,
      image: e.target.files[0] || null
    });
  };

  // Add feature to form data
  const addFeature = () => {
    if (featureInput.title.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, { 
          title: featureInput.title, 
          image: featureInput.image 
        }]
      });
      setFeatureInput({ title: '', image: null });
      // Reset the file input
      document.getElementById('featureImageInput').value = '';
    }
  };

  // Remove feature from form data
  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  // Handle review input changes
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewInput({
      ...reviewInput,
      [name]: value
    });
  };

  // Handle review image upload
  const handleReviewImageChange = (e) => {
    setReviewInput({
      ...reviewInput,
      image: e.target.files[0] || null
    });
  };

  // Add review to form data
  const addReview = () => {
    if (reviewInput.name && reviewInput.content && reviewInput.rating && reviewInput.image) {
      setFormData({
        ...formData,
        reviews: [...formData.reviews, { 
          name: reviewInput.name, 
          rating: reviewInput.rating, 
          content: reviewInput.content,
          image: reviewInput.image
        }]
      });
      setReviewInput({ name: '', rating: '', content: '', image: null });
      // Reset the file input
      document.getElementById('reviewImageInput').value = '';
    }
  };

  // Remove review from form data
  const removeReview = (index) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews.splice(index, 1);
    setFormData({
      ...formData,
      reviews: updatedReviews
    });
  };

  // Create a new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      
      // Append all fields to form data
      Object.keys(formData).forEach(key => {
        if (key === 'faq' || key === 'features' || key === 'reviews') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image' || key === 'logoImage' || key === 'pdf') {
          if (formData[key]) data.append(key, formData[key]);
        } else if (key === 'featureImages' || key === 'reviewImages' || key === 'toolsImagesFiles') {
          formData[key].forEach(file => {
            data.append(key, file);
          });
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post('https://hicap-backend-4rat.onrender.com/api/courseController', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Course created successfully!');
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      setError('Failed to create course: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Update a course
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      
      // Append all fields to form data
      Object.keys(formData).forEach(key => {
        if (key === 'faq' || key === 'features' || key === 'reviews') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image' || key === 'logoImage' || key === 'pdf') {
          if (formData[key]) data.append(key, formData[key]);
        } else if (key === 'featureImages' || key === 'reviewImages' || key === 'toolsImagesFiles') {
          formData[key].forEach(file => {
            data.append(key, file);
          });
        } else {
          if (formData[key] !== undefined && formData[key] !== null) {
            data.append(key, formData[key]);
          }
        }
      });

      const response = await axios.put(`https://hicap-backend-4rat.onrender.com/api/courseController/${editingCourse._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Course updated successfully!');
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      setError('Failed to update course: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      setLoading(true);
      await axios.delete(`https://hicap-backend-4rat.onrender.com/api/courseController/${id}`);
      setSuccess('Course deleted successfully!');
      fetchCourses();
    } catch (err) {
      setError('Failed to delete course: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Update course stats
  const handleUpdateStats = async (id, field, value) => {
    try {
      await axios.patch(`https://hicap-backend-4rat.onrender.com/api/courseController/${id}/stats`, {
        [field]: value
      });
      setSuccess('Course stats updated successfully!');
      fetchCourses();
    } catch (err) {
      setError('Failed to update course stats: ' + (err.response?.data?.message || err.message));
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      mode: 'Online',
      category: '',
      subcategory: 'course',
      duration: '',
      noOfLessons: 0,
      noOfStudents: 0,
      faq: [],
      features: [],
      reviews: [],
      toolsImages: [],
      image: null,
      logoImage: null,
      pdf: null,
      featureImages: [],
      reviewImages: [],
      toolsImagesFiles: []
    });
    setFaqInput({ question: '', answer: '' });
    setFeatureInput({ title: '', image: null });
    setReviewInput({ name: '', rating: '', content: '', image: null });
    setEditingCourse(null);
    setViewingCourse(null);
  };

  // Open modal for viewing
  const openViewModal = (course) => {
    setViewingCourse(course);
    setModalMode('view');
    setShowModal(true);
  };

  // Open modal for editing
  const openEditModal = (course) => {
    setEditingCourse(course);
    setModalMode('edit');
    
    // Pre-fill form with course data
    setFormData({
      name: course.name,
      description: course.description,
      mode: course.mode,
      category: course.category,
      subcategory: course.subcategory,
      duration: course.duration,
      noOfLessons: course.noOfLessons,
      noOfStudents: course.noOfStudents,
      faq: course.faq || [],
      features: course.features || [],
      reviews: course.reviews || [],
      toolsImages: course.toolsImages || [],
      image: null,
      logoImage: null,
      pdf: null,
      featureImages: [],
      reviewImages: [],
      toolsImagesFiles: []
    });
    
    setShowModal(true);
  };

  // Open modal for creating
  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Course Management</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>Add New Course
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {loading && !showModal && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Mode</th>
                  <th>Duration</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id}>
                    <td>
                      <img 
                        src={course.image} 
                        alt={course.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{course.name}</td>
                    <td>{course.category}</td>
                    <td>
                      <span className={`badge ${course.mode === 'Online' ? 'bg-success' : course.mode === 'Offline' ? 'bg-primary' : 'bg-warning'}`}>
                        {course.mode}
                      </span>
                    </td>
                    <td>{course.duration}</td>
                    <td>{course.noOfLessons}</td>
                    <td>{course.noOfStudents}</td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-info"
                          onClick={() => openViewModal(course)}
                          title="View Course"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => openEditModal(course)}
                          title="Edit Course"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCourse(course._id)}
                          title="Delete Course"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-success"
                          onClick={() => handleUpdateStats(course._id, 'noOfLessons', parseInt(course.noOfLessons) + 1)}
                          title="Add Lesson"
                        >
                          <i className="fas fa-plus-circle"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleUpdateStats(course._id, 'noOfStudents', parseInt(course.noOfStudents) + 1)}
                          title="Add Student"
                        >
                          <i className="fas fa-user-plus"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit/View Course Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' ? 'Create New Course' : 
                   modalMode === 'edit' ? 'Edit Course' : 'View Course Details'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modalMode === 'view' ? (
                  // View Mode
                  <div>
                    {viewingCourse && (
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <img 
                            src={viewingCourse.image} 
                            alt={viewingCourse.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                          />
                          <h4 className="mt-3">{viewingCourse.name}</h4>
                          <p className="text-muted">{viewingCourse.category} • {viewingCourse.mode}</p>
                          
                          {viewingCourse.logoImage && (
                            <div className="mt-3">
                              <p className="mb-1"><strong>Logo:</strong></p>
                              <img 
                                src={viewingCourse.logoImage} 
                                alt="Course Logo"
                                className="img-fluid"
                                style={{ maxHeight: '100px' }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="col-md-8">
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <p><strong>Duration:</strong> {viewingCourse.duration}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Subcategory:</strong> {viewingCourse.subcategory}</p>
                            </div>
                          </div>
                          
                          <p><strong>Description:</strong></p>
                          <p>{viewingCourse.description}</p>
                          
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <p><strong>Lessons:</strong> {viewingCourse.noOfLessons}</p>
                            </div>
                            <div className="col-md-6">
                              <p><strong>Students:</strong> {viewingCourse.noOfStudents}</p>
                            </div>
                          </div>
                          
                          {viewingCourse.pdf && (
                            <div className="mb-3">
                              <p><strong>PDF:</strong> <a href={viewingCourse.pdf} target="_blank" rel="noopener noreferrer">View PDF</a></p>
                            </div>
                          )}
                          
                          {viewingCourse.faq && viewingCourse.faq.length > 0 && (
                            <div className="mb-3">
                              <h6>FAQs:</h6>
                              <div className="accordion" id="faqAccordion">
                                {viewingCourse.faq.map((faq, index) => (
                                  <div key={index} className="accordion-item">
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                        {faq.question}
                                      </button>
                                    </h2>
                                    <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                      <div className="accordion-body">
                                        {faq.answer}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {viewingCourse.features && viewingCourse.features.length > 0 && (
                            <div className="mb-3">
                              <h6>Features:</h6>
                              <ul className="list-group">
                                {viewingCourse.features.map((feature, index) => (
                                  <li key={index} className="list-group-item">
                                    {feature.title}
                                    {feature.image && (
                                      <img 
                                        src={feature.image} 
                                        alt={feature.title}
                                        className="img-fluid mt-2"
                                        style={{ maxHeight: '100px' }}
                                      />
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {viewingCourse.reviews && viewingCourse.reviews.length > 0 && (
                            <div className="mb-3">
                              <h6>Reviews:</h6>
                              <div className="row">
                                {viewingCourse.reviews.map((review, index) => (
                                  <div key={index} className="col-md-6 mb-3">
                                    <div className="card">
                                      <div className="card-body">
                                        <div className="d-flex align-items-center mb-2">
                                          {review.image && (
                                            <img 
                                              src={review.image} 
                                              alt={review.name}
                                              className="rounded-circle me-2"
                                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                          )}
                                          <div>
                                            <h6 className="mb-0">{review.name}</h6>
                                            <small className="text-warning">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</small>
                                          </div>
                                        </div>
                                        <p className="mb-0">{review.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {viewingCourse.toolsImages && viewingCourse.toolsImages.length > 0 && (
                            <div className="mb-3">
                              <h6>Tools Images:</h6>
                              <div className="row">
                                {viewingCourse.toolsImages.map((image, index) => (
                                  <div key={index} className="col-md-3 col-6 mb-2">
                                    <img 
                                      src={image} 
                                      alt={`Tool ${index + 1}`}
                                      className="img-thumbnail"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Create/Edit Mode
                  <form onSubmit={modalMode === 'create' ? handleCreateCourse : handleUpdateCourse}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Course Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Mode</label>
                        <select
                          className="form-select"
                          name="mode"
                          value={formData.mode}
                          onChange={handleInputChange}
                        >
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Category *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Subcategory</label>
                        <input
                          type="text"
                          className="form-control"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Duration *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Number of Lessons</label>
                        <input
                          type="number"
                          className="form-control"
                          name="noOfLessons"
                          value={formData.noOfLessons}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Number of Students</label>
                        <input
                          type="number"
                          className="form-control"
                          name="noOfStudents"
                          value={formData.noOfStudents}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Main Image *</label>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        required={modalMode === 'create'}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Logo Image</label>
                        <input
                          type="file"
                          className="form-control"
                          name="logoImage"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">PDF File</label>
                        <input
                          type="file"
                          className="form-control"
                          name="pdf"
                          onChange={handleFileChange}
                          accept=".pdf"
                        />
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-3">
                      <label className="form-label">Frequently Asked Questions</label>
                      <div className="card">
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Question"
                                name="question"
                                value={faqInput.question}
                                onChange={handleFaqInputChange}
                              />
                            </div>
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Answer"
                                name="answer"
                                value={faqInput.answer}
                                onChange={handleFaqInputChange}
                              />
                            </div>
                            <div className="col-md-2">
                              <button type="button" className="btn btn-primary w-100" onClick={addFaq}>
                                Add
                              </button>
                            </div>
                          </div>
                          
                          {formData.faq.length > 0 && (
                            <div className="mt-3">
                              <h6>Added FAQs:</h6>
                              <div className="list-group">
                                {formData.faq.map((faq, index) => (
                                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                      <strong>Q: {faq.question}</strong>
                                      <br />
                                      <span>A: {faq.answer}</span>
                                    </div>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeFaq(index)}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-3">
                      <label className="form-label">Features</label>
                      <div className="card">
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-5">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Feature title"
                                name="title"
                                value={featureInput.title}
                                onChange={handleFeatureInputChange}
                              />
                            </div>
                            <div className="col-md-5">
                              <input
                                type="file"
                                id="featureImageInput"
                                className="form-control"
                                onChange={handleFeatureImageChange}
                                accept="image/*"
                              />
                            </div>
                            <div className="col-md-2">
                              <button type="button" className="btn btn-primary w-100" onClick={addFeature}>
                                Add
                              </button>
                            </div>
                          </div>
                          
                          {formData.features.length > 0 && (
                            <div className="mt-3">
                              <h6>Added Features:</h6>
                              <ul className="list-group">
                                {formData.features.map((feature, index) => (
                                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                      {feature.title}
                                      {feature.image && typeof feature.image === 'string' && (
                                        <img 
                                          src={feature.image} 
                                          alt={feature.title}
                                          className="img-fluid mt-2 d-block"
                                          style={{ maxHeight: '100px' }}
                                        />
                                      )}
                                    </div>
                                    <button 
                                      type="button" 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeFeature(index)}
                                    >
                                      &times;
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Additional Feature Images</label>
                      <input
                        type="file"
                        className="form-control"
                        name="featureImages"
                        onChange={handleMultiFileChange}
                        accept="image/*"
                        multiple
                      />
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-3">
                      <label className="form-label">Reviews</label>
                      <div className="card">
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Reviewer Name"
                                name="name"
                                value={reviewInput.name}
                                onChange={handleReviewInputChange}
                              />
                            </div>
                            <div className="col-md-2">
                              <select
                                className="form-select"
                                name="rating"
                                value={reviewInput.rating}
                                onChange={handleReviewInputChange}
                              >
                                <option value="">Rating</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Review Content"
                                name="content"
                                value={reviewInput.content}
                                onChange={handleReviewInputChange}
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="file"
                                id="reviewImageInput"
                                className="form-control"
                                onChange={handleReviewImageChange}
                                accept="image/*"
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <button type="button" className="btn btn-primary" onClick={addReview}>
                                Add Review
                              </button>
                            </div>
                          </div>
                          
                          {formData.reviews.length > 0 && (
                            <div className="mt-3">
                              <h6>Added Reviews:</h6>
                              <div className="list-group">
                                {formData.reviews.map((review, index) => (
                                  <div key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <strong>{review.name}</strong>
                                        <span className="ms-2 text-warning">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                      </div>
                                      <button 
                                        type="button" 
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeReview(index)}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                    <p className="mb-0 mt-2">{review.content}</p>
                                    {review.image && typeof review.image === 'string' && (
                                      <img 
                                        src={review.image} 
                                        alt={review.name}
                                        className="img-fluid mt-2"
                                        style={{ maxHeight: '100px' }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Additional Review Images</label>
                      <input
                        type="file"
                        className="form-control"
                        name="reviewImages"
                        onChange={handleMultiFileChange}
                        accept="image/*"
                        multiple
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Tools Images</label>
                      <input
                        type="file"
                        className="form-control"
                        name="toolsImagesFiles"
                        onChange={handleMultiFileChange}
                        accept="image/*"
                        multiple
                      />
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (modalMode === 'create' ? 'Create Course' : 'Update Course')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;