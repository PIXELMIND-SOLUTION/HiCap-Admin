import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = 'https://backend-hicap.onrender.com/api/liveclasses';

const LiveClasses = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    timing: '',
    description: '',
    duration: '',
    meetLink: '',
    mentorName: '',
    course: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchLiveClasses = async () => {
    try {
      const res = await axios.get(API);
      setLiveClasses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`${API}/${editId}`, form);
        Swal.fire('Updated!', 'Live class updated.', 'success');
      } else {
        await axios.post(API, form);
        Swal.fire('Added!', 'Live class added.', 'success');
      }
      setForm({ title: '', timing: '', description: '', duration: '', meetLink: '', mentorName: '', course: '' });
      setIsEdit(false);
      setEditId(null);
      fetchLiveClasses();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire('Deleted!', 'Live class deleted.', 'success');
      fetchLiveClasses();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to delete.', 'error');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Live Classes</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        {['title', 'timing', 'description', 'duration', 'meetLink', 'mentorName', 'course'].map((field) => (
          <div className="col-md-6" key={field}>
            <input
              type="text"
              className="form-control"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update' : 'Add'} Live Class
          </button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Timing</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Mentor</th>
              <th>Course</th>
              <th>Meet Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {liveClasses.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.title}</td>
                <td>{cls.timing}</td>
                <td>{cls.description}</td>
                <td>{cls.duration}</td>
                <td>{cls.mentorName}</td>
                <td>{cls.course}</td>
                <td><a href={cls.meetLink} target="_blank" rel="noopener noreferrer">Join</a></td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cls)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cls._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveClasses;
