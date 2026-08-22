import React, { useState, useEffect } from 'react';
import {
  User, GraduationCap, Building2, BookOpen, CreditCard, ShieldCheck, Mail, Phone, MapPin, Calendar, Edit, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AdminUserProfileModal({ isOpen, onClose, userId, role = 'student', onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Editable Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [tinNo, setTinNo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchUserDetails = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const endpoint = role === 'student' ? `${backendUrl}/api/admin/students/${userId}` : `${backendUrl}/api/admin/clients/${userId}`;

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        const u = data.student || data.client;
        setUserData(u);
        setEnrollments(data.enrollments || []);
        setProjects(data.projects || []);

        setFullName(u.full_name || u.name || '');
        setPhone(u.phone || '');
        setFatherName(u.father_name || '');
        setMotherName(u.mother_name || '');
        setAddress(u.address || u.office_address || '');
        setEducationLevel(u.education_level || '');
        setEmergencyPhone(u.emergency_phone || '');
        setCompanyName(u.company_name || '');
        setDesignation(u.designation || '');
        setTradeLicense(u.trade_license_no || '');
        setTinNo(u.tin_no || '');
      } else {
        setError(data.message || 'Failed to load user profile.');
      }
    } catch (err) {
      setError('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
      setEditMode(false);
      setActiveTab('profile');
    }
  }, [isOpen, userId, role]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const endpoint = role === 'student' ? `${backendUrl}/api/admin/students/${userId}` : `${backendUrl}/api/admin/clients/${userId}`;

      const bodyData = role === 'student' ? {
        full_name: fullName,
        phone,
        father_name: fatherName,
        mother_name: motherName,
        address,
        education_level: educationLevel,
        emergency_phone: emergencyPhone
      } : {
        full_name: fullName,
        phone,
        company_name: companyName,
        designation,
        trade_license_no: tradeLicense,
        tin_no: tinNo,
        office_address: address
      };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (data.success) {
        setEditMode(false);
        onSaveSuccess(data.message || 'Profile updated successfully.');
        fetchUserDetails();
      } else {
        setFormError(data.message || 'Update failed.');
      }
    } catch (err) {
      setFormError('Server error updating profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <p>Loading user profile details...</p>
          </div>
        ) : error || !userData ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#EF4444' }}>
            <p>{error || 'User details not found.'}</p>
          </div>
        ) : (
          <>
            {/* USER HEADER CARD */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#070A12', border: '2px solid #00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8', flexShrink: 0 }}>
                  {role === 'student' ? <GraduationCap size={24} /> : <Building2 size={24} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userData.full_name || userData.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span>{userData.email}</span> • <span style={{ textTransform: 'capitalize', color: '#00B4D8', fontWeight: 700 }}>{role}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  background: editMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 180, 216, 0.15)',
                  color: editMode ? '#EF4444' : '#00B4D8',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit size={14} /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {/* TAB NAVIGATION */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  background: activeTab === 'profile' ? '#00B4D8' : 'transparent',
                  color: activeTab === 'profile' ? '#070A12' : '#94A3B8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Profile & Contact
              </button>

              {role === 'student' ? (
                <button
                  onClick={() => setActiveTab('enrollments')}
                  style={{
                    background: activeTab === 'enrollments' ? '#00B4D8' : 'transparent',
                    color: activeTab === 'enrollments' ? '#070A12' : '#94A3B8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Enrollments ({enrollments.length})
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('projects')}
                  style={{
                    background: activeTab === 'projects' ? '#00B4D8' : 'transparent',
                    color: activeTab === 'projects' ? '#070A12' : '#94A3B8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Projects ({projects.length})
                </button>
              )}
            </div>

            {/* TAB CONTENT: EDIT FORM OR VIEW */}
            {editMode ? (
              <form onSubmit={handleUpdateProfile} style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" value={formData.full_name || ''} onChange={e => setFormData({ ...formData, full_name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-input" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select className="form-select" value={formData.is_active ? '1' : '0'} onChange={e => setFormData({ ...formData, is_active: e.target.value === '1' })}>
                      <option value="1">Active</option>
                      <option value="0">Inactive / Suspended</option>
                    </select>
                  </div>
                  {role === 'student' ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">Educational Institute</label>
                        <input type="text" className="form-input" value={formData.institute || ''} onChange={e => setFormData({ ...formData, institute: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Degree / Department</label>
                        <input type="text" className="form-input" value={formData.degree || ''} onChange={e => setFormData({ ...formData, degree: e.target.value })} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input type="text" className="form-input" value={formData.company_name || ''} onChange={e => setFormData({ ...formData, company_name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Designation</label>
                        <input type="text" className="form-input" value={formData.designation || ''} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setEditMode(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-light)', color: '#94A3B8', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={saving} style={{ padding: '8px 20px', borderRadius: '8px', background: '#00B4D8', border: 'none', color: '#070A12', fontWeight: 800, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Profile Changes'}</button>
                </div>
              </form>
            ) : activeTab === 'profile' ? (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>Account Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', fontSize: '0.86rem', color: '#CBD5E1' }}>
                  <div><strong>Full Name:</strong> {userData.full_name || userData.name}</div>
                  <div><strong>Email Address:</strong> {userData.email}</div>
                  <div><strong>Phone:</strong> {userData.phone || 'N/A'}</div>
                  <div><strong>Status:</strong> <span style={{ color: userData.is_active ? '#10B981' : '#EF4444', fontWeight: 700 }}>{userData.is_active ? 'Active' : 'Suspended'}</span></div>
                  <div><strong>Registered Date:</strong> {new Date(userData.created_at).toLocaleDateString()}</div>
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', margin: '20px 0 12px 0' }}>
                  {role === 'student' ? 'Academic Details' : 'Corporate Organization Details'}
                </h4>
                {role === 'student' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', fontSize: '0.86rem', color: '#CBD5E1' }}>
                    <div><strong>Institute:</strong> {userData.institute || 'N/A'}</div>
                    <div><strong>Degree:</strong> {userData.degree || 'N/A'}</div>
                    <div><strong>Passing Year:</strong> {userData.passing_year || 'N/A'}</div>
                    <div><strong>NID / Student ID:</strong> {userData.nid_or_student_id || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Present Address:</strong> {userData.present_address || 'N/A'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', fontSize: '0.86rem', color: '#CBD5E1' }}>
                    <div><strong>Company Name:</strong> {userData.company_name || 'N/A'}</div>
                    <div><strong>Designation:</strong> {userData.designation || 'N/A'}</div>
                    <div><strong>Trade License:</strong> {userData.trade_license_no || 'N/A'}</div>
                    <div><strong>TIN No:</strong> {userData.tin_no || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Office Address:</strong> {userData.office_address || 'N/A'}</div>
                  </div>
                )}
              </div>
            ) : activeTab === 'enrollments' ? (
              <div className="table-responsive-wrapper" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                {enrollments.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No course enrollments found for this student.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', minWidth: '480px' }}>
                    <thead>
                      <tr style={{ background: '#070A12', color: '#64748B' }}>
                        <th style={{ padding: '8px' }}>Enrollment No</th>
                        <th style={{ padding: '8px' }}>Course</th>
                        <th style={{ padding: '8px' }}>Total Fee</th>
                        <th style={{ padding: '8px' }}>Paid</th>
                        <th style={{ padding: '8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrollments.map(e => (
                        <tr key={e.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '8px', color: '#00B4D8', fontWeight: 700 }}>{e.enrollment_no}</td>
                          <td style={{ padding: '8px', color: '#FFFFFF' }}>{e.course_title || 'Web Bootcamp'}</td>
                          <td style={{ padding: '8px' }}>৳{e.total_fee}</td>
                          <td style={{ padding: '8px', color: '#10B981', fontWeight: 700 }}>৳{e.paid_amount}</td>
                          <td style={{ padding: '8px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', fontWeight: 700 }}>{e.status?.toUpperCase()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div className="table-responsive-wrapper" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
                {projects.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No software projects found for this client.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', minWidth: '480px' }}>
                    <thead>
                      <tr style={{ background: '#070A12', color: '#64748B' }}>
                        <th style={{ padding: '8px' }}>Project Code</th>
                        <th style={{ padding: '8px' }}>Project Title</th>
                        <th style={{ padding: '8px' }}>Contract</th>
                        <th style={{ padding: '8px' }}>Paid</th>
                        <th style={{ padding: '8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '8px', color: '#00B4D8', fontWeight: 700 }}>{p.project_code}</td>
                          <td style={{ padding: '8px', color: '#FFFFFF' }}>{p.project_title}</td>
                          <td style={{ padding: '8px' }}>৳{p.contract_amount}</td>
                          <td style={{ padding: '8px', color: '#10B981', fontWeight: 700 }}>৳{p.paid_amount}</td>
                          <td style={{ padding: '8px' }}><span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 180, 216, 0.2)', color: '#00B4D8', fontWeight: 700 }}>{p.project_status?.toUpperCase()}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
