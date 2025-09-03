import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', images: [] });

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://31.97.206.144:5001/api/client');
      setClients(res.data || []);
      console.log(res)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setForm({ ...form, images: Array.from(e.target.files) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    form.images.forEach((img) => formData.append('image', img));

    try {
      if (editId) {
        await axios.put(`http://31.97.206.144:5001/api/client/${editId}`, formData);
        Swal.fire('Updated!', 'Client updated successfully', 'success');
      } else {
        await axios.post('http://31.97.206.144:5001/api/client', formData);
        Swal.fire('Added!', 'Client added successfully', 'success');
      }
      setShowModal(false);
      setForm({ name: '', images: [] });
      setEditId(null);
      fetchClients();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the client!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://31.97.206.144:5001/api/client/${id}`);
        Swal.fire('Deleted!', 'Client deleted successfully.', 'success');
        fetchClients();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Delete failed!', 'error');
      }
    }
  };

  const handleEdit = (client) => {
    setForm({ name: client.name, images: [] });
    setEditId(client._id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Clients</h3>
        <Button onClick={() => { setShowModal(true); setEditId(null); setForm({ name: '', images: [] }); }}>
          Add Client
        </Button>
      </div>

      <div className="row">
        {clients.map((client) => (
          <div className="col-md-4 col-sm-6 mb-4" key={client._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">{client.name}</h5>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {client.image.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="client"
                      className="img-fluid rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
                <div className="mt-3 d-flex justify-content-center gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleEdit(client)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(client._id)}>Delete</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Client' : 'Add Client'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Client Images {editId ? '(optional)' : ''}</Form.Label>
              <Form.Control
                type="file"
                name="images"
                onChange={handleChange}
                accept="image/*"
                multiple
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="success">{editId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Clients;
