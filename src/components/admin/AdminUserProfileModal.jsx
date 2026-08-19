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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#070A12', border: '2px solid #00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                  {role === 'student' ? <GraduationCap size={24} /> : <Building2 size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {userData.full_name || userData.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', display: 'flex', gap: '10px' }}>
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' }}>
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="text" required className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>

                {role === 'student' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Father's Name</label>
                        <input type="text" className="form-input" value={fatherName} onChange={e => setFatherName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mother's Name</label>
                        <input type="text" className="form-input" value={motherName} onChange={e => setMotherName(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Education Level / Degree</label>
                        <input type="text" className="form-input" value={educationLevel} onChange={e => setEducationLevel(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Emergency Contact Phone</label>
                        <input type="text" className="form-input" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Company Name *</label>
                        <input type="text" required className="form-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Designation / Position</label>
                        <input type="text" className="form-input" value={designation} onChange={e => setDesignation(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Trade License No.</label>
                        <input type="text" className="form-input" value={tradeLicense} onChange={e => setTradeLicense(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">TIN Number</label>
                        <input type="text" className="form-input" value={tinNo} onChange={e => setTinNo(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Full Address</label>
                  <textarea rows={2} className="form-input" value={address} onChange={e => setAddress(e.target.value)} />
                </div>

                {formError && <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '10px' }}>{formError}</div>}

                <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', padding: '10px', fontWeight: 800 }}>
                  {submitting ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            ) : activeTab === 'profile' ? (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#070A12', padding: '16px', borderRadius: '10px' }}>
                  <div><strong style={{ color: '#00B4D8' }}>Account Status:</strong> {userData.is_active ? 'ACTIVE ✅' : 'INACTIVE ❌'}</div>
                  <div><strong style={{ color: '#00B4D8' }}>Phone:</strong> {userData.phone}</div>
                  <div><strong style={{ color: '#00B4D8' }}>Email:</strong> {userData.email}</div>
                  <div><strong style={{ color: '#00B4D8' }}>Joined Date:</strong> {new Date(userData.created_at).toLocaleDateString()}</div>
                </div>

                {role === 'student' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#070A12', padding: '16px', borderRadius: '10px' }}>
                    <div><strong>Father's Name:</strong> {userData.father_name || 'N/A'}</div>
                    <div><strong>Mother's Name:</strong> {userData.mother_name || 'N/A'}</div>
                    <div><strong>Education Level:</strong> {userData.education_level || 'N/A'}</div>
                    <div><strong>Emergency Contact:</strong> {userData.emergency_phone || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {userData.address || 'N/A'}</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#070A12', padding: '16px', borderRadius: '10px' }}>
                    <div><strong>Company Name:</strong> {userData.company_name || 'N/A'}</div>
                    <div><strong>Designation:</strong> {userData.designation || 'N/A'}</div>
                    <div><strong>Trade License:</strong> {userData.trade_license_no || 'N/A'}</div>
                    <div><strong>TIN No:</strong> {userData.tin_no || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}><strong>Office Address:</strong> {userData.office_address || 'N/A'}</div>
                  </div>
                )}
              </div>
            ) : activeTab === 'enrollments' ? (
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {enrollments.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No course enrollments found for this student.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
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
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {projects.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No software projects found for this client.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
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
