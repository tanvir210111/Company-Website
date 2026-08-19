import React, { useState, useEffect } from 'react';
import {
  Settings, Save, Globe, PhoneCall, Layout, Share2, Search, CheckCircle2, RefreshCw, AlertCircle, Building2
} from 'lucide-react';

export default function AdminSiteSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Settings State Map
  const [settings, setSettings] = useState({
    site_name: 'Media Scope IT Ltd',
    site_tagline: 'IT & Software Institute Bangladesh',
    contact_email: 'info@mediascopeit.com',
    contact_phone: '+88 01325-165451',
    office_address: 'House-05, Flat B-3, Road-03, Sector-15F, Uttara, Dhaka, Bangladesh',
    rjsc_reg_no: 'C-166968/2020',
    trade_license_no: 'TRAD/DSCC/048330/2020',
    tin_no: '125190932932',
    dbid_no: 'DBID-2020-MSIT',
    hero_title: 'Transform Your Career with Industry-Grade IT & Software Engineering Skills',
    hero_subtitle: 'Empowering students & businesses with cutting-edge software development, graphic design, digital marketing, and enterprise IT solutions.',
    hero_cta_primary_text: 'Explore Courses',
    hero_cta_secondary_text: 'Get Software Proposal',
    facebook_url: 'https://facebook.com/mediascopeit',
    linkedin_url: 'https://linkedin.com/company/mediascopeit',
    youtube_url: 'https://youtube.com/c/mediascopeit',
    instagram_url: 'https://instagram.com/mediascopeit',
    footer_copyright: '© 2026 Media Scope IT Ltd. All rights reserved.',
    meta_title: 'Media Scope IT Ltd — IT Training & Software Engineering Firm',
    meta_description: 'Media Scope IT Ltd is a premier IT training institute and custom software development agency in Dhaka, Bangladesh.',
    meta_keywords: 'IT Training Bangladesh, Software Development Company Dhaka, React Course, Full Stack Web Development'
  });

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/site-settings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.log('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const res = await fetch(`${backendUrl}/api/admin/site-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Global site settings updated successfully.');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.message || 'Failed to update site settings.');
      }
    } catch (err) {
      setErrorMsg('Server error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER TITLE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Website & Global Settings CMS
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginTop: '4px' }}>
            Manage homepage content, contact information, social links, and legal registration numbers without code.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}
        >
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* NOTIFICATIONS */}
      {successMsg && (
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
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* MAIN SETTINGS CONTAINER */}
      <div style={{ background: '#0B1120', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* TABS */}
        <div style={{ display: 'flex', background: '#070A12', borderBottom: '1px solid var(--border-light)', overflowX: 'auto' }}>
          {[
            { id: 'general', label: 'Company & Contact Info', icon: Building2 },
            { id: 'hero', label: 'Homepage Hero Banner', icon: Layout },
            { id: 'social', label: 'Social & Footer', icon: Share2 },
            { id: 'seo', label: 'SEO & Search Metadata', icon: Search }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 20px',
                  border: 'none',
                  background: isActive ? '#0B1120' : 'transparent',
                  color: isActive ? '#00B4D8' : '#94A3B8',
                  borderBottom: isActive ? '2px solid #00B4D8' : '2px solid transparent',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <TabIcon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          
          {/* 1. GENERAL & CONTACT INFO TAB */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Company Official Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={settings.site_name || ''}
                    onChange={e => handleChange('site_name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Site Tagline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.site_tagline || ''}
                    onChange={e => handleChange('site_tagline', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Hotline / Contact Phone *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={settings.contact_phone || ''}
                    onChange={e => handleChange('contact_phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={settings.contact_email || ''}
                    onChange={e => handleChange('contact_email', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Registered Office Address *</label>
                <textarea
                  rows={2}
                  required
                  className="form-input"
                  value={settings.office_address || ''}
                  onChange={e => handleChange('office_address', e.target.value)}
                />
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#00B4D8', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                Government & RJSC Legal Registration Numbers
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">RJSC Registration No</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.rjsc_reg_no || ''}
                    onChange={e => handleChange('rjsc_reg_no', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Trade License No</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.trade_license_no || ''}
                    onChange={e => handleChange('trade_license_no', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">TIN Certificate No</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.tin_no || ''}
                    onChange={e => handleChange('tin_no', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">DBID Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.dbid_no || ''}
                    onChange={e => handleChange('dbid_no', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. HOMEPAGE HERO BANNER TAB */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Homepage Hero Main Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={settings.hero_title || ''}
                  onChange={e => handleChange('hero_title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Homepage Hero Subtitle / Description *</label>
                <textarea
                  rows={3}
                  required
                  className="form-input"
                  value={settings.hero_subtitle || ''}
                  onChange={e => handleChange('hero_subtitle', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Primary CTA Button Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.hero_cta_primary_text || ''}
                    onChange={e => handleChange('hero_cta_primary_text', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.hero_cta_secondary_text || ''}
                    onChange={e => handleChange('hero_cta_secondary_text', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. SOCIAL & FOOTER TAB */}
          {activeTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Facebook Page URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://facebook.com/..."
                    value={settings.facebook_url || ''}
                    onChange={e => handleChange('facebook_url', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn Page URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/company/..."
                    value={settings.linkedin_url || ''}
                    onChange={e => handleChange('linkedin_url', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">YouTube Channel URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://youtube.com/..."
                    value={settings.youtube_url || ''}
                    onChange={e => handleChange('youtube_url', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instagram Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://instagram.com/..."
                    value={settings.instagram_url || ''}
                    onChange={e => handleChange('instagram_url', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Footer Copyright Notice</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.footer_copyright || ''}
                  onChange={e => handleChange('footer_copyright', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 4. SEO METADATA TAB */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Default SEO Title Tag</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.meta_title || ''}
                  onChange={e => handleChange('meta_title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Description (150-160 characters)</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={settings.meta_description || ''}
                  onChange={e => handleChange('meta_description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Keywords (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.meta_keywords || ''}
                  onChange={e => handleChange('meta_keywords', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* SAVE BUTTON AT BOTTOM OF FORM */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving Changes...' : 'Save All Settings'}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
