import React, { useState, useEffect } from 'react';
import {
  FileText, Image, Tag, Globe, Sparkles, CheckCircle2, AlertCircle,
  Bold, Italic, List, ListOrdered, Link, Heading1, Heading2, Quote, Code
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

const CATEGORY_OPTIONS = ['Career Guidance', 'Bootcamp', 'Tech Comparison', 'Software Engineering', 'Digital Marketing', 'Others'];

export default function BlogEditorModal({ isOpen, onClose, initialPost, onSaveSuccess }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Media Scope IT Editorial');
  const [category, setCategory] = useState('Career Guidance');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setSlug(initialPost.slug || '');
      setAuthor(initialPost.author || 'Media Scope IT Editorial');
      setCategory(initialPost.category || 'Career Guidance');
      setTags(initialPost.tags || '');
      setFeaturedImage(initialPost.featured_image || initialPost.image || '');
      setExcerpt(initialPost.excerpt || '');
      setContent(initialPost.content || '');
      setSeoTitle(initialPost.seo_title || initialPost.title || '');
      setSeoDesc(initialPost.seo_description || initialPost.excerpt || '');
      setIsActive(!!initialPost.is_active);
    } else {
      setTitle('');
      setSlug('');
      setAuthor('Media Scope IT Editorial');
      setCategory('Career Guidance');
      setTags('');
      setFeaturedImage('');
      setExcerpt('');
      setContent('');
      setSeoTitle('');
      setSeoDesc('');
      setIsActive(true);
    }
    setFormError('');
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

  // Insert Rich Text Formatting Toolbar Helper
  const applyFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('blog-content-editor');
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

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setFormError('Post title, short excerpt, and full content are required.');
      return;
    }

    setSubmitting(true);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const endpoint = initialPost ? `${backendUrl}/api/admin/blog/${initialPost.id}` : `${backendUrl}/api/admin/blog`;
      const method = initialPost ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          slug,
          author,
          category,
          tags,
          featured_image: featuredImage,
          excerpt,
          content,
          seo_title: seoTitle || title,
          seo_description: seoDesc || excerpt,
          is_active: isActive ? 1 : 0
        })
      });

      const data = await res.json();
      if (data.success) {
        onSaveSuccess(data.message || (initialPost ? 'Post updated successfully.' : 'Post created successfully.'));
        onClose();
      } else {
        setFormError(data.message || 'Failed to save blog post.');
      }
    } catch (err) {
      setFormError('Server error saving blog post.');
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
          {initialPost ? `WordPress Editor: Edit Post #${initialPost.id}` : 'WordPress Editor: Write New Article'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* TITLE & SLUG */}
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              required
              className="form-input"
              style={{ fontSize: '1.1rem', fontWeight: 700, padding: '12px' }}
              placeholder="e.g. Python Coding Roadmap for Software Engineering in 2026"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (!initialPost && !slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">URL Slug</label>
              <input
                type="text"
                className="form-input"
                placeholder="python-coding-roadmap-2026"
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-input"
                value={author}
                onChange={e => setAuthor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="python, career, software engineering"
                value={tags}
                onChange={e => setTags(e.target.value)}
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

          <div className="form-group">
            <label className="form-label">Short Summary / Excerpt *</label>
            <textarea
              rows={2}
              required
              className="form-input"
              placeholder="Brief introduction displayed on blog cards..."
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
            />
          </div>

          {/* RICH TEXT FORMATTING TOOLBAR */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Full Content Body *</label>
              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Markdown & HTML Formatted</span>
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
              <button type="button" onClick={() => applyFormatting('### ')} title="Heading 1" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Heading1 size={14} /></button>
              <button type="button" onClick={() => applyFormatting('#### ')} title="Heading 2" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Heading2 size={14} /></button>
              <button type="button" onClick={() => applyFormatting('**', '**')} title="Bold" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Bold size={14} /></button>
              <button type="button" onClick={() => applyFormatting('*', '*')} title="Italic" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Italic size={14} /></button>
              <button type="button" onClick={() => applyFormatting('- ')} title="Bullet List" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><List size={14} /></button>
              <button type="button" onClick={() => applyFormatting('1. ')} title="Numbered List" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><ListOrdered size={14} /></button>
              <button type="button" onClick={() => applyFormatting('> ')} title="Blockquote" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Quote size={14} /></button>
              <button type="button" onClick={() => applyFormatting('`', '`')} title="Code" style={{ background: '#0B1120', border: '1px solid #1E293B', color: '#CBD5E1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Code size={14} /></button>
            </div>

            <textarea
              id="blog-content-editor"
              rows={9}
              required
              className="form-input"
              style={{ borderRadius: '0 0 8px 8px', fontFamily: 'monospace', fontSize: '0.88rem' }}
              placeholder="Write article body in Markdown or HTML..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          {/* SEO FIELDS */}
          <div style={{ background: '#070A12', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#00B4D8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={16} /> SEO & Meta Tags Configuration
            </h4>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label className="form-label">SEO Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Custom Search Engine Title Tag"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SEO Meta Description</label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Google Meta Description snippet..."
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
              <option value="1">Published (Visible on site)</option>
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
            {submitting ? 'Saving Post...' : (initialPost ? 'Update Post' : 'Publish Article')}
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
