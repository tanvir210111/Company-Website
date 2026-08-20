import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Send, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { adminFetch } from '../../utils/adminApi';

export default function ClientMessages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New message form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/messages');
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      } else {
        setError(data.message || 'Failed to load conversations.');
      }
    } catch (err) {
      setError('Could not connect to communication service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await adminFetch('/api/client/messages', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject.trim() || 'Client Project Communication',
          message: message.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your message has been dispatched to the dedicated Project Management team.');
        setSubject('');
        setMessage('');
        fetchMessages();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setError('Network error sending message.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#FF6B00' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading Enterprise Messages...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} color="#00B4D8" /> Project Discussions & Support
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Direct communication bridge with assigned Project Managers and Lead Engineers.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* NEW MESSAGE FORM */}
        <form onSubmit={handleSendMessage} style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} color="#FF6B00" /> Message Project Team
          </h2>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Requirement modification for Milestone 2"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.86rem' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, marginBottom: '6px' }}>Message Details *</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your project inquiry or update..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFFFFF', fontSize: '0.86rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#FF6B00',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={15} />
            <span>{submitting ? 'Dispatching...' : 'Send Message'}</span>
          </button>
        </form>

        {/* CONVERSATIONS */}
        <div style={{
          background: '#0B1120',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
            Active Discussions
          </h2>

          {conversations.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.85rem' }}>No discussions opened yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {conversations.map(c => (
                <div
                  key={c.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>
                      {c.subject}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                    {c.last_message || 'Thread active.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
