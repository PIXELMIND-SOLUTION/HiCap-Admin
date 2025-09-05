import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const Leadership = () => {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    content: '',
    image: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [docId, setDocId] = useState(null);

  const API_URL = 'https://backend-hicap.onrender.com/api/leadership';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data?.length > 0) {
          setDocId(response.data[0]._id);
          setMembers(response.data[0].leadership || []);
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Failed to load leadership data', 'error');
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('role', form.role);
      formData.append('content', form.content);
      if (form.image) formData.append('image', form.image);

      if (editingIndex !== null) {
        await axios.put(`${API_URL}/${docId}?index=${editingIndex}`, formData);
        Swal.fire('Success', 'Member updated successfully', 'success');
      } else {
        await axios.post(`${API_URL}`, formData);
        Swal.fire('Success', 'Member added successfully', 'success');
      }

      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to save member', 'error');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${API_URL}/${docId}?index=${index}`);
      Swal.fire('Deleted!', 'Member deleted successfully', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to delete member', 'error');
    }
  };

  return (
    <div className="card shadow-sm my-4 border-0">
      <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(90deg, #1d3557, #457b9d)' }}>
        <h4 className="mb-0 fw-bold">Leadership Team</h4>
        <button
          className="btn btn-light btn-sm fw-bold d-flex align-items-center"
          onClick={() => {
            setForm({ name: '', role: '', content: '', image: null });
            setEditingIndex(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="me-1" /> Add Member
        </button>
      </div>

      <div className="card-body">
        {members.length > 0 ? (
          <div className="row">
            {members.map((member, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={member.image}
                    className="card-img-top"
                    alt={member.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{member.name}</h5>
                    <h6 className="text-muted mb-2">{member.role}</h6>
                    <p className="text-secondary">{member.content}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setForm({
                          name: member.name,
                          role: member.role,
                          content: member.content,
                          image: null
                        });
                        setEditingIndex(index);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No leadership members found.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      {editingIndex !== null ? 'Edit' : 'Add'} Leadership Member
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleImageChange}
                        required={editingIndex === null}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      <FaTimes className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <FaSave className="me-1" /> {editingIndex !== null ? 'Update' : 'Add'}
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

export default Leadership;
