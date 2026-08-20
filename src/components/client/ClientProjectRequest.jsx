import React, { useState } from 'react';
import {
  PlusCircle, Send, CheckCircle2, AlertCircle, Sparkles, Building2, Calendar, DollarSign
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientProjectRequest({ onSelectSubPage }) {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState('Custom Web Application');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('50,000 - 100,000 BDT');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Normal');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const projectTypes = [
    'Custom Web Application',
    'Enterprise ERP / CRM Solution',
    'E-commerce & Multi-vendor Marketplace',
    'Mobile Application (iOS / Android)',
    'Corporate Portal & Website',
    'AI & Automation Integration',
    'POS & Inventory Management',
    'Custom API & Cloud Infrastructure'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setError('Please provide a project title.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await adminFetch('/api/client/projects', {
        method: 'POST',
        body: JSON.stringify({
          project_title: projectTitle.trim(),
          project_type: projectType,
          description: description.trim(),
          requirements: requirements.trim(),
          budget,
          deadline,
          priority
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to submit project request.');
      }
    } catch (err) {
      setError('Network error submitting project request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        background: '#0B1120',
        borderRadius: '14px',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '48px 24px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '20px auto'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: '#10B981'
        }}>
          <CheckCircle2 size={36} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          Project Request Submitted!
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>
          Thank you. Your commercial project specifications for <strong>"{projectTitle}"</strong> have been securely recorded. Our Lead Solutions Architect will review the requirements and contact you within 24 business hours with an initial estimation and SRS draft.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => onSelectSubPage('projects')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            View My Projects
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setProjectTitle('');
              setDescription('');
              setRequirements('');
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      
      {/* HEADER */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle size={24} color="#FF6B00" /> Request New Software Project / Solution
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          Submit commercial software specifications, custom application scopes, and budget expectations.
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} /> {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{
        background: '#0B1120',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Project Title *</label>
          <input
            type="text"
            required
            value={projectTitle}
            onChange={e => setProjectTitle(e.target.value)}
            placeholder="e.g. Enterprise Supply Chain Management ERP"
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Solution Type</label>
            <select
              value={projectType}
              onChange={e => setProjectType(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: '#070A12', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
            >
              {projectTypes.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Target Budget Range</label>
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: '#070A12', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
            >
              <option value="30,000 - 50,000 BDT">30,000 - 50,000 BDT</option>
              <option value="50,000 - 100,000 BDT">50,000 - 100,000 BDT</option>
              <option value="100,000 - 250,000 BDT">100,000 - 250,000 BDT</option>
              <option value="250,000 - 500,000 BDT">250,000 - 500,000 BDT</option>
              <option value="500,000+ BDT (Enterprise)">500,000+ BDT (Enterprise)</option>
              <option value="Negotiable / Need Estimation">Negotiable / Need Estimation</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Expected Delivery Timeline</label>
            <input
              type="text"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              placeholder="e.g. Within 2 Months"
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Project Urgency / Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: '#070A12', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem' }}
            >
              <option value="Normal">Normal Priority</option>
              <option value="High">High / Accelerated Delivery</option>
              <option value="Critical">Critical Enterprise Timeline</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Project Overview & Business Objectives *</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the core goals, target audience, and business workflow for this solution..."
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Key Functional Requirements / Features</label>
          <textarea
            rows={4}
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            placeholder="List specific modules (e.g. User authentication, payment gateway, multi-tier permissions, automated invoices)..."
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.88rem', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#FF6B00',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}
        >
          <Send size={16} />
          <span>{submitting ? 'Submitting Specifications...' : 'Submit Project Request'}</span>
        </button>
      </form>

    </div>
  );
}
