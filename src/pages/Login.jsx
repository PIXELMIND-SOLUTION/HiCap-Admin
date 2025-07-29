import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validCredentials = [
        { phone: '6303092897', password: 'admin123' },
        { phone: '9988776655', password: 'admin123' },
        { phone: '9876543211', password: 'admin123' }
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        const user = validCredentials.find(
            (cred) => cred.phone === phone && cred.password === password
        );

        if (user) {
            setSuccess('Login successful!');
            setError('');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid phone number or password');
            setSuccess('');
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1950&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                className="p-4 shadow-lg"
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '20px',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <div className="text-center mb-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                        alt="Admin Icon"
                        style={{ width: '60px', marginBottom: '10px' }}
                    />
                    <h3 className="fw-bold text-white">Admin Login</h3>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label text-white">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-1">{error}</div>}
                    {success && <div className="alert alert-success py-1">{success}</div>}
                    <button type="submit" className="btn btn-primary w-100 mt-2 fw-semibold">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
