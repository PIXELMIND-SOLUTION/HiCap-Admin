import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/Navbar';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mode: 'Online',
    category: 'Certified Programs',
    subcategory: 'course',
    duration: '',
    noOfLessons: '',
    noOfStudents: '',
    image: null,
    logoImage: null,
    pdf: null,
    faq: [{ question: '', answer: '' }],
    features: [{ title: '', image: null }],
    reviews: [{ name: '', rating: '', content: '', image: null }],
    toolsImages: [],
    featureImages: [],
    reviewImages: []
  });
  const coursesPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-hicap.onrender.com/api/coursecontroller');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://backend-hicap.onrender.com/api/coursecontroller/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      const data = await response.json();
      setViewingCourse(data.data);
      setShowViewModal(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mode', formData.mode);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('noOfLessons', formData.noOfLessons);
      formDataToSend.append('noOfStudents', formData.noOfStudents);

      // Add files
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.logoImage) formDataToSend.append('logoImage', formData.logoImage);
      if (formData.pdf) formDataToSend.append('pdf', formData.pdf);

      // Add arrays as JSON strings
      formDataToSend.append('faq', JSON.stringify(formData.faq));
      formDataToSend.append('features', JSON.stringify(formData.features.map(f => ({ title: f.title }))));
      formDataToSend.append('reviews', JSON.stringify(formData.reviews.map(r => ({
        name: r.name,
        rating: r.rating,
        content: r.content
      }))));

      // Add multiple images - toolsImages
      formData.toolsImages.forEach((image) => {
        if (image) formDataToSend.append('toolsImages', image);
      });

      // Add multiple images - featureImages
      formData.featureImages.forEach((image) => {
        if (image) formDataToSend.append('featureImages', image);
      });

      // Add multiple images - reviewImages
      formData.reviewImages.forEach((image) => {
        if (image) formDataToSend.append('reviewImages', image);
      });

      const url = editingCourse
        ? `https://backend-hicap.onrender.com/api/coursecontroller/${editingCourse._id}`
        : 'https://backend-hicap.onrender.com/api/coursecontroller';

      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCourse ? 'update' : 'create'} course`);
      }

      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      setError(err.message);
      console.log(err)
    }
    setUploading(false);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      description: '',
      mode: 'Online',
      category: 'Certified Programs',
      subcategory: 'course',
      duration: '',
      noOfLessons: '',
      noOfStudents: '',
      image: null,
      logoImage: null,
      pdf: null,
      faq: [{ question: '', answer: '' }],
      features: [{ title: '', image: null }],
      reviews: [{ name: '', rating: '', content: '', image: null }],
      toolsImages: [],
      featureImages: [],
      reviewImages: []
    });
  };

  const handleEdit = async (course) => {
    try {
      setLoading(true);
      // Fetch complete course details for editing
      const response = await fetch(`https://backend-hicap.onrender.com/api/coursecontroller/${course._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      const data = await response.json();
      const fullCourse = data.data;

      setEditingCourse(fullCourse);
      setFormData({
        name: fullCourse.name || '',
        description: fullCourse.description || '',
        mode: fullCourse.mode || 'Online',
        category: fullCourse.category || 'Certified Programs',
        subcategory: fullCourse.subcategory || 'course',
        duration: fullCourse.duration || '',
        noOfLessons: fullCourse.noOfLessons || '',
        noOfStudents: fullCourse.noOfStudents || '',
        image: null,
        logoImage: null,
        pdf: null,
        faq: fullCourse.faq && fullCourse.faq.length > 0 ? fullCourse.faq : [{ question: '', answer: '' }],
        features: fullCourse.features && fullCourse.features.length > 0
          ? fullCourse.features.map(f => ({ title: f.title || '', image: null }))
          : [{ title: '', image: null }],
        reviews: fullCourse.reviews && fullCourse.reviews.length > 0
          ? fullCourse.reviews.map(r => ({
            name: r.name || '',
            rating: r.rating || '',
            content: r.content || '',
            image: null
          }))
          : [{ name: '', rating: '', content: '', image: null }],
        toolsImages: [],
        featureImages: [],
        reviewImages: []
      });
      setShowModal(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleView = (course) => {
    fetchCourseDetails(course._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`https://backend-hicap.onrender.com/api/coursecontroller/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, field, index = null) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (index !== null) {
      // Single file upload for specific index
      const newArray = [...formData[field]];
      newArray[index] = files[0];
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    } else if (field === 'toolsImages' || field === 'featureImages' || field === 'reviewImages') {
      // Multiple files upload for toolsImages, featureImages, and reviewImages
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...newFiles]
      }));
    } else {
      // Single file upload
      setFormData(prev => ({
        ...prev,
        [field]: files[0]
      }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const removeFile = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = async (pdfUrl, fileName) => {
    try {
      // Fetch the PDF as a blob
      const response = await fetch(pdfUrl, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const arrayBuffer = await response.arrayBuffer(); // read as ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: "application/pdf" }); // force PDF type
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <h1 className="text-center text-primary mb-4">Course Management Admin Panel</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <span>{error}</span>
          <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-semibold">All Courses ({courses.length})</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          Add New Course
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Duration</th>
              <th scope="col">Lessons</th>
              <th scope="col">Students</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course._id}>
                <td className="fw-semibold">{course.name}</td>
                <td>{course.category}</td>
                <td>{course.duration}</td>
                <td>{course.noOfLessons || 'N/A'}</td>
                <td>{course.noOfStudents || 'N/A'}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      onClick={() => handleView(course)}
                      className="btn btn-outline-success"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="btn btn-outline-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="text-center text-muted mt-3">
        Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, courses.length)} of {courses.length} courses
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h5 className="text-primary border-start border-4 border-primary ps-2 py-2 bg-light">Basic Information</h5>

                        <div className="mb-3">
                          <label htmlFor="name" className="form-label fw-semibold">
                            Course Name *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter course name"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="description" className="form-label fw-semibold">
                            Description *
                          </label>
                          <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            placeholder="Enter course description"
                          />
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="mode" className="form-label fw-semibold">
                              Mode
                            </label>
                            <select
                              className="form-select"
                              id="mode"
                              name="mode"
                              value={formData.mode}
                              onChange={handleChange}
                            >
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="category" className="form-label fw-semibold">
                              Category
                            </label>
                            <select
                              className="form-select"
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                            >
                              <option value="Certified Programs">Certified Programs</option>
                              <option value="Elite Courses">Elite Courses</option>
                              <option value="Individual Courses">Individual Courses</option>
                              <option value="Healthcare Courses">Healthcare Courses</option>
                            </select>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="subcategory" className="form-label fw-semibold">
                              Subcategory
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="subcategory"
                              name="subcategory"
                              value={formData.subcategory}
                              onChange={handleChange}
                              placeholder="Enter subcategory"
                            />
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="duration" className="form-label fw-semibold">
                              Duration *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="duration"
                              name="duration"
                              value={formData.duration}
                              onChange={handleChange}
                              required
                              placeholder="e.g., 3 months"
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label htmlFor="noOfLessons" className="form-label fw-semibold">
                              Number of Lessons
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="noOfLessons"
                              name="noOfLessons"
                              value={formData.noOfLessons}
                              onChange={handleChange}
                              placeholder="e.g., 20"
                            />
                          </div>

                          <div className="col-md-6">
                            <label htmlFor="noOfStudents" className="form-label fw-semibold">
                              Number of Students
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="noOfStudents"
                              name="noOfStudents"
                              value={formData.noOfStudents}
                              onChange={handleChange}
                              placeholder="e.g., 500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h5 className="text-primary border-start border-4 border-primary ps-2 py-2 bg-light">File Uploads</h5>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Main Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, 'image')}
                          accept="image/*"
                        />
                        {editingCourse && editingCourse.image && (
                          <div className="mt-2">
                            <span className="text-muted small">Current image:</span>
                            <img src={editingCourse.image} alt="Current" className="mt-1 img-thumbnail" style={{ width: '80px', height: '80px' }} />
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Logo Image
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, 'logoImage')}
                          accept="image/*"
                        />
                        {editingCourse && editingCourse.logoImage && (
                          <div className="mt-2">
                            <span className="text-muted small">Current logo:</span>
                            <img src={editingCourse.logoImage} alt="Current logo" className="mt-1 img-thumbnail" style={{ width: '80px', height: '80px' }} />
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          PDF File
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(e, 'pdf')}
                          accept=".pdf"
                        />
                        {editingCourse && editingCourse.pdf && (
                          <div className="mt-2">
                            <span className="text-muted small">Current PDF: </span>
                            <a href={editingCourse.pdf} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">View PDF</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="text-success border-start border-4 border-success ps-2 py-2 bg-light">Content Sections</h5>

                    <div className="mb-4">
                      <h6 className="text-success mb-3">FAQs</h6>
                      {formData.faq.map((faq, index) => (
                        <div key={index} className="card mb-3 border-success">
                          <div className="card-header bg-success bg-opacity-10 d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-success">FAQ {index + 1}</span>
                            {formData.faq.length > 1 && (
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => removeArrayItem('faq', index)}
                              ></button>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Question</label>
                              <input
                                type="text"
                                className="form-control"
                                value={faq.question}
                                onChange={(e) => handleArrayChange('faq', index, 'question', e.target.value)}
                                placeholder="Enter question"
                              />
                            </div>
                            <div>
                              <label className="form-label fw-semibold">Answer</label>
                              <textarea
                                className="form-control"
                                value={faq.answer}
                                onChange={(e) => handleArrayChange('faq', index, 'answer', e.target.value)}
                                rows="3"
                                placeholder="Enter answer"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('faq', { question: '', answer: '' })}
                        className="btn btn-outline-success btn-sm"
                      >
                        + Add FAQ
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-primary mb-3">Features</h6>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="card mb-3 border-primary">
                          <div className="card-header bg-primary bg-opacity-10 d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-primary">Feature {index + 1}</span>
                            {formData.features.length > 1 && (
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => removeArrayItem('features', index)}
                              ></button>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Title</label>
                              <input
                                type="text"
                                className="form-control"
                                value={feature.title}
                                onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                                placeholder="Enter feature title"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('features', { title: '', image: null })}
                        className="btn btn-outline-primary btn-sm"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-warning mb-3">Feature Images</h6>
                      {formData.featureImages.map((image, index) => (
                        <div key={index} className="card mb-3 border-warning">
                          <div className="card-header bg-warning bg-opacity-10 d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-warning">Feature Image {index + 1}</span>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => removeFile('featureImages', index)}
                            ></button>
                          </div>
                          <div className="card-body">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => handleFileChange(e, 'featureImages', index)}
                              accept="image/*"
                            />
                            {image && (
                              <div className="mt-2">
                                <span className="text-muted small">Selected: {image.name}</span>
                              </div>
                            )}
                            {editingCourse && editingCourse.featureImages && editingCourse.featureImages[index] && (
                              <div className="mt-2">
                                <span className="text-muted small">Current image:</span>
                                <img src={editingCourse.featureImages[index]} alt="Current feature" className="mt-1 img-thumbnail" style={{ width: '64px', height: '64px' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('featureImages', null)}
                        className="btn btn-outline-warning btn-sm me-2"
                      >
                        + Add Feature Image
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-danger mb-3">Reviews</h6>
                      {formData.reviews.map((review, index) => (
                        <div key={index} className="card mb-3 border-danger">
                          <div className="card-header bg-danger bg-opacity-10 d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-danger">Review {index + 1}</span>
                            {formData.reviews.length > 1 && (
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => removeArrayItem('reviews', index)}
                              ></button>
                            )}
                          </div>
                          <div className="card-body">
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={review.name}
                                  onChange={(e) => handleArrayChange('reviews', index, 'name', e.target.value)}
                                  placeholder="Reviewer name"
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-semibold">Rating</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={review.rating}
                                  onChange={(e) => handleArrayChange('reviews', index, 'rating', e.target.value)}
                                  placeholder="e.g., 5"
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Content</label>
                              <textarea
                                className="form-control"
                                value={review.content}
                                onChange={(e) => handleArrayChange('reviews', index, 'content', e.target.value)}
                                rows="3"
                                placeholder="Review content"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('reviews', { name: '', rating: '', content: '', image: null })}
                        className="btn btn-outline-danger btn-sm"
                      >
                        + Add Review
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-info mb-3">Review Images</h6>
                      {formData.reviewImages.map((image, index) => (
                        <div key={index} className="card mb-3 border-info">
                          <div className="card-header bg-info bg-opacity-10 d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-info">Review Image {index + 1}</span>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => removeFile('reviewImages', index)}
                            ></button>
                          </div>
                          <div className="card-body">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => handleFileChange(e, 'reviewImages', index)}
                              accept="image/*"
                            />
                            {image && (
                              <div className="mt-2">
                                <span className="text-muted small">Selected: {image.name}</span>
                              </div>
                            )}
                            {editingCourse && editingCourse.reviewImages && editingCourse.reviewImages[index] && (
                              <div className="mt-2">
                                <span className="text-muted small">Current image:</span>
                                <img src={editingCourse.reviewImages[index]} alt="Current review" className="mt-1 img-thumbnail" style={{ width: '64px', height: '64px' }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('reviewImages', null)}
                        className="btn btn-outline-info btn-sm me-2"
                      >
                        + Add Review Image
                      </button>
                    </div>

                    <div className="mb-4">
                      <h6 className="text-purple mb-3">Tools Images</h6>
                      <div className="card border-purple mb-3">
                        <div className="card-header bg-purple bg-opacity-10">
                          <span className="fw-medium text-purple">Upload Tools Images</span>
                        </div>
                        <div className="card-body">
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, 'toolsImages')}
                            accept="image/*"
                            multiple
                          />
                          <div className="form-text">You can select multiple images at once</div>
                        </div>
                      </div>

                      {formData.toolsImages.length > 0 && (
                        <div className="card border-purple">
                          <div className="card-header bg-purple bg-opacity-10">
                            <span className="fw-medium text-purple">Selected Tools Images</span>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              {formData.toolsImages.map((image, index) => (
                                <div key={index} className="col-md-3 mb-3 position-relative">
                                  <div className="card">
                                    <div className="card-body p-2 text-center">
                                      <span className="d-block text-truncate small mb-1">{image.name}</span>
                                      <button
                                        type="button"
                                        className="btn-close position-absolute top-0 end-0 m-1"
                                        onClick={() => removeFile('toolsImages', index)}
                                      ></button>
                                      {image.type.startsWith('image/') && (
                                        <img
                                          src={URL.createObjectURL(image)}
                                          alt={`Preview ${index + 1}`}
                                          className="img-fluid rounded"
                                          style={{ maxHeight: '80px' }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {editingCourse && editingCourse.toolsImages && editingCourse.toolsImages.length > 0 && (
                        <div className="card border-secondary mt-3">
                          <div className="card-header bg-secondary bg-opacity-10">
                            <span className="fw-medium">Current Tools Images</span>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              {editingCourse.toolsImages.map((tool, index) => (
                                <div key={index} className="col-md-2 mb-3">
                                  <div className="card">
                                    <img
                                      src={tool}
                                      alt={`Tool ${index + 1}`}
                                      className="card-img-top p-2"
                                      style={{ height: '80px', objectFit: 'contain' }}
                                    />
                                    <div className="card-footer p-1 text-center">
                                      <small className="text-muted">Tool {index + 1}</small>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    `${editingCourse ? 'Update' : 'Create'} Course`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for View Course Details */}
      {showViewModal && viewingCourse && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">Course Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-primary bg-opacity-10 border-primary mb-4">
                      <div className="card-header bg-primary text-white">
                        <h6 className="mb-0">Basic Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Name:</span>
                          <span className="ms-2 fw-medium">{viewingCourse.name}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Description:</span>
                          <p className="ms-2">{viewingCourse.description}</p>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Mode:</span>
                          <span className="badge bg-primary ms-2">{viewingCourse.mode}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Category:</span>
                          <span className="badge bg-success ms-2">{viewingCourse.category}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Subcategory:</span>
                          <span className="ms-2">{viewingCourse.subcategory}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Duration:</span>
                          <span className="badge bg-warning text-dark ms-2">{viewingCourse.duration}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Lessons:</span>
                          <span className="ms-2">{viewingCourse.noOfLessons || 'N/A'}</span>
                        </div>
                        <div className="mb-3">
                          <span className="fw-semibold text-muted">Students:</span>
                          <span className="ms-2">{viewingCourse.noOfStudents || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-success bg-opacity-10 border-success mb-4">
                      <div className="card-header bg-success text-white">
                        <h6 className="mb-0">Images</h6>
                      </div>
                      <div className="card-body">
                        {viewingCourse.image && (
                          <div className="mb-3">
                            <p className="fw-semibold text-muted mb-2">Main Image:</p>
                            <img src={viewingCourse.image} alt="Course" className="img-fluid rounded border shadow-sm" />
                          </div>
                        )}
                        {viewingCourse.logoImage && (
                          <div>
                            <p className="fw-semibold text-muted mb-2">Logo Image:</p>
                            <img src={viewingCourse.logoImage} alt="Course Logo" className="img-thumbnail" style={{ width: '128px', height: '128px' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {viewingCourse.pdf && (
                      <div className="card bg-secondary bg-opacity-10 border-secondary mb-4">
                        <div className="card-header bg-secondary text-white">
                          <h6 className="mb-0">Course Materials</h6>
                        </div>
                        <div className="card-body">
                          <button
                            onClick={() => handleDownload(viewingCourse.pdf, viewingCourse.name)}
                            className="btn btn-primary"
                          >
                            <i className="bi bi-download me-2"></i>
                            Download Course PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <div className="card bg-info bg-opacity-10 border-info mb-4">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">FAQs</h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {viewingCourse.faq && viewingCourse.faq.length > 0 ? (
                          viewingCourse.faq.map((faq, index) => (
                            <div key={index} className="card mb-3">
                              <div className="card-body">
                                <h6 className="card-title fw-semibold">{faq.question}</h6>
                                <p className="card-text text-muted">{faq.answer}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted fst-italic">No FAQs available</p>
                        )}
                      </div>
                    </div>

                    <div className="card bg-warning bg-opacity-10 border-warning mb-4">
                      <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">Features</h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {viewingCourse.features && viewingCourse.features.length > 0 ? (
                          viewingCourse.features.map((feature, index) => (
                            <div key={index} className="card mb-3">
                              <div className="card-body d-flex align-items-center">
                                <div className="flex-grow-1">
                                  <p className="card-text fw-medium">{feature.title}</p>
                                </div>
                                {feature.image && (
                                  <img src={feature.image} alt={feature.title} className="img-thumbnail ms-3" style={{ width: '48px', height: '48px' }} />
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted fst-italic">No features available</p>
                        )}
                      </div>
                    </div>

                    <div className="card bg-danger bg-opacity-10 border-danger mb-4">
                      <div className="card-header bg-danger text-white">
                        <h6 className="mb-0">Reviews</h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {viewingCourse.reviews && viewingCourse.reviews.length > 0 ? (
                          viewingCourse.reviews.map((review, index) => (
                            <div key={index} className="card mb-3">
                              <div className="card-body">
                                <div className="d-flex align-items-center mb-2">
                                  {review.image && (
                                    <img src={review.image} alt={review.name} className="rounded-circle me-3" style={{ width: '40px', height: '40px' }} />
                                  )}
                                  <div className="flex-grow-1">
                                    <h6 className="card-title mb-0">{review.name}</h6>
                                    <div className="d-flex align-items-center">
                                      <div className="text-warning">
                                        {[...Array(5)].map((_, i) => (
                                          <i
                                            key={i}
                                            className={`bi bi-star${i < parseInt(review.rating) ? '-fill' : ''}`}
                                          ></i>
                                        ))}
                                      </div>
                                      <span className="text-muted small ms-2">({review.rating}/5)</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="card-text text-muted">{review.content}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted fst-italic">No reviews available</p>
                        )}
                      </div>
                    </div>

                    <div className="card bg-purple bg-opacity-10 border-purple">
                      <div className="card-header bg-purple text-white">
                        <h6 className="mb-0">Tools & Technologies</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          {viewingCourse.toolsImages && viewingCourse.toolsImages.length > 0 ? (
                            viewingCourse.toolsImages.map((tool, index) => (
                              <div key={index} className="col-2 mb-3">
                                <div className="card">
                                  <img src={tool} alt={`Tool ${index + 1}`} className="card-img-top p-2" style={{ height: '60px', objectFit: 'contain' }} />
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted fst-italic">No tools images available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;