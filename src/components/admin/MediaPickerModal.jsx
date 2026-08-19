import React, { useState, useEffect } from 'react';
import {
  Image, FileText, Search, Upload, CheckCircle2, RefreshCw, Copy, Check
} from 'lucide-react';

export default function MediaPickerModal({ isOpen, onClose, onSelectMedia }) {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());

      const res = await fetch(`${backendUrl}/api/admin/media?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      } else {
        setError(data.message || 'Failed to retrieve media library.');
      }
    } catch (err) {
      setError('Error connecting to media server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/media`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.media) {
        fetchMedia();
        setSelectedItem(data.media);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Error uploading media file.');
    } finally {
      setUploading(false);
    }
  };

  const handleChoose = () => {
    if (!selectedItem) return;
    onSelectMedia(selectedItem.public_url);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '840px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image color="#00B4D8" size={22} /> WordPress Media Picker
        </h3>

        {/* TOP CONTROLS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search media by filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchMedia()}
              style={{
                width: '100%',
                background: '#070A12',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 700 }}>
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload New File'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {error && (
          <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '12px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
            {error}
          </div>
        )}

        {/* MEDIA THUMBNAIL GRID */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: '280px', maxHeight: '420px', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '14px', background: '#070A12' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px auto', color: '#00B4D8' }} />
              <p>Loading Media Library...</p>
            </div>
          ) : mediaList.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
              <Image size={32} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <p>No media files found in library.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {mediaList.map(item => {
                const isSelected = selectedItem?.id === item.id;
                const isImg = item.mime_type?.startsWith('image/');
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: isSelected ? '3px solid #00B4D8' : '1px solid var(--border-light)',
                      background: '#0F172A',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 12px rgba(0, 180, 216, 0.4)' : 'none'
                    }}
                  >
                    {isImg ? (
                      <img
                        src={item.public_url}
                        alt={item.original_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', padding: '8px', textAlign: 'center' }}>
                        <FileText size={24} color="#00B4D8" />
                        <span style={{ fontSize: '0.68rem', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', whiteSpace: 'nowrap' }}>
                          {item.original_name}
                        </span>
                      </div>
                    )}
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#00B4D8', color: '#070A12', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
            {selectedItem ? `Selected: ${selectedItem.original_name}` : 'Click an item above to select'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', background: '#0F172A', color: '#94A3B8', border: '1px solid var(--border-light)', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>

            <button
              onClick={handleChoose}
              disabled={!selectedItem}
              className="btn-primary"
              style={{ padding: '8px 20px', borderRadius: '8px', fontWeight: 800, opacity: selectedItem ? 1 : 0.5 }}
            >
              Use Selected Media
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
