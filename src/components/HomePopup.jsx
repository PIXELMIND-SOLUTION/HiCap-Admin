import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const API_URL = 'https://backend-hicap.onrender.com/api/content';

const HomePopup = () => {
  const [popupData, setPopupData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    heading: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const res = await axios.get(API_URL);
      setPopupData(res.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        Swal.fire('Updated!', 'Popup content updated.', 'success');
      } else {
        await axios.post(API_URL, form);
        Swal.fire('Added!', 'New popup added.', 'success');
      }
      fetchPopups();
      setShowModal(false);
      setEditId(null);
      setForm({ title: '', heading: '', description: '', image: '' });
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      title: item.title,
      heading: item.heading,
      description: item.description,
      image: item.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire('Deleted!', 'Popup has been deleted.', 'success');
        fetchPopups();
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete.', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Home Popup Management</h3>
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowModal(true)}>+ Add New</Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Heading</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {popupData.length > 0 ? (
              popupData.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.heading}</td>
                  <td style={{ whiteSpace: 'pre-line' }}>{item.description}</td>
                  <td>
                    <img
                      src={item.image}
                      alt="Popup"
                      style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No popup data found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Popup' : 'Add New Popup'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter Title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                type="text"
                name="heading"
                value={form.heading}
                onChange={handleChange}
                placeholder="Enter Heading"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter Description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Enter Image URL"
              />
            </Form.Group>

            {form.image && (
              <div className="text-center">
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            {editId ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePopup;
