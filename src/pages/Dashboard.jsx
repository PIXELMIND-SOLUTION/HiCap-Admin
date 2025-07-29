import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    // Destroy previous instances if they exist
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    // Create Bar Chart
    const barCtx = document.getElementById('barChart');
    barChartRef.current = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Web Dev', 'UI/UX', 'Python', 'Java'],
        datasets: [
          {
            label: 'Students',
            data: [300, 200, 150, 180],
            backgroundColor: '#0d6efd',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Create Pie Chart
    const pieCtx = document.getElementById('pieChart');
    pieChartRef.current = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Online', 'Offline'],
        datasets: [
          {
            data: [60, 40],
            backgroundColor: ['#198754', '#ffc107'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Clean up on unmount
    return () => {
      if (barChartRef.current) barChartRef.current.destroy();
      if (pieChartRef.current) pieChartRef.current.destroy();
    };
  }, []);

  return (
    <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="mb-4 fw-bold text-center">Admin Dashboard</h2>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        {[
          { title: 'Total Courses', value: 25, icon: 'bi-book', bg: 'primary' },
          { title: 'Total Students', value: 1200, icon: 'bi-people', bg: 'success' },
          { title: 'Total Batches', value: 18, icon: 'bi-layers', bg: 'warning' },
          { title: 'Live Classes Today', value: 5, icon: 'bi-camera-video', bg: 'danger' },
        ].map((item, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className={`card text-white bg-${item.bg} shadow h-100`}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <h3>{item.value}</h3>
                </div>
                <i className={`bi ${item.icon} display-5`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Students per Batch</h5>
              <div style={{ height: '300px' }}>
                <canvas id="barChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow h-100">
            <div className="card-body">
              <h5 className="card-title">Learning Mode Distribution</h5>
              <div style={{ height: '300px' }}>
                <canvas id="pieChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">Upcoming Batches</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Batch Name</th>
                  <th>Start Date</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'React Batch', date: '2025-08-01', students: 40 },
                  { id: 2, name: 'NodeJS Batch', date: '2025-08-05', students: 35 },
                  { id: 3, name: 'UI/UX Batch', date: '2025-08-08', students: 50 },
                ].map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td><span className="badge bg-primary">{row.date}</span></td>
                    <td>{row.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
