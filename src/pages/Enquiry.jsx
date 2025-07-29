import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get('https://hicap-backend-4rat.onrender.com/api/enquiries/all');
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the enquiry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://hicap-backend-4rat.onrender.com/api/enquiries/${id}`);
        Swal.fire('Deleted!', 'Enquiry deleted successfully.', 'success');
        fetchEnquiries();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://hicap-backend-4rat.onrender.com/api/enquiries/${selected._id}`, selected);
      Swal.fire('Success!', 'Enquiry updated successfully.', 'success');
      setShowModal(false);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Update failed.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelected({ ...selected, [name]: value });
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Admin Enquiries</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>City</th>
              <th>Section</th>
              <th>Timings</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td>{enquiry.name}</td>
                <td>{enquiry.phoneNumber}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.city}</td>
                <td>{enquiry.section?.map((s) => s.name).join(', ')}</td>
                <td>{enquiry.timings?.map((t) => t.preferred).join(', ')}</td>
                <td>{enquiry.message}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(enquiry)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(enquiry._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Enquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={selected.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control name="phoneNumber" value={selected.phoneNumber} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" value={selected.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control name="city" value={selected.city} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" name="message" value={selected.message} onChange={handleChange} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Enquiry;
