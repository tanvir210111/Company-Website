import React, { useState, useEffect } from 'react';
import {
  FileText, Image, Globe, CheckCircle2, AlertCircle,
  Bold, Italic, List, ListOrdered, Link, Heading1, Heading2, Heading3, Quote, Code
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

export default function PageEditorModal({ isOpen, onClose, initialPage, onSaveSuccess }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Media Scope IT Admin');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialPage) {
      setTitle(initialPage.title || '');
      setSlug(initialPage.slug || '');
      setAuthor(initialPage.author || 'Media Scope IT Admin');
      setFeaturedImage(initialPage.featured_image || '');
      setContent(initialPage.content || '');
      setSeoTitle(initialPage.seo_title || initialPage.title || '');
      setSeoDesc(initialPage.seo_description || '');
      setIsActive(!!initialPage.is_active);
    } else {
      setTitle('');
      setSlug('');
      setAuthor('Media Scope IT Admin');
      setFeaturedImage('');
      setContent('');
      setSeoTitle('');
      setSeoDesc('');
      setIsActive(true);
    }
    setFormError('');
  }, [initialPage, isOpen]);

  if (!isOpen) return null;

  const applyFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('page-content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Sample Text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !content.trim()) {
      setFormError('Page title and content body are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const endpoint = initialPage ? `${backendUrl}/api/admin/pages/${initialPage.id}` : `${backendUrl}/api/admin/pages`;
      const method = initialPage ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          slug,
          author,
          featured_image: featuredImage,
          content,
          seo_title: seoTitle || title,
          seo_description: seoDesc,
          is_active: isActive ? 1 : 0
        })
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess(data.message || (initialPage ? 'Page updated successfully.' : 'Page created successfully.'));
        onClose();
      } else {
        setFormError(data.message || 'Failed to save custom page.');
      }
    } catch (err) {
      setFormError('Server error saving custom page.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '840px', maxHeight: '92vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText color="#00B4D8" size={22} />
          {initialPage ? `WordPress Editor: Edit Page #${initialPage.id}` : 'WordPress Editor: Create Custom Page'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* TITLE & SLUG */}
          <div className="form-group">
            <label className="form-label">Page Title *</label>
            <input
              type="text"
              required
              className="form-input"
              style={{ fontSize: '1.1rem', fontWeight: 700, padding: '12px' }}
              placeholder="e.g. About Our Corporate Software Lab"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (!initialPage && !slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-input"
                placeholder="about-our-corporate-software-lab"
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author / Department</label>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Featured Image URL</label>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                style={{
                  background: 'rgba(0, 180, 216, 0.15)',
                  color: '#00B4D8',
                  border: '1px solid rgba(0, 180, 216, 0.3)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Image size={14} /> Select from Media Library
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="https://images.unsplash.com/... or /uploads/..."
              value={featuredImage}
              onChange={e => setFeaturedImage(e.target.value)}
            />
          </div>

          {/* RICH TEXT FORMATTING TOOLBAR */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Full Content Body *</label>
              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>HTML / Markdown Format Supported</span>
            </div>

            <div style={{
              background: '#070A12',
              border: '1px solid var(--border-light)',
              borderBottom: 'none',
              borderRadius: '8px 8px 0 0',
              padding: '6px 10px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center'
            }}>
              <button type="button" onClick={() => applyFormatting('<h2>', '</h2>')} title="Heading 2" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Heading1 size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<h3>', '</h3>')} title="Heading 3" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Heading2 size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<strong>', '</strong>')} title="Bold" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Bold size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<em>', '</em>')} title="Italic" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Italic size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<ul>\n  <li>', '</li>\n</ul>')} title="Unordered List" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><List size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<ol>\n  <li>', '</li>\n</ol>')} title="Ordered List" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><ListOrdered size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<blockquote>', '</blockquote>')} title="Blockquote" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Quote size={14} /></button>
              <button type="button" onClick={() => applyFormatting('<pre><code>', '</code></pre>')} title="Code Block" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Code size={14} /></button>
            </div>

            <textarea
              id="page-content-editor"
              rows={10}
              required
              className="form-input"
              style={{ borderRadius: '0 0 8px 8px', fontFamily: 'monospace', fontSize: '0.88rem' }}
              placeholder="Write custom page content in HTML or Markdown..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {/* SEO FIELDS */}
          <div style={{ background: '#070A12', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00B4D8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> SEO Meta Tags Configuration
            </h4>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">SEO Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Custom Search Engine Title"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SEO Meta Description</label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Meta Description snippet for search engines..."
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
              />
            </div>
          </div>

          {/* PUBLICATION STATUS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#070A12', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>Publication Status:</span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '6px 14px' }}
              value={isActive ? '1' : '0'}
              onChange={e => setIsActive(e.target.value === '1')}
            >
              <option value="1">Published (Visible publicly)</option>
              <option value="0">Draft (Unpublished mode)</option>
            </select>
          </div>

          {formError && (
            <div style={{ color: '#EF4444', fontSize: '0.84rem', marginBottom: '14px' }}>
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontWeight: 800, fontSize: '0.95rem' }}
          >
            {submitting ? 'Saving Custom Page...' : (initialPage ? 'Update Custom Page' : 'Publish Custom Page')}
          </button>
        </form>

        <MediaPickerModal
          isOpen={mediaPickerOpen}
          onClose={() => setMediaPickerOpen(false)}
          onSelectMedia={(url) => setFeaturedImage(url)}
        />
      </div>
    </div>
  );
}
