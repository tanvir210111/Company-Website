import { useState, useEffect } from 'react';

const defaultSettings = {
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
};

export function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const res = await fetch(`${backendUrl}/api/public/site-settings`);
        const data = await res.json();
        if (isMounted && data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.log('Using default site settings:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
}
