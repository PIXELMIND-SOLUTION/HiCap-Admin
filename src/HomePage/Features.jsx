import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = 'https://hicap-backend-4rat.onrender.com/api/home-features';

const Features = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState([{ title: '', content: '', image: null }]);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFeature = () => {
    setForm([...form, { title: '', content: '', image: null }]);
  };

  const handleChange = (index, field, value) => {
    const updatedForm = [...form];
    updatedForm[index][field] = value;
    setForm(updatedForm);
  };
  const handleEdit = (item) => {
    setDescription(item.description);
    setForm(item.features.map(f => ({ ...f, image: null })));
    setEditingId(item._id);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    form.forEach((item, i) => {
      formData.append(`features[${i}][title]`, item.title);
      formData.append(`features[${i}][content]`, item.content);
      formData.append('images', item.image); // images[]
    });

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        Swal.fire('Updated!', 'Home Feature updated.', 'success');
      } else {
        await axios.post(API, formData);
        Swal.fire('Created!', 'Home Feature created.', 'success');
      }
      setForm([{ title: '', content: '', image: null }]);
      setDescription('');
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong!', 'error');
    }
  };

  

  const handleDelete = async (item) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this Home Feature!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API}/${item._id}`);
        Swal.fire('Deleted!', 'Feature deleted.', 'success');
        fetchData();
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Delete failed.', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">{editingId ? 'Edit' : 'Add'} Home Features</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>

        {form.map((f, idx) => (
          <div key={idx} className="border p-3 mb-3 rounded shadow-sm">
            <div className="mb-2">
              <label>Title</label>
              <input className="form-control" value={f.title} onChange={e => handleChange(idx, 'title', e.target.value)} required />
            </div>
            <div className="mb-2">
              <label>Content</label>
              <textarea className="form-control" value={f.content} onChange={e => handleChange(idx, 'content', e.target.value)} required />
            </div>
            <div>
              <label>Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={e => handleChange(idx, 'image', e.target.files[0])} />
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-3" onClick={handleAddFeature}>+ Add More Feature</button>
        <br />
        <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
      </form>

      <hr className="my-4" />

      <h4>Existing Home Features</h4>
      {data.length === 0 ? <p>No data found.</p> :
        data.map((item) => (
          <div key={item._id} className="border p-3 mb-3 rounded bg-light">
            <h5>{item.description}</h5>
            <div className="row">
              {item.features.map((f) => (
                <div className="col-md-3 mb-3" key={f._id}>
                  <div className="card h-100">
                    <img src={f.image} alt={f.title} className="card-img-top" />
                    <div className="card-body">
                      <h6>{f.title}</h6>
                      <p>{f.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>Delete</button>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default Features;
