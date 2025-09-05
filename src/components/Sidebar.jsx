import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FaTachometerAlt,
  FaBook,
  FaVideo,
  FaUserTie,
  FaUsers,
  FaLayerGroup,
  FaQuestionCircle,
  FaHome,
  FaAddressCard,
  FaPhone,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaPlus,
  FaUserGraduate,
  FaDatabase,
} from 'react-icons/fa';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobile }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/admin/homepopup', icon: <FaHome />, label: 'HomePopup' },
    { path: '/admin/students', icon: <FaUser />, label: 'Students' },
    { path: '/admin/courses', icon: <FaBook />, label: 'Courses' },
    { path: '/admin/live-classes', icon: <FaVideo />, label: 'Live Classes' },
    { path: '/admin/enrollandcertificate', icon: <FaUserGraduate />, label: 'Enrollment&Certificate' },
    { path: '/admin/module', icon: <FaDatabase />, label: 'Course Modules' },
    { path: '#', icon: <FaLayerGroup />, label: 'Batches' },
    { path: '#homepage', icon: <FaPlus />, label: 'Home Page',
      isDropdown: true,
      dropdownKey: 'homepage',
      subItems: [
        { path: '/admin/features', label: 'Features' },
        { path: '#', label: 'CourseSection' }
      ]
     },
    { path: '/admin/faqs', icon: <FaQuestionCircle />, label: 'FAQS' },
    {
      path: '#staffandclients', 
      icon: <FaUsers />, 
      label: 'Staff & Clients', 
      isDropdown: true,
      dropdownKey: 'staffAndClients',
      subItems: [
        { path: '/admin/mentors', label: 'Mentors & Experience' },
        { path: '/admin/clients', label: 'Clients' }
      ]
    },
    {
      path: '#about',
      icon: <FaAddressCard />,
      label: 'About Sections',
      isDropdown: true,
      dropdownKey: 'aboutSections',
      subItems: [
        { path: '/admin/about-section', label: 'About Section' },
        { path: '/admin/leadership', label: 'Leadership' },
        { path: '/admin/technical-team', label: 'Technical Team' },
        { path: '/admin/classrooms', label: 'Classrooms' }
      ]
    },
    { 
      path: '#contact', 
      icon: <FaPhone />, 
      label: 'Contact', 
      isDropdown: true,
      dropdownKey: 'contact',
      subItems: [
        { path: '/admin/enquiry', label: 'Enquiry Data' },
        { path: '/admin/contact', label: 'Contact Details' }
      ]
    },
    {
      path: '/logout',
      icon: <FaSignOutAlt />,
      label: 'Logout',
      onClick: () => {
        sessionStorage.removeItem('adminUser');
        window.location.href = '/';
      }
    }
  ];

  const isSubItemActive = (subItems) => {
    return subItems?.some(item => activePath.startsWith(item.path));
  };

  const toggleDropdown = (dropdownKey) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey]
    }));
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.isDropdown) {
      toggleDropdown(item.dropdownKey);
    }
  };

  return (
    <div
      className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}
      style={{
        width: isCollapsed ? (isMobile ? '0' : '80px') : isMobile ? '280px' : '250px',
        minWidth: isCollapsed ? (isMobile ? '0' : '80px') : isMobile ? '280px' : '250px',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        height: '200vh',
        position: isMobile ? 'fixed' : 'relative',
        background: 'linear-gradient(180deg, #4c6ef5, #15aabf)',
        color: '#fff',
        overflow: 'hidden',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* Header */}
        <div
          className="p-3 border-bottom d-flex justify-content-between align-items-center bg-transparent"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {!isCollapsed && <h5 className="m-0 fw-bold text-white">Hi-Cap</h5>}
          <button
            className="btn btn-sm btn-light rounded-circle"
            onClick={() => onToggleCollapse(!isCollapsed)}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <ul
          className="nav flex-column flex-grow-1 p-2 overflow-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              <li className="nav-item my-1">
                {item.onClick || item.isDropdown ? (
                  <button
                    className={`nav-link text-start w-100 btn btn-link text-white d-flex align-items-center ${
                      (activePath === item.path || (item.isDropdown && isSubItemActive(item.subItems)))
                        ? 'fw-bold active-item' : ''
                      }`}
                    onClick={() => handleItemClick(item)}
                    style={{
                      fontSize: isCollapsed ? '1.1rem' : '1rem',
                      padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span
                      style={{
                        fontSize: isCollapsed ? '1.5rem' : '1.25rem',
                        minWidth: '24px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="ms-2">
                        {item.label}
                      </span>
                    )}
                    {!isCollapsed && item.isDropdown && (
                      <span className="ms-auto">
                        {openDropdowns[item.dropdownKey] ? <BsChevronUp /> : <BsChevronDown />}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-link text-white d-flex align-items-center ${
                      activePath === item.path ? 'fw-bold active-item' : ''
                    }`}
                    style={{
                      fontSize: isCollapsed ? '1.1rem' : '1rem',
                      padding: isCollapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span
                      style={{
                        fontSize: isCollapsed ? '1.5rem' : '1.25rem',
                        minWidth: '24px',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="ms-2">
                        {item.label}
                      </span>
                    )}
                  </Link>
                )}
              </li>

              {/* Dropdown Items */}
              {item.isDropdown && openDropdowns[item.dropdownKey] && (
                <div
                  className="dropdown-items-container"
                  style={{
                    maxHeight: openDropdowns[item.dropdownKey] ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                    paddingLeft: isCollapsed ? '0' : '1.5rem'
                  }}
                >
                  {item.subItems.map((subItem) => (
                    <li className="nav-item" key={subItem.path}>
                      <Link
                        to={subItem.path}
                        className={`nav-link d-block ${
                          activePath === subItem.path ? 'fw-semibold text-warning' : 'text-white'
                        }`}
                        style={{
                          fontSize: '0.95rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          marginLeft: isCollapsed ? '0.5rem' : '0',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {!isCollapsed && subItem.label}
                      </Link>
                    </li>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default Sidebar;