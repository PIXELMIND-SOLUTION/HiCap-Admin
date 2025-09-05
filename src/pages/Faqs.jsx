import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = "https://backend-hicap.onrender.com/api/faq";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    faq: [{ question: '', answer: '' }]
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(API_URL);
      setFaqs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faq];
    updatedFaqs[index][field] = value;
    setFormData({ ...formData, faq: updatedFaqs });
  };

  const addFaqField = () => {
    setFormData({ ...formData, faq: [...formData.faq, { question: '', answer: '' }] });
  };

  const removeFaqField = (index) => {
    const updatedFaqs = [...formData.faq];
    updatedFaqs.splice(index, 1);
    setFormData({ ...formData, faq: updatedFaqs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('image', formData.image);
    payload.append('faq', JSON.stringify(formData.faq));

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload);
        Swal.fire("Updated!", "FAQ updated successfully!", "success");
      } else {
        await axios.post(API_URL, payload);
        Swal.fire("Created!", "FAQ added successfully!", "success");
      }
      setFormData({ image: null, faq: [{ question: '', answer: '' }] });
      setEditId(null);
      setShowModal(false);
      fetchFaqs();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleEdit = (faq) => {
    setEditId(faq._id);
    setFormData({ image: null, faq: faq.faq });
    setShowModal(true);
  };

  
  const handleDelete = async (faq) => {
    console.log(faq._id)
    try{
        const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      await axios.delete(`https://backend-hicap.onrender.com/api/${faq._id}`);
      Swal.fire("Deleted!", "FAQ has been deleted.", "success");
      fetchFaqs();
    }
    } catch (error){
        console.log(error);
        Swal.fire("Error!", "Error Occurrred", "error");
    }
  };


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>FAQs</h2>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditId(null); setFormData({ image: null, faq: [{ question: '', answer: '' }] }); }}>
          Add FAQ
        </button>
      </div>

      <div className="row">
        {faqs.map((item) => (
          <div className="col-md-6 col-lg-4 mb-4" key={item._id}>
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt="FAQ" style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">FAQs</h5>
                {item.faq.map((qna) => (
                  <div key={qna._id}>
                    <strong>Q:</strong> {qna.question}<br />
                    <strong>A:</strong> {qna.answer}<hr />
                  </div>
                ))}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? "Edit FAQ" : "Add FAQ"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Image (optional on edit)</label>
                    <input type="file" className="form-control" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                  </div>
                  {formData.faq.map((item, index) => (
                    <div key={index} className="mb-3 border p-3 rounded bg-light">
                      <label className="form-label">Question {index + 1}</label>
                      <input type="text" className="form-control mb-2" value={item.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                      <label className="form-label">Answer</label>
                      <textarea className="form-control" value={item.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                      {formData.faq.length > 1 && (
                        <button type="button" className="btn btn-sm btn-danger mt-2" onClick={() => removeFaqField(index)}>Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-secondary" onClick={addFaqField}>Add Question</button>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">{editId ? "Update" : "Submit"}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faqs;
