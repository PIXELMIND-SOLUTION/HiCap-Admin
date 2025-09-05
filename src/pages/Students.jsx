import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaPlus } from 'react-icons/fa';

const Students = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [addForm, setAddForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmpassword: '',
  });

  const API_BASE = 'http://31.97.206.144:5001/api';

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/userregister`);
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  };

  // Fetch single user
  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/userregister/${id}`);
      setSelectedUser(res.data.data);
      const modal = new window.bootstrap.Modal(document.getElementById('userModal'));
      modal.show();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch user details', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit handlers
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };
  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`${API_BASE}/userregister/${selectedUser._id}`, editForm);
      Swal.fire('Success', 'User updated successfully!', 'success');
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      Swal.fire('Error', 'Failed to update user.', 'error');
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/userregister/${id}`);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete user.', 'error');
      }
    }
  };

  // Add user handlers
  const handleAddInputChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    const { firstName, lastName, email, phoneNumber, password, confirmpassword } = addForm;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmpassword) {
      return Swal.fire('Error', 'All fields are required', 'error');
    }
    if (password !== confirmpassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    try {
      await axios.post(`${API_BASE}/userregister`, addForm);
      Swal.fire('Success', 'User added successfully!', 'success');
      setAddForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmpassword: '',
      });
      const modalEl = document.getElementById('addModal');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      fetchUsers();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to add user', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Students Management</h3>

      <div className="mb-3 text-end">
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <FaPlus className="me-1" /> Add User
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id}>
                <td>{i + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => fetchUserById(user._id)}
                    title="View User"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => handleEditClick(user)}
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="addModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Add User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                name="firstName"
                value={addForm.firstName}
                onChange={handleAddInputChange}
                placeholder="First Name"
              />
              <input
                type="text"
                className="form-control mb-2"
                name="lastName"
                value={addForm.lastName}
                onChange={handleAddInputChange}
                placeholder="Last Name"
              />
              <input
                type="email"
                className="form-control mb-2"
                name="email"
                value={addForm.email}
                onChange={handleAddInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                className="form-control mb-2"
                name="phoneNumber"
                value={addForm.phoneNumber}
                onChange={handleAddInputChange}
                placeholder="Phone Number"
              />
              <input
                type="password"
                className="form-control mb-2"
                name="password"
                value={addForm.password}
                onChange={handleAddInputChange}
                placeholder="Password"
              />
              <input
                type="password"
                className="form-control mb-2"
                name="confirmpassword"
                value={addForm.confirmpassword}
                onChange={handleAddInputChange}
                placeholder="Confirm Password"
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={handleAddUser}>
                Add User
              </button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                name="firstName"
                value={editForm.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
              />
              <input
                type="text"
                className="form-control mb-2"
                name="lastName"
                value={editForm.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
              />
              <input
                type="email"
                className="form-control mb-2"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                className="form-control mb-2"
                name="phoneNumber"
                value={editForm.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handleUpdate}
                data-bs-dismiss="modal"
              >
                Save Changes
              </button>
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex="-1"
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="userModalLabel">User Details</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedUser ? (
                <div>
                  <p><strong>Full Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                  <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
