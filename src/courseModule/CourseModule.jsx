import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

const API_URL = "https://backend-hicap.onrender.com/api/course-modules";
const ENROLLMENTS_API = "https://backend-hicap.onrender.com/api/enrollments";
const COURSES_API = "https://backend-hicap.onrender.com/api/coursecontroller";
const MENTORS_API = "https://backend-hicap.onrender.com/api/our-mentor/mentors";

const CourseModule = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [editModule, setEditModule] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [newModule, setNewModule] = useState({
    enrolledId: "",
    courseName: "",
    mentorId: "",
    mentorName: "",
    modules: [{ subjectName: "", topics: [{ topicName: "", lessons: [{ name: "", date: "", videoId: "", resources: [] }] }] }],
  });
  const [files, setFiles] = useState([]);

  // Fetch all modules
  const fetchModules = async () => {
    try {
      const res = await axios.get(API_URL);
      setModules(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch modules", "error");
    }
  };

  // Fetch enrollments
  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(ENROLLMENTS_API);
      setEnrollments(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch enrollments", "error");
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(COURSES_API);
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch courses", "error");
    }
  };

  // Fetch mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get(MENTORS_API);
      setMentors(res.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch mentors", "error");
    }
  };

  useEffect(() => {
    fetchModules();
    fetchEnrollments();
    fetchCourses();
    fetchMentors();
  }, []);

  // View module
  const viewModule = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setSelectedModule(res.data.data);
      const modal = new window.bootstrap.Modal(document.getElementById("viewModal"));
      modal.show();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch module details", "error");
    }
  };

  // Delete module
  const deleteModule = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This module will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire("Deleted!", "Course module deleted.", "success");
        fetchModules();
      } catch (err) {
        Swal.fire("Error", "Failed to delete module", "error");
      }
    }
  };

  // Edit module
  const handleEditClick = (module) => {
    setEditModule(module);
    const modal = new window.bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  // Handle input change
  const handleInputChange = (e, topicIndex, lessonIndex, field, moduleType = "edit") => {
    const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
    
    if (topicIndex !== undefined && lessonIndex !== undefined) {
      // Update lesson field
      targetModule.modules[0].topics[topicIndex].lessons[lessonIndex][field] = e.target.value;
    } else if (topicIndex !== undefined) {
      // Update topic field
      targetModule.modules[0].topics[topicIndex][field] = e.target.value;
    } else {
      // Update module field
      targetModule[e.target.name] = e.target.value;
    }
    
    moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Update module
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(editModule));

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      await axios.put(`${API_URL}/${editModule._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Module updated successfully!", "success");
      setEditModule(null);
      setFiles([]);
      fetchModules();

      const modalEl = document.getElementById("editModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update module", "error");
    }
  };

  // Create new module
  const handleCreate = async () => {
    if (!newModule.enrolledId) {
      Swal.fire("Error", "Enrollment ID is required", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(newModule));

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success", "Module created successfully!", "success");
      setNewModule({
        enrolledId: "",
        courseName: "",
        mentorId: "",
        mentorName: "",
        modules: [{ subjectName: "", topics: [{ topicName: "", lessons: [{ name: "", date: "", videoId: "", resources: [] }] }] }],
      });
      setFiles([]);
      fetchModules();

      const modalEl = document.getElementById("createModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create module", "error");
    }
  };

  // Add new topic
  const addTopic = (moduleType = "new") => {
    const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
    targetModule.modules[0].topics.push({
      topicName: "",
      lessons: [{ name: "", date: "", videoId: "", resources: [] }]
    });
    moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
  };

  // Remove topic
  const removeTopic = (index, moduleType = "new") => {
    const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
    targetModule.modules[0].topics.splice(index, 1);
    moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
  };

  // Add new lesson
  const addLesson = (topicIndex, moduleType = "new") => {
    const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
    targetModule.modules[0].topics[topicIndex].lessons.push({
      name: "", date: "", videoId: "", resources: []
    });
    moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
  };

  // Remove lesson
  const removeLesson = (topicIndex, lessonIndex, moduleType = "new") => {
    const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
    targetModule.modules[0].topics[topicIndex].lessons.splice(lessonIndex, 1);
    moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
  };

  // Handle enrollment selection
  const handleEnrollmentChange = (enrollmentId, moduleType = "new") => {
    const enrollment = enrollments.find(e => e._id === enrollmentId);
    if (enrollment) {
      const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
      targetModule.enrolledId = enrollmentId;
      targetModule.courseName = enrollment.courseId?.name || "";
      
      // Set default mentor if available
      if (enrollment.assignedMentors && enrollment.assignedMentors.length > 0) {
        const mentor = mentors.find(m => m._id === enrollment.assignedMentors[0]);
        if (mentor) {
          targetModule.mentorId = mentor._id;
          targetModule.mentorName = `${mentor.firstName} ${mentor.lastName}`;
        }
      }
      
      moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
    }
  };

  // Handle mentor selection
  const handleMentorChange = (mentorId, moduleType = "new") => {
    const mentor = mentors.find(m => m._id === mentorId);
    if (mentor) {
      const targetModule = moduleType === "edit" ? { ...editModule } : { ...newModule };
      targetModule.mentorId = mentorId;
      targetModule.mentorName = `${mentor.firstName} ${mentor.lastName}`;
      
      moduleType === "edit" ? setEditModule(targetModule) : setNewModule(targetModule);
    }
  };

  // Get mentor name by ID
  const getMentorName = (mentorId) => {
    const mentor = mentors.find(m => m._id === mentorId);
    return mentor ? `${mentor.firstName} ${mentor.lastName}` : "No Mentor Assigned";
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Course Modules Management</h3>
      <Button variant="success" className="mb-3" onClick={() => new window.bootstrap.Modal(document.getElementById("createModal")).show()}>
        <FaPlus /> Add New Module
      </Button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Enrollment ID</th>
              <th>Batch Name</th>
              <th>Course Name</th>
              <th>Mentor Name</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.length > 0 ? (
              modules.map((mod, i) => (
                <tr key={mod._id}>
                  <td>{i + 1}</td>
                  <td>{mod.enrolledId?._id || mod.enrolledId || "N/A"}</td>
                  <td>{mod.enrolledId?.batchName || "N/A"}</td>
                  <td>{mod.courseName}</td>
                  <td>{mod.mentorName || getMentorName(mod.mentorId) || "N/A"}</td>
                  <td>{new Date(mod.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => viewModule(mod._id)}>
                      <FaEye />
                    </button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(mod)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteModule(mod._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No modules found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Module Details</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedModule ? (
                <>
                  <p><strong>Enrollment ID:</strong> {selectedModule.enrolledId?._id || selectedModule.enrolledId}</p>
                  <p><strong>Batch Name:</strong> {selectedModule.enrolledId?.batchName}</p>
                  <p><strong>Course Name:</strong> {selectedModule.courseName}</p>
                  <p><strong>Mentor Name:</strong> {selectedModule.mentorName || getMentorName(selectedModule.mentorId) || "N/A"}</p>
                  <p><strong>Modules:</strong></p>
                  <ul>
                    {selectedModule.modules.map((mod, mi) => (
                      <li key={mi}>
                        <strong>{mod.subjectName}</strong>
                        <ul>
                          {mod.topics.map((topic, ti) => (
                            <li key={ti}>
                              {topic.topicName}
                              <ul>
                                {topic.lessons.map((lesson, li) => (
                                  <li key={li}>
                                    {lesson.name} - Video: {lesson.videoId} - Duration: {lesson.duration || "N/A"}
                                    {lesson.resources.length > 0 && (
                                      <ul>
                                        {lesson.resources.map((res, ri) => (
                                          <li key={ri}>
                                            <a href={res.file} target="_blank" rel="noreferrer">{res.name}</a>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Edit Module</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {editModule && (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>Enrollment ID</Form.Label>
                    <Form.Select
                      name="enrolledId"
                      value={editModule.enrolledId?._id || editModule.enrolledId}
                      onChange={(e) => handleEnrollmentChange(e.target.value, "edit")}
                    >
                      <option value="">Select Enrollment</option>
                      {enrollments.map((enrollment) => (
                        <option key={enrollment._id} value={enrollment._id}>
                          {enrollment.batchNumber} - {enrollment.batchName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="courseName"
                      value={editModule.courseName}
                      onChange={(e) => handleInputChange(e, undefined, undefined, "courseName", "edit")}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Mentor</Form.Label>
                    <Form.Select
                      name="mentorId"
                      value={editModule.mentorId}
                      onChange={(e) => handleMentorChange(e.target.value, "edit")}
                    >
                      <option value="">Select Mentor</option>
                      {mentors.map((mentor) => (
                        <option key={mentor._id} value={mentor._id}>
                          {mentor.firstName} {mentor.lastName} - {mentor.expertise}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Subject Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editModule.modules[0].subjectName}
                      onChange={(e) => handleInputChange(e, undefined, undefined, "subjectName", "edit")}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Topics</h6>
                    <Button variant="outline-primary" size="sm" onClick={() => addTopic("edit")}>
                      Add Topic
                    </Button>
                  </div>

                  {editModule.modules[0].topics.map((topic, ti) => (
                    <div key={ti} className="mb-3 border p-2 rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Topic {ti + 1}</h6>
                        <Button variant="outline-danger" size="sm" onClick={() => removeTopic(ti, "edit")}>
                          Remove
                        </Button>
                      </div>
                      <Form.Group className="mb-2">
                        <Form.Label>Topic Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={topic.topicName}
                          onChange={(e) => handleInputChange(e, ti, undefined, "topicName", "edit")}
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Lessons</h6>
                        <Button variant="outline-primary" size="sm" onClick={() => addLesson(ti, "edit")}>
                          Add Lesson
                        </Button>
                      </div>

                      {topic.lessons.map((lesson, li) => (
                        <div key={li} className="mb-2 border p-2 rounded">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Lesson {li + 1}</h6>
                            <Button variant="outline-danger" size="sm" onClick={() => removeLesson(ti, li, "edit")}>
                              Remove
                            </Button>
                          </div>
                          <Form.Group className="mb-1">
                            <Form.Label>Lesson Name</Form.Label>
                            <Form.Control
                              type="text"
                              value={lesson.name}
                              onChange={(e) => handleInputChange(e, ti, li, "name", "edit")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Video ID</Form.Label>
                            <Form.Control
                              type="text"
                              value={lesson.videoId}
                              onChange={(e) => handleInputChange(e, ti, li, "videoId", "edit")}
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={lesson.date}
                              onChange={(e) => handleInputChange(e, ti, li, "date", "edit")}
                            />
                          </Form.Group>
                        </div>
                      ))}
                    </div>
                  ))}

                  <Form.Group className="mb-2">
                    <Form.Label>Upload Files</Form.Label>
                    <Form.Control type="file" multiple onChange={handleFileChange} />
                  </Form.Group>
                </>
              )}
            </div>
            <div className="modal-footer">
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
              <Button variant="secondary" data-bs-dismiss="modal">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <div className="modal fade" id="createModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Create New Module</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <Form.Group className="mb-2">
                <Form.Label>Enrollment ID</Form.Label>
                <Form.Select
                  name="enrolledId"
                  value={newModule.enrolledId}
                  onChange={(e) => handleEnrollmentChange(e.target.value, "new")}
                >
                  <option value="">Select Enrollment</option>
                  {enrollments.map((enrollment) => (
                    <option key={enrollment._id} value={enrollment._id}>
                      {enrollment.batchNumber} - {enrollment.batchName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  name="courseName"
                  value={newModule.courseName}
                  onChange={(e) => handleInputChange(e, undefined, undefined, "courseName", "new")}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Mentor</Form.Label>
                <Form.Select
                  name="mentorId"
                  value={newModule.mentorId}
                  onChange={(e) => handleMentorChange(e.target.value, "new")}
                >
                  <option value="">Select Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.firstName} {mentor.lastName} - {mentor.expertise}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Subject Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newModule.modules[0].subjectName}
                  onChange={(e) => handleInputChange(e, undefined, undefined, "subjectName", "new")}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Topics</h6>
                <Button variant="outline-primary" size="sm" onClick={() => addTopic("new")}>
                  Add Topic
                </Button>
              </div>

              {newModule.modules[0].topics.map((topic, ti) => (
                <div key={ti} className="mb-3 border p-2 rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Topic {ti + 1}</h6>
                    <Button variant="outline-danger" size="sm" onClick={() => removeTopic(ti, "new")}>
                      Remove
                    </Button>
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>Topic Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={topic.topicName}
                      onChange={(e) => handleInputChange(e, ti, undefined, "topicName", "new")}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Lessons</h6>
                    <Button variant="outline-primary" size="sm" onClick={() => addLesson(ti, "new")}>
                      Add Lesson
                    </Button>
                  </div>

                  {topic.lessons.map((lesson, li) => (
                    <div key={li} className="mb-2 border p-2 rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Lesson {li + 1}</h6>
                        <Button variant="outline-danger" size="sm" onClick={() => removeLesson(ti, li, "new")}>
                          Remove
                        </Button>
                      </div>
                      <Form.Group className="mb-1">
                        <Form.Label>Lesson Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={lesson.name}
                          onChange={(e) => handleInputChange(e, ti, li, "name", "new")}
                        />
                      </Form.Group>
                      <Form.Group className="mb-1">
                        <Form.Label>Video ID</Form.Label>
                        <Form.Control
                          type="text"
                          value={lesson.videoId}
                          onChange={(e) => handleInputChange(e, ti, li, "videoId", "new")}
                        />
                      </Form.Group>
                      <Form.Group className="mb-1">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={lesson.date}
                          onChange={(e) => handleInputChange(e, ti, li, "date", "new")}
                        />
                      </Form.Group>
                    </div>
                  ))}
                </div>
              ))}

              <Form.Group className="mb-2">
                <Form.Label>Upload Files</Form.Label>
                <Form.Control type="file" multiple onChange={handleFileChange} />
              </Form.Group>
            </div>
            <div className="modal-footer">
              <Button variant="success" onClick={handleCreate}>
                Create Module
              </Button>
              <Button variant="secondary" data-bs-dismiss="modal">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModule;