import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const AboutInstuite = () => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title1: '',
    content1: '',
    image1: null,
  });

  const API_URL = 'https://backend-hicap.onrender.com/api/about';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data?.data?.length > 0) {
          setData(res.data.data[0]);
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load data', 'error');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title1', form.title1);
      formData.append('content1', form.content1);
      if (form.image1) {
        formData.append('image1', form.image1);
      }

      if (data) {
        await axios.put(`${API_URL}/${data._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      Swal.fire('Success', 'Saved successfully', 'success');
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to save data', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${data._id}`);
      Swal.fire('Deleted!', 'Data has been deleted.', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Failed to delete data', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image1: file });
  };

  return (
    <div className="card shadow-sm my-4 border-0">
      <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(90deg, #4e73df, #224abe)' }}>
        <h4 className="mb-0 fw-bold">About Our Institute</h4>
        <button
          className="btn btn-light btn-sm fw-bold d-flex align-items-center"
          onClick={() => {
            if (data) {
              setForm({
                title1: data.title1,
                content1: data.content1,
                image1: null
              });
            } else {
              setForm({ title1: '', content1: '', image1: null });
            }
            setShowModal(true);
          }}
        >
          {data ? <FaEdit className="me-1" /> : <FaPlus className="me-1" />}
          {data ? 'Edit' : 'Add'}
        </button>
      </div>
      <div className="card-body">
        {data ? (
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-3 mb-md-0">
              <img src={data.image1} alt="About" className="img-fluid rounded shadow-sm" style={{ maxHeight: '200px' }} />
            </div>
            <div className="col-md-8">
              <h5 className="fw-bold mb-2">{data.title1}</h5>
              <p className="text-muted">{data.content1}</p>
              <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleDelete}>
                <FaTrash className="me-1" /> Delete Section
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted">No data available</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">{data ? 'Edit' : 'Add'} About Section</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.title1}
                        onChange={(e) => setForm({ ...form, title1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        value={form.content1}
                        onChange={(e) => setForm({ ...form, content1: e.target.value })}
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
                        required={!data}
                      />
                      {data?.image1 && (
                        <div className="mt-2">
                          <small className="text-muted">Current Image:</small>
                          <img src={data.image1} alt="Current" className="img-fluid mt-1 rounded" style={{ maxHeight: '100px' }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      <FaTimes className="me-1" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <FaSave className="me-1" /> Save
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

export default AboutInstuite;
