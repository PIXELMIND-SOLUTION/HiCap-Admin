import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://hicap-backend-4rat.onrender.com/api/social-media';

const SocialMedia = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', link: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching social media data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        Swal.fire('Updated!', 'Social media link updated successfully.', 'success');
      } else {
        await axios.post(API_URL, form);
        Swal.fire('Created!', 'Social media link added successfully.', 'success');
      }
      setForm({ name: '', link: '' });
      setEditingId(null);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving data:', err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, link: item.link });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This social media link will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire('Deleted!', 'Link has been deleted.', 'success');
        fetchData();
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error!', 'Could not delete.', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Social Media Admin</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setForm({ name: '', link: '' });
          setEditingId(null);
          setIsModalOpen(true);
        }}
      >
        + Add New Social Media
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="3">No social media links found.</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.link}
                    </a>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Link' : 'Add Link'}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Link</label>
                    <input type="text" name="link" value={form.link} onChange={handleChange} className="form-control" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMedia;
