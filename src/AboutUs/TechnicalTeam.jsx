import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const TechnicalTeam = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [form, setForm] = useState({
    title2: '',
    description2: '',
    image2: null,
  });

  const API_URL = 'http://31.97.206.144:5001/api/technical-team';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setTeams(res.data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load technical team data', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image2: file });
  };

  const openModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setForm({
        title2: team.title2,
        description2: team.description2,
        image2: null,
      });
    } else {
      setEditingTeam(null);
      setForm({ title2: '', description2: '', image2: null });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title2', form.title2);
    formData.append('description2', form.description2);
    if (form.image2) formData.append('image2', form.image2);

    try {
      if (editingTeam) {
        await axios.put(`${API_URL}/${editingTeam._id}`, formData);
        Swal.fire('Success', 'Updated successfully', 'success');
      } else {
        await axios.post(API_URL, formData);
        Swal.fire('Success', 'Added successfully', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to save data', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the team entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire('Deleted!', 'Entry has been deleted.', 'success');
          fetchData();
        } catch (err) {
          console.error(err);
          Swal.fire('Error', 'Failed to delete entry', 'error');
        }
      }
    });
  };

  return (
    <div className="card shadow-sm my-4 border-0">
      <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(90deg, #0f2027, #203a43, #2c5364)' }}>
        <h4 className="mb-0 fw-bold">Technical Team</h4>
        <button className="btn btn-light btn-sm d-flex align-items-center fw-semibold" onClick={() => openModal()}>
          <FaPlus className="me-1" /> Add New
        </button>
      </div>

      <div className="card-body">
        {teams.length > 0 ? (
          <div className="row">
            {teams.map((team) => (
              <div key={team._id} className="col-md-6 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={team.image2}
                    className="card-img-top"
                    alt={team.title2}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{team.title2}</h5>
                    <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                      {team.description2}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(team)}>
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(team._id)}>
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No team members found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      {editingTeam ? 'Edit Technical Member' : 'Add Technical Member'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.title2}
                        onChange={(e) => setForm({ ...form, title2: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        value={form.description2}
                        onChange={(e) => setForm({ ...form, description2: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!editingTeam}
                      />
                      {editingTeam?.image2 && (
                        <div className="mt-2">
                          <small className="text-muted">Current Image:</small>
                          <img
                            src={editingTeam.image2}
                            alt="Current"
                            className="img-fluid mt-1 rounded"
                            style={{ maxHeight: '100px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      <FaTimes className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <FaSave className="me-1" /> {editingTeam ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default TechnicalTeam;
