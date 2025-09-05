import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://backend-hicap.onrender.com/api/contact-details';

const Details = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    branch: '',
    address: '',
    phone: '',
    email: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data.data);
    } catch (err) {
      console.error('Error fetching contact details:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      phone: formData.phone.split(',').map((p) => p.trim()),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        Swal.fire('Updated!', 'Contact updated successfully.', 'success');
      } else {
        await axios.post(API_URL, payload);
        Swal.fire('Added!', 'Contact added successfully.', 'success');
      }
      setFormData({
        title: '',
        branch: '',
        address: '',
        phone: '',
        email: '',
        description: '',
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      console.error('Error submitting form:', err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      title: contact.title,
      branch: contact.branch,
      address: contact.address,
      phone: contact.phone.join(', '),
      email: contact.email,
      description: contact.description,
    });
    setEditingId(contact._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This contact will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire('Deleted!', 'Contact deleted.', 'success');
        fetchContacts();
      } catch (err) {
        console.error('Error deleting contact:', err);
        Swal.fire('Error!', 'Unable to delete contact.', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Contact Details Admin</h2>
      <button className="btn btn-primary mb-3" onClick={() => {
        setFormData({
          title: '',
          branch: '',
          address: '',
          phone: '',
          email: '',
          description: '',
        });
        setEditingId(null);
        setIsModalOpen(true);
      }}>
        + Add New Contact
      </button>

      {contacts.length === 0 ? (
        <p>No contacts available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Branch</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.branch}</td>
                  <td>{c.address}</td>
                  <td>{c.phone.join(', ')}</td>
                  <td>{c.email}</td>
                  <td>{c.description}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Contact' : 'Add New Contact'}</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Branch</label>
                    <input name="branch" className="form-control" value={formData.branch} onChange={handleChange} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <input name="address" className="form-control" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone (comma separated)</label>
                    <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">{editingId ? 'Update' : 'Create'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
