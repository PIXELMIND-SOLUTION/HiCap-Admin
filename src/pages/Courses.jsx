import { useState, useEffect } from 'react';

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
    toolsImages: [null],
    featureImages: [null],
    reviewImages: [null]
  });
  const coursesPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://31.97.206.144:5001/api/coursecontroller');
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
      const response = await fetch(`http://31.97.206.144:5001/api/coursecontroller/${id}`);
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

      // Add multiple images
      formData.featureImages.forEach((image, index) => {
        if (image) formDataToSend.append('featureImages', image);
      });

      formData.toolsImages.forEach((image, index) => {
        if (image) formDataToSend.append('toolsImages', image);
      });

      formData.reviewImages.forEach((image, index) => {
        if (image) formDataToSend.append('reviewImages', image);
      });

      const url = editingCourse
        ? `http://31.97.206.144:5001/api/coursecontroller/${editingCourse._id}`
        : 'http://31.97.206.144:5001/api/coursecontroller';

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
      toolsImages: [null],
      featureImages: [null],
      reviewImages: [null]
    });
  };

  const handleEdit = async (course) => {
    try {
      setLoading(true);
      // Fetch complete course details for editing
      const response = await fetch(`http://31.97.206.144:5001/api/coursecontroller/${course._id}`);
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
        toolsImages: fullCourse.toolsImages && fullCourse.toolsImages.length > 0
          ? new Array(fullCourse.toolsImages.length).fill(null)
          : [null],
        featureImages: fullCourse.featureImages && fullCourse.featureImages.length > 0
          ? new Array(fullCourse.featureImages.length).fill(null)
          : [null],
        reviewImages: fullCourse.reviewImages && fullCourse.reviewImages.length > 0
          ? new Array(fullCourse.reviewImages.length).fill(null)
          : [null]
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
      const response = await fetch(`http://31.97.206.144:5001/api/coursecontroller/${id}`, {
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
    const file = e.target.files[0];
    if (!file) return;

    if (index !== null) {
      const newArray = [...formData[field]];
      newArray[index] = file;
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: file
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Course Management Admin Panel</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">
            <span className="text-red-700">×</span>
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">All Courses ({courses.length})</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
        >
          Add New Course
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Duration</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Lessons</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Students</th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCourses.map((course) => (
              <tr key={course._id} className="hover:bg-blue-50 transition duration-200">
                <td className="py-3 px-4 border-b font-medium text-gray-900">{course.name}</td>
                <td className="py-3 px-4 border-b text-gray-700">{course.category}</td>
                <td className="py-3 px-4 border-b text-gray-700">{course.duration}</td>
                <td className="py-3 px-4 border-b text-gray-700">{course.noOfLessons || 'N/A'}</td>
                <td className="py-3 px-4 border-b text-gray-700">{course.noOfStudents || 'N/A'}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(course)}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm hover:bg-green-200 transition duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(course)}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-200 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm hover:bg-red-200 transition duration-200"
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
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200'}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 transition duration-200'}`}
          >
            Next
          </button>
        </nav>
      </div>

      <div className="mt-4 text-center text-gray-600">
        Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, courses.length)} of {courses.length} courses
      </div>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-blue-800">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">Basic Information</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="name">
                          Course Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          placeholder="Enter course name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="description">
                          Description *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="4"
                          required
                          placeholder="Enter course description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="mode">
                            Mode
                          </label>
                          <select
                            id="mode"
                            name="mode"
                            value={formData.mode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="category">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Certified Programs">Certified Programs</option>
                            <option value="Elite Courses">Elite Courses</option>
                            <option value="Individual Courses">Individual Courses</option>
                            <option value="Healthcare Courses">Healthcare Courses</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="subcategory">
                            Subcategory
                          </label>
                          <input
                            type="text"
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter subcategory"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="duration">
                            Duration *
                          </label>
                          <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            placeholder="e.g., 3 months"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="noOfLessons">
                            Number of Lessons
                          </label>
                          <input
                            type="text"
                            id="noOfLessons"
                            name="noOfLessons"
                            value={formData.noOfLessons}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 20"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="noOfStudents">
                            Number of Students
                          </label>
                          <input
                            type="text"
                            id="noOfStudents"
                            name="noOfStudents"
                            value={formData.noOfStudents}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">File Uploads</h4>

                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-2">
                          Main Image
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'image')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept="image/*"
                        />
                        {editingCourse && editingCourse.image && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Current image:</span>
                            <img src={editingCourse.image} alt="Current" className="mt-1 w-20 h-20 object-cover rounded border" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-2">
                          Logo Image
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'logoImage')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept="image/*"
                        />
                        {editingCourse && editingCourse.logoImage && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Current logo:</span>
                            <img src={editingCourse.logoImage} alt="Current logo" className="mt-1 w-20 h-20 object-contain rounded border" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-800 text-sm font-semibold mb-2">
                          PDF File
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'pdf')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept=".pdf"
                        />
                        {editingCourse && editingCourse.pdf && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-600">Current PDF: </span>
                            <a href={editingCourse.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View PDF</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4 text-green-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">Content Sections</h3>

                    <div>
                      <h4 className="text-lg font-semibold text-green-700 mb-3">FAQs</h4>
                      {formData.faq.map((faq, index) => (
                        <div key={index} className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-green-800">FAQ {index + 1}</h5>
                            {formData.faq.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('faq', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-gray-700 text-sm font-semibold mb-1">Question</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => handleArrayChange('faq', index, 'question', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Enter question"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-semibold mb-1">Answer</label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => handleArrayChange('faq', index, 'answer', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm hover:bg-green-200 transition duration-200 font-medium"
                      >
                        + Add FAQ
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-purple-700 mb-3">Features</h4>
                      {formData.features.map((feature, index) => (
                        <div key={index} className="mb-4 p-4 border border-purple-200 rounded-lg bg-purple-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-purple-800">Feature {index + 1}</h5>
                            {formData.features.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('features', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter feature title"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('features', { title: '', image: null })}
                        className="mt-3 bg-purple-100 text-purple-700 px-4 py-2 rounded-md text-sm hover:bg-purple-200 transition duration-200 font-medium"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-yellow-700 mb-3">Feature Images</h4>
                      {formData.featureImages.map((image, index) => (
                        <div key={index} className="mb-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-yellow-800">Feature Image {index + 1}</h5>
                            {formData.featureImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('featureImages', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'featureImages', index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            accept="image/*"
                          />
                          {editingCourse && editingCourse.featureImages && editingCourse.featureImages[index] && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">Current image:</span>
                              <img src={editingCourse.featureImages[index]} alt="Current feature" className="mt-1 w-16 h-16 object-cover rounded border" />
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('featureImages', null)}
                        className="mt-3 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md text-sm hover:bg-yellow-200 transition duration-200 font-medium"
                      >
                        + Add Feature Image
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-red-700 mb-3">Reviews</h4>
                      {formData.reviews.map((review, index) => (
                        <div key={index} className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-red-800">Review {index + 1}</h5>
                            {formData.reviews.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('reviews', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-1">Name</label>
                                <input
                                  type="text"
                                  value={review.name}
                                  onChange={(e) => handleArrayChange('reviews', index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                  placeholder="Reviewer name"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-1">Rating</label>
                                <input
                                  type="text"
                                  value={review.rating}
                                  onChange={(e) => handleArrayChange('reviews', index, 'rating', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                  placeholder="e.g., 5"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm font-semibold mb-1">Content</label>
                              <textarea
                                value={review.content}
                                onChange={(e) => handleArrayChange('reviews', index, 'content', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm hover:bg-red-200 transition duration-200 font-medium"
                      >
                        + Add Review
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-indigo-700 mb-3">Review Images</h4>
                      {formData.reviewImages.map((image, index) => (
                        <div key={index} className="mb-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-indigo-800">Review Image {index + 1}</h5>
                            {formData.reviewImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('reviewImages', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'reviewImages', index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            accept="image/*"
                          />
                          {editingCourse && editingCourse.reviewImages && editingCourse.reviewImages[index] && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">Current image:</span>
                              <img src={editingCourse.reviewImages[index]} alt="Current review" className="mt-1 w-16 h-16 object-cover rounded border" />
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('reviewImages', null)}
                        className="mt-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md text-sm hover:bg-indigo-200 transition duration-200 font-medium"
                      >
                        + Add Review Image
                      </button>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-pink-700 mb-3">Tools Images</h4>
                      {formData.toolsImages.map((image, index) => (
                        <div key={index} className="mb-4 p-4 border border-pink-200 rounded-lg bg-pink-50">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-pink-800">Tool Image {index + 1}</h5>
                            {formData.toolsImages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayItem('toolsImages', index)}
                                className="text-red-500 hover:text-red-700 transition duration-200"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'toolsImages', index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            accept="image/*"
                          />
                          {editingCourse && editingCourse.toolsImages && editingCourse.toolsImages[index] && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">Current image:</span>
                              <img src={editingCourse.toolsImages[index]} alt="Current tool" className="mt-1 w-16 h-16 object-cover rounded border" />
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem('toolsImages', null)}
                        className="mt-3 bg-pink-100 text-pink-700 px-4 py-2 rounded-md text-sm hover:bg-pink-200 transition duration-200 font-medium"
                      >
                        + Add Tool Image
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </div>
                    ) : (
                      `${editingCourse ? 'Update' : 'Create'} Course`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for View Course Details */}
      {showViewModal && viewingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-blue-800">Course Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border-l-4 border-blue-400">
                    <h3 className="text-xl font-bold mb-4 text-blue-800">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Name:</span>
                        <span className="text-gray-900 font-medium">{viewingCourse.name}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Description:</span>
                        <span className="text-gray-900">{viewingCourse.description}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Mode:</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{viewingCourse.mode}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Category:</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{viewingCourse.category}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Subcategory:</span>
                        <span className="text-gray-900">{viewingCourse.subcategory}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Duration:</span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">{viewingCourse.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Lessons:</span>
                        <span className="text-gray-900">{viewingCourse.noOfLessons || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 w-32 flex-shrink-0">Students:</span>
                        <span className="text-gray-900">{viewingCourse.noOfStudents || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-400">
                    <h3 className="text-xl font-bold mb-4 text-green-800">Images</h3>
                    <div className="space-y-4">
                      {viewingCourse.image && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Main Image:</p>
                          <img src={viewingCourse.image} alt="Course" className="w-full h-48 object-cover rounded-lg border shadow-md" />
                        </div>
                      )}
                      {viewingCourse.logoImage && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">Logo Image:</p>
                          <img src={viewingCourse.logoImage} alt="Course Logo" className="w-32 h-32 object-contain border rounded-lg shadow-md bg-white p-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  {viewingCourse.pdf && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-l-4 border-gray-400">
                      <h3 className="text-xl font-bold mb-4 text-gray-800">Course Materials</h3>
                      <button
                        onClick={() => handleDownload(viewingCourse.pdf, viewingCourse.name)}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        Download Course PDF
                      </button>

                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border-l-4 border-purple-400">
                    <h3 className="text-xl font-bold mb-4 text-purple-800">FAQs</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {viewingCourse.faq && viewingCourse.faq.length > 0 ? (
                        viewingCourse.faq.map((faq, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border">
                            <p className="font-semibold text-gray-800 mb-2">{faq.question}</p>
                            <p className="text-gray-600 text-sm">{faq.answer}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No FAQs available</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border-l-4 border-yellow-400">
                    <h3 className="text-xl font-bold mb-4 text-yellow-800">Features</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {viewingCourse.features && viewingCourse.features.length > 0 ? (
                        viewingCourse.features.map((feature, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border flex items-center">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{feature.title}</p>
                            </div>
                            {feature.image && (
                              <img src={feature.image} alt={feature.title} className="w-12 h-12 object-contain border rounded ml-3" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No features available</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border-l-4 border-red-400">
                    <h3 className="text-xl font-bold mb-4 text-red-800">Reviews</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {viewingCourse.reviews && viewingCourse.reviews.length > 0 ? (
                        viewingCourse.reviews.map((review, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center mb-2">
                              {review.image && (
                                <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full mr-3 object-cover border" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{review.name}</p>
                                <div className="flex items-center">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-4 h-4 ${i < parseInt(review.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">{review.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No reviews available</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-6 border-l-4 border-indigo-400">
                    <h3 className="text-xl font-bold mb-4 text-indigo-800">Tools & Technologies</h3>
                    <div className="grid grid-cols-6 gap-3">
                      {viewingCourse.toolsImages && viewingCourse.toolsImages.length > 0 ? (
                        viewingCourse.toolsImages.map((tool, index) => (
                          <div key={index} className="bg-white p-2 rounded-lg border shadow-sm">
                            <img src={tool} alt={`Tool ${index + 1}`} className="w-full h-12 object-contain" />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic col-span-6">No tools images available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
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