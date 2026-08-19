import React, { useState, useEffect } from 'react';
import {
  Building2, User, DollarSign, Calendar, CheckCircle2, AlertCircle
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Enterprise Software',
  'Custom ERP System',
  'Mobile Applications',
  'Web Portal & SaaS',
  'AI & Machine Learning',
  'Cloud Infrastructure',
  'E-Commerce Platform'
];

const STATUS_OPTIONS = [
  { value: 'srs_planning', label: 'SRS Planning' },
  { value: 'inquiry', label: 'Initial Inquiry' },
  { value: 'in_development', label: 'In Development' },
  { value: 'testing', label: 'QA & Testing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function ProjectEditorModal({ isOpen, onClose, initialProject, onSaveSuccess }) {
  const [clientOptions, setClientOptions] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // Form States
  const [clientId, setClientId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Enterprise Software');
  const [contractAmount, setContractAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [status, setStatus] = useState('srs_planning');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/project-options/clients`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setClientOptions(data.clients || []);
    } catch (err) {
      console.log('Error fetching client options:', err);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      setFormError('');

      if (initialProject) {
        setClientId(initialProject.client_id || '');
        setProjectTitle(initialProject.project_title || '');
        setServiceCategory(initialProject.service_category || 'Enterprise Software');
        setContractAmount(initialProject.contract_amount || '0');
        setPaidAmount(initialProject.paid_amount || '0');
        setStartDate(initialProject.start_date || '');
        setEstimatedDeliveryDate(initialProject.estimated_delivery_date || '');
        setStatus(initialProject.status || 'srs_planning');
      } else {
        setClientId('');
        setProjectTitle('');
        setServiceCategory('Enterprise Software');
        setContractAmount('');
        setPaidAmount('0');
        setStartDate('');
        setEstimatedDeliveryDate('');
        setStatus('srs_planning');
      }
    }
  }, [isOpen, initialProject]);

  if (!isOpen) return null;

  const calculatedDue = Math.max(0, (parseFloat(contractAmount) || 0) - (parseFloat(paidAmount) || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!clientId) { setFormError('Please select a corporate client.'); return; }
    if (!projectTitle.trim()) { setFormError('Please enter a project title.'); return; }
    if (parseFloat(contractAmount) < 0) { setFormError('Contract amount cannot be negative.'); return; }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const isEdit = !!initialProject;
      const url = isEdit ? `${backendUrl}/api/admin/projects/${initialProject.id}` : `${backendUrl}/api/admin/projects`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          client_id: clientId,
          project_title: projectTitle,
          service_category: serviceCategory,
          contract_amount: contractAmount,
          paid_amount: paidAmount,
          start_date: startDate,
          estimated_delivery_date: estimatedDeliveryDate,
          status
        })
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess(data.message || (isEdit ? 'Project updated.' : 'Project created.'));
        onClose();
      } else {
        setFormError(data.message || 'Failed to save project.');
      }
    } catch (err) {
      setFormError('Server error saving project record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 color="#00B4D8" size={22} />
          {initialProject ? `Edit Software Project #${initialProject.project_code || initialProject.id}` : 'Create New Software Project'}
        </h3>

        {loadingClients ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>Loading client options...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* CLIENT SELECTOR */}
            <div className="form-group">
              <label className="form-label">Corporate Client *</label>
              <select
                required
                disabled={!!initialProject}
                className="form-input"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
              >
                <option value="">-- Select Corporate Client Account --</option>
                {clientOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.full_name} ({c.company_name || 'Individual'})</option>
                ))}
              </select>
            </div>

            {/* PROJECT TITLE & CATEGORY */}
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Custom ERP & Inventory System Development"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Service Category</label>
                <select className="form-input" value={serviceCategory} onChange={e => setServiceCategory(e.target.value)}>
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Project Status</label>
                <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(st => (
                    <option key={st.value} value={st.value}>{st.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FINANCIAL CONTRACT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Contract Amount (৳) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={contractAmount}
                  onChange={e => setContractAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paid Amount (৳)</label>
                <input
                  type="number"
                  readOnly={!!initialProject} // Paid amount is maintained by payment records in edit mode
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

            {/* DATES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Delivery Date</label>
                <input type="date" className="form-input" value={estimatedDeliveryDate} onChange={e => setEstimatedDeliveryDate(e.target.value)} />
              </div>
            </div>

            {formError && <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '12px' }}>{formError}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}
            >
              {submitting ? 'Saving Software Project...' : (initialProject ? 'Update Software Project' : 'Create Software Project')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
