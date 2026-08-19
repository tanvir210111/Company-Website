import React, { useState, useEffect } from 'react';
import {
  Image, FileText, Upload, Search, Filter, RefreshCw, Trash2, Copy, Check, Eye, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function AdminMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Preview Modal
  const [previewMedia, setPreviewMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      let queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
      if (typeFilter !== 'all') queryParams.append('type', typeFilter);

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
    fetchMedia();
  }, [typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedia();
  };

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
      if (data.success) {
        setActionSuccess(data.message || 'File uploaded successfully.');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchMedia();
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Error uploading file to server.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (item) => {
    const fullUrl = item.public_url.startsWith('http') ? item.public_url : `${window.location.protocol}//${window.location.host}${item.public_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete media file "${item.original_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/media/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message || 'Media file deleted.');
        setTimeout(() => setActionSuccess(null), 4000);
        if (previewMedia?.id === item.id) setPreviewMedia(null);
        fetchMedia();
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Network error deleting media file.');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TITLE & UPLOAD BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            WordPress-Like Media Library
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Upload, manage, and reuse website images, course banners, and corporate documents securely.
          </p>
        </div>

        <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Media'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* NOTIFICATIONS */}
      {actionSuccess && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} /> {actionSuccess}
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search media by filename..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="all">All Media Types</option>
            <option value="image">Images Only</option>
            <option value="document">Documents Only</option>
          </select>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#00B4D8',
              color: '#070A12',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* MEDIA GRID */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#00B4D8' }} />
            <p>Loading Media Library...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: '#EF4444', textAlign: 'center' }}>
            <p>{error}</p>
          </div>
        ) : mediaList.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Image size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p style={{ fontWeight: 600 }}>No media files uploaded yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {mediaList.map((item, idx) => {
              const isImg = item.mime_type?.startsWith('image/');
              return (
                <div
                  key={item.id || idx}
                  style={{
                    background: '#070A12',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div
                    onClick={() => setPreviewMedia(item)}
                    style={{ position: 'relative', height: '140px', background: '#0F172A', cursor: 'pointer', overflow: 'hidden' }}
                  >
                    {isImg ? (
                      <img
                        src={item.public_url}
                        alt={item.original_name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                        <FileText size={36} color="#00B4D8" />
                        <span style={{ fontSize: '0.72rem', marginTop: '6px', fontWeight: 600 }}>DOCUMENT</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{
                      fontWeight: 700,
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.original_name}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{formatBytes(item.file_size)}</span>
                      <span>{item.mime_type?.split('/')[1]?.toUpperCase()}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <button
                        onClick={() => handleCopyUrl(item)}
                        style={{
                          background: copiedId === item.id ? 'rgba(16, 185, 129, 0.2)' : '#0F172A',
                          color: copiedId === item.id ? '#10B981' : '#00B4D8',
                          border: '1px solid var(--border-light)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === item.id ? 'Copied' : 'Copy URL'}
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        title="Delete Media File"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MEDIA PREVIEW MODAL */}
      {previewMedia && (
        <div className="modal-overlay" onClick={() => setPreviewMedia(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setPreviewMedia(null)}>✕</button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Media Details: {previewMedia.original_name}
            </h3>

            {previewMedia.mime_type?.startsWith('image/') ? (
              <div style={{ width: '100%', maxHeight: '300px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid var(--border-light)' }}>
                <img src={previewMedia.public_url} alt={previewMedia.original_name} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#070A12' }} />
              </div>
            ) : (
              <div style={{ padding: '30px', background: '#070A12', borderRadius: '12px', textAlign: 'center', marginBottom: '16px' }}>
                <FileText size={48} color="#00B4D8" style={{ margin: '0 auto 10px auto' }} />
                <p style={{ color: '#FFFFFF', fontWeight: 700 }}>{previewMedia.original_name}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.84rem', color: '#CBD5E1', marginBottom: '16px' }}>
              <div><strong>File Name:</strong> {previewMedia.file_name}</div>
              <div><strong>MIME Type:</strong> {previewMedia.mime_type}</div>
              <div><strong>File Size:</strong> {formatBytes(previewMedia.file_size)}</div>
              <div><strong>Uploaded By:</strong> {previewMedia.uploaded_by || 'Admin'}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Public Image / File URL</label>
              <input type="text" readOnly className="form-input" value={previewMedia.public_url} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => handleCopyUrl(previewMedia)} className="btn-primary" style={{ flex: 1, padding: '10px', fontWeight: 700 }}>
                Copy URL to Clipboard
              </button>
              <button onClick={() => handleDelete(previewMedia)} style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 700, cursor: 'pointer' }}>
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
