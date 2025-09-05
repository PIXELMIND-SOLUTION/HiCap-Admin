import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const mentorAPI = "https://backend-hicap.onrender.com/api/our-mentor";
const experienceAPI = "https://backend-hicap.onrender.com/api/our-mentor/experience";

const MentorsAndExperience = () => {
  const [mentors, setMentors] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editMentorId, setEditMentorId] = useState(null);
  const [editExperienceId, setEditExperienceId] = useState(null);

  const [mentorForm, setMentorForm] = useState({ name: '', role: '', content: '', image: null });
  const [experienceForm, setExperienceForm] = useState({ name: '', content: '', image: null });

  useEffect(() => {
    fetchMentors();
    fetchExperiences();
  }, []);

  const fetchMentors = async () => {
    const res = await axios.get(mentorAPI);
    setMentors(res.data.data);
  };

  const fetchExperiences = async () => {
    const res = await axios.get(experienceAPI);
    setExperiences(res.data.data);
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(mentorForm).forEach(([k, v]) => formData.append(k, v));

    try {
      if (editMentorId) {
        await axios.put(`${mentorAPI}/${editMentorId}`, formData);
        Swal.fire('Updated', 'Mentor updated', 'success');
      } else {
        await axios.post(mentorAPI, formData);
        Swal.fire('Added', 'Mentor created', 'success');
      }
      fetchMentors();
      resetMentorForm();
    } catch {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(experienceForm).forEach(([k, v]) => formData.append(k, v));

    try {
      if (editExperienceId) {
        await axios.put(`${experienceAPI}/${editExperienceId}`, formData);
        Swal.fire('Updated', 'Experience updated', 'success');
      } else {
        await axios.post(experienceAPI, formData);
        Swal.fire('Added', 'Experience created', 'success');
      }
      fetchExperiences();
      resetExperienceForm();
    } catch {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const deleteMentor = async (id) => {
    const res = await Swal.fire({ title: "Delete Mentor?", showCancelButton: true });
    if (res.isConfirmed) {
      await axios.delete(`${mentorAPI}/${id}`);
      fetchMentors();
    }
  };

  const deleteExperience = async (id) => {
    const res = await Swal.fire({ title: "Delete Experience?", showCancelButton: true });
    if (res.isConfirmed) {
      await axios.delete(`${experienceAPI}/${id}`);
      fetchExperiences();
    }
  };

  const resetMentorForm = () => {
    setMentorForm({ name: '', role: '', content: '', image: null });
    setShowMentorModal(false);
    setEditMentorId(null);
  };

  const resetExperienceForm = () => {
    setExperienceForm({ name: '', content: '', image: null });
    setShowExperienceModal(false);
    setEditExperienceId(null);
  };

  return (
    <div className="container py-4">
      {/* Mentors */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Mentors</h2>
        <button className="btn btn-primary" onClick={() => setShowMentorModal(true)}>Add Mentor</button>
      </div>
      <div className="row">
        {mentors.map(m => (
          <div className="col-md-6 col-lg-4 mb-4" key={m._id}>
            <div className="card h-100">
              <img src={m.image} alt={m.name} className="card-img-top" style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body">
                <h5>{m.name}</h5>
                <p className="text-muted">{m.role}</p>
                <p>{m.content}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-warning btn-sm" onClick={() => {
                  setEditMentorId(m._id);
                  setMentorForm({ name: m.name, role: m.role, content: m.content, image: null });
                  setShowMentorModal(true);
                }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteMentor(m._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="d-flex justify-content-between mt-5 mb-3">
        <h2>Mentor Experiences</h2>
        <button className="btn btn-success" onClick={() => setShowExperienceModal(true)}>Add Experience</button>
      </div>
      <div className="row">
        {experiences.map(exp => (
          <div className="col-md-6 col-lg-4 mb-4" key={exp._id}>
            <div className="card h-100">
              <img src={exp.image} alt={exp.name} className="card-img-top" style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body">
                <h5>{exp.name}</h5>
                <p>{exp.content}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-warning btn-sm" onClick={() => {
                  setEditExperienceId(exp._id);
                  setExperienceForm({ name: exp.name, content: exp.content, image: null });
                  setShowExperienceModal(true);
                }}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteExperience(exp._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Modal */}
      {showMentorModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleMentorSubmit}>
                <div className="modal-header">
                  <h5>{editMentorId ? "Edit Mentor" : "Add Mentor"}</h5>
                  <button type="button" className="btn-close" onClick={resetMentorForm}></button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Name" value={mentorForm.name} onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })} required />
                  <input type="text" className="form-control mb-2" placeholder="Role" value={mentorForm.role} onChange={e => setMentorForm({ ...mentorForm, role: e.target.value })} required />
                  <textarea className="form-control mb-2" placeholder="Content" value={mentorForm.content} onChange={e => setMentorForm({ ...mentorForm, content: e.target.value })} required />
                  <input type="file" className="form-control" onChange={e => setMentorForm({ ...mentorForm, image: e.target.files[0] })} />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">{editMentorId ? "Update" : "Submit"}</button>
                  <button type="button" className="btn btn-secondary" onClick={resetMentorForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleExperienceSubmit}>
                <div className="modal-header">
                  <h5>{editExperienceId ? "Edit Experience" : "Add Experience"}</h5>
                  <button type="button" className="btn-close" onClick={resetExperienceForm}></button>
                </div>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Name" value={experienceForm.name} onChange={e => setExperienceForm({ ...experienceForm, name: e.target.value })} required />
                  <textarea className="form-control mb-2" placeholder="Content" value={experienceForm.content} onChange={e => setExperienceForm({ ...experienceForm, content: e.target.value })} required />
                  <input type="file" className="form-control" onChange={e => setExperienceForm({ ...experienceForm, image: e.target.files[0] })} />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">{editExperienceId ? "Update" : "Submit"}</button>
                  <button type="button" className="btn btn-secondary" onClick={resetExperienceForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsAndExperience;
