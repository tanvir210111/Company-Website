import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Clock, RefreshCw, CheckCheck } from 'lucide-react';

export default function AdminConversationModal({ isOpen, onClose, conversationId, onReplySuccess }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchConversationDetails = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/messages/${conversationId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
        
        // Mark as read
        fetch(`${backendUrl}/api/admin/messages/${conversationId}/read`, {
          method: 'PATCH',
          credentials: 'include'
        });
      }
    } catch (err) {
      console.log('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchConversationDetails();
    }
  }, [isOpen, conversationId]);

  if (!isOpen || !conversationId) return null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/messages/${conversationId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: replyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        fetchConversationDetails();
        if (onReplySuccess) onReplySuccess();
      } else {
        alert(data.message || 'Failed to post reply.');
      }
    } catch (err) {
      alert('Error posting reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MessageSquare color="#00B4D8" size={22} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {conversation?.subject || 'Message Thread'}
            </h3>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Participant: <strong style={{ color: '#FFFFFF' }}>{conversation?.recipient_name}</strong> ({conversation?.recipient_email}) • Role: <span style={{ color: '#00B4D8', textTransform: 'capitalize' }}>{conversation?.recipient_role}</span>
          </div>
        </div>

        {/* MESSAGES THREAD (SCROLLABLE) */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px', marginBottom: '14px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px auto', color: '#00B4D8' }} />
              <p>Loading conversation messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
              No messages in this conversation.
            </div>
          ) : (
            messages.map(m => {
              const isAdminSender = m.sender_name?.includes('Admin') || m.sender_id === conversation?.created_by;
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isAdminSender ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    background: isAdminSender ? '#0F2942' : '#070A12',
                    border: `1px solid ${isAdminSender ? 'rgba(0, 180, 216, 0.3)' : 'var(--border-light)'}`,
                    borderRadius: '12px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ fontSize: '0.74rem', color: isAdminSender ? '#00B4D8' : '#94A3B8', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span>{m.sender_name || (isAdminSender ? 'Admin' : conversation?.recipient_name)}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 400 }}>
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#FFFFFF', lineHeight: '1.45', whitespace: 'pre-wrap' }}>
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* REPLY BOX */}
        <form onSubmit={handleSendReply} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            required
            placeholder="Write an official response/reply message..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            style={{
              flex: 1,
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={submittingReply || !replyText.trim()}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={16} /> Send Reply
          </button>
        </form>

      </div>
    </div>
  );
}
