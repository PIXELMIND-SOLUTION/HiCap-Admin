import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Classrooms = () => {
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title3: '',
        description3: '',
        image3: []
    });
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const API_URL = 'https://backend-hicap.onrender.com/api/classRoom';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(API_URL);
                if (res.data.data?.length > 0) {
                    setData(res.data.data[0]);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                Swal.fire('Error', 'Failed to load data', 'error');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title3', form.title3);
        formData.append('description3', form.description3);

        for (let i = 0; i < form.image3.length; i++) {
            formData.append('image3', form.image3[i]);
        }

        try {
            if (data) {
                await axios.put(`${API_URL}/${data._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(API_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            Swal.fire('Success', 'Saved successfully', 'success');
            setShowModal(false);
            window.location.reload();
        } catch (err) {
            console.error('Submit error:', err);
            Swal.fire('Error', 'Failed to save data', 'error');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/${data._id}`);
            Swal.fire('Deleted!', 'Section deleted successfully', 'success');
            window.location.reload();
        } catch (err) {
            console.error('Delete error:', err);
            Swal.fire('Error', 'Failed to delete', 'error');
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setForm({ ...form, image3: files });
    };

    return (
        <div className="card shadow my-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
                <h2 className="mb-0">Global Classrooms</h2>
                <button
                    className="btn btn-light"
                    onClick={() => {
                        if (data) {
                            setForm({
                                title3: data.title3,
                                description3: data.description3,
                                image3: [] // Do not preload files
                            });
                        } else {
                            setForm({ title3: '', description3: '', image3: [] });
                        }
                        setShowModal(true);
                    }}
                >
                    {data ? 'Edit' : 'Add'}
                </button>
            </div>

            <div className="card-body">
                {data ? (
                    <>
                        <h3>{data.title3}</h3>
                        <p style={{ whiteSpace: 'pre-line' }}>{data.description3}</p>

                        <div id="carouselExample" className="carousel slide mb-3">
                            <div className="carousel-inner">
                                {data.image3?.map((img, index) => (
                                    <div
                                        className={`carousel-item ${index === activeImageIndex ? 'active' : ''}`}
                                        key={index}
                                    >
                                        <img
                                            src={img}
                                            className="d-block w-100 rounded object-fit-cover"
                                            alt={`Slide ${index + 1}`}
                                            style={{ maxHeight: '300px', objectFit: 'cover' }} // Adjust maxHeight as needed
                                        />

                                    </div>
                                ))}
                            </div>
                            <button
                                className="carousel-control-prev"
                                type="button"
                                onClick={() =>
                                    setActiveImageIndex((prev) =>
                                        prev === 0 ? data.image3.length - 1 : prev - 1
                                    )
                                }
                            >
                                <span className="carousel-control-prev-icon"></span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                onClick={() =>
                                    setActiveImageIndex((prev) =>
                                        prev === data.image3.length - 1 ? 0 : prev + 1
                                    )
                                }
                            >
                                <span className="carousel-control-next-icon"></span>
                            </button>
                        </div>

                        <button className="btn btn-danger" onClick={handleDelete}>
                            Delete Section
                        </button>
                    </>
                ) : (
                    <p>No data available</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="modal-header">
                                    <h5 className="modal-title">{data ? 'Edit' : 'Add'} Classrooms</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.title3}
                                            onChange={(e) => setForm({ ...form, title3: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            value={form.description3}
                                            onChange={(e) => setForm({ ...form, description3: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label>Upload Classroom Images (max 12)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                        {form.image3.length > 0 && (
                                            <p className="mt-2 text-success">{form.image3.length} image(s) selected</p>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop show"></div>}
        </div>
    );
};

export default Classrooms;
