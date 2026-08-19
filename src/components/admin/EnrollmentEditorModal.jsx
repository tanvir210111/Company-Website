import React, { useState, useEffect } from 'react';
import {
  BookOpen, User, DollarSign, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function EnrollmentEditorModal({ isOpen, onClose, initialEnrollment, onSaveSuccess }) {
  const [studentOptions, setStudentOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Form States
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [totalFee, setTotalFee] = useState('');
  const [paidAmount, setPaidAmount] = useState('0');
  const [status, setStatus] = useState('active');
  const [classMode, setClassMode] = useState('offline');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const [stRes, crRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin/enrollment-options/students`, { credentials: 'include' }),
        fetch(`${backendUrl}/api/admin/enrollment-options/courses`, { credentials: 'include' })
      ]);
      const stData = await stRes.json();
      const crData = await crRes.json();

      if (stData.success) setStudentOptions(stData.students || []);
      if (crData.success) setCourseOptions(crData.courses || []);
    } catch (err) {
      console.log('Error fetching options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
      setFormError('');

      if (initialEnrollment) {
        setStudentId(initialEnrollment.student_id || '');
        setCourseId(initialEnrollment.course_id || '');
        setTotalFee(initialEnrollment.total_fee || '0');
        setPaidAmount(initialEnrollment.paid_amount || '0');
        setStatus(initialEnrollment.status || 'active');
        setClassMode(initialEnrollment.class_mode || 'offline');
      } else {
        setStudentId('');
        setCourseId('');
        setTotalFee('');
        setPaidAmount('0');
        setStatus('active');
        setClassMode('offline');
      }
    }
  }, [isOpen, initialEnrollment]);

  if (!isOpen) return null;

  // Auto-fill course fee when course is selected in Create mode
  const handleCourseChange = (e) => {
    const selectedCId = e.target.value;
    setCourseId(selectedCId);
    if (!initialEnrollment && selectedCId) {
      const foundCourse = courseOptions.find(c => c.id == selectedCId);
      if (foundCourse) {
        setTotalFee(foundCourse.discount_fee || foundCourse.regular_fee || '15000');
      }
    }
  };

  const calculatedDue = Math.max(0, (parseFloat(totalFee) || 0) - (parseFloat(paidAmount) || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!studentId) { setFormError('Please select a student.'); return; }
    if (!courseId) { setFormError('Please select a course.'); return; }
    if (parseFloat(paidAmount) > parseFloat(totalFee)) {
      setFormError('Paid amount cannot exceed total course fee.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const isEdit = !!initialEnrollment;
      const url = isEdit ? `${backendUrl}/api/admin/enrollments/${initialEnrollment.id}` : `${backendUrl}/api/admin/enrollments`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId,
          total_fee: totalFee,
          paid_amount: paidAmount,
          status,
          class_mode: classMode
        })
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess(data.message || (isEdit ? 'Enrollment updated.' : 'Enrollment created.'));
        onClose();
      } else {
        setFormError(data.message || 'Failed to save enrollment.');
      }
    } catch (err) {
      setFormError('Server error saving enrollment record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen color="#00B4D8" size={22} />
          {initialEnrollment ? `Edit Enrollment #${initialEnrollment.enrollment_no || initialEnrollment.id}` : 'Enroll Student into Course'}
        </h3>

        {loadingOptions ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>Loading student & course options...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* STUDENT SELECTOR */}
            <div className="form-group">
              <label className="form-label">Student Account *</label>
              <select
                required
                disabled={!!initialEnrollment}
                className="form-input"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
              >
                <option value="">-- Select Registered Student --</option>
                {studentOptions.map(s => (
                  <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>
                ))}
              </select>
            </div>

            {/* COURSE SELECTOR */}
            <div className="form-group">
              <label className="form-label">Target Course *</label>
              <select
                required
                disabled={!!initialEnrollment}
                className="form-input"
                value={courseId}
                onChange={handleCourseChange}
              >
                <option value="">-- Select Course --</option>
                {courseOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.title} (৳{c.discount_fee || c.regular_fee})</option>
                ))}
              </select>
            </div>

            {/* FEES & FINANCIALS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Total Fee (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={totalFee}
                  onChange={e => setTotalFee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paid Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={paidAmount}
                  onChange={e => setPaidAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Calculated Due</label>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  value={`৳${calculatedDue}`}
                  style={{ background: '#070A12', color: calculatedDue > 0 ? '#EF4444' : '#10B981', fontWeight: 800 }}
                />
              </div>
            </div>

            {/* STATUS & CLASS MODE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Enrollment Status</label>
                <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Class Mode</label>
                <select className="form-input" value={classMode} onChange={e => setClassMode(e.target.value)}>
                  <option value="offline">Offline Lab</option>
                  <option value="online">Online Live Class</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {formError && <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '12px' }}>{formError}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}
            >
              {submitting ? 'Saving Enrollment...' : (initialEnrollment ? 'Update Enrollment Record' : 'Confirm Student Enrollment')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
