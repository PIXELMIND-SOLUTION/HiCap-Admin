import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AboutInstuite from './AboutUs/AboutInstuite';
import Leadership from './AboutUs/LeaderShip';
import TechnicalTeam from './AboutUs/TechnicalTeam';
import Classroom from './AboutUs/ClassRooms';
import Faqs from './pages/Faqs';
import LiveClasses from './components/LiveClasses';
import Courses from './pages/Courses';
import HomePopup from './components/HomePopup';
import MentorsAndExperience from './components/MentorsAndExperiance';
import Clients from './components/Clients';
import Enquiry from './pages/Enquiry';
import Contact from './pages/Contact';
import Students from './pages/Students';
import Details from './components/details';
import SocialMedia  from './pages/SocialMedia';
import Features from './HomePage/Features';
import EnrollmentAndCertificate from './components/Enrollment&Certificate';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/details" element={<Details />} />
          <Route path="/admin/about-section" element={<AboutInstuite />} />
          <Route path="/admin/leadership" element={<Leadership />} />
          <Route path="/admin/technical-team" element={<TechnicalTeam />} />
          <Route path="/admin/classrooms" element={<Classroom />} />
          <Route path="/admin/faqs" element={<Faqs />} />
          <Route path="/admin/mentors" element={<MentorsAndExperience />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/live-classes" element={<LiveClasses />} />
          <Route path="/admin/courses" element={<Courses />} />
          <Route path="/admin/homepopup" element={<HomePopup />} />
          <Route path="/admin/enquiry" element={<Enquiry />} />
          <Route path="/admin/contact" element={<Contact />} />
          <Route path="/admin/social-media" element={<SocialMedia />} />
          <Route path="/admin/features" element={<Features/>}/>
          <Route path="/admin/enrollandcertificate" element={<EnrollmentAndCertificate />}/>
          {/* Other routes... */}
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<div className="p-5 text-center text-danger">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;