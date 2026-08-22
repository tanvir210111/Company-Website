import React, { useState } from 'react';
import { ArrowLeft, Shield, Cpu, TrendingUp, HeartPulse, Building, Users, Home, Palmtree, Briefcase, Award, CheckCircle2, FileText, Lock, RefreshCw, Star, Calculator, Sparkles } from 'lucide-react';
import { CLIENT_LOGOS } from '../data/testimonialsData';

const iconMap = {
  Shield: Shield,
  Cpu: Cpu,
  TrendingUp: TrendingUp,
  HeartPulse: HeartPulse,
  Building: Building,
  Users: Users,
  Home: Home,
  Palmtree: Palmtree
};

const DETAILED_CASE_STUDIES = [
  {
    id: 1,
    client: "Bangladesh Air Force",
    sector: "Government & Defense",
    project: "Specialized IT Skill Bootcamps & Secure Record Management",
    results: "Trained 300+ personnel in advanced cybersecurity protocols, network administration, and custom software maintenance.",
    techStack: ["Python Django", "Linux Docker", "PostgreSQL"],
    icon: Shield
  },
  {
    id: 2,
    client: "ICT Division Bangladesh",
    sector: "Government & Education",
    project: "National Youth Skill Development & Freelancing Bootcamps",
    results: "Conducted regional training programs across Dhaka & Chittagong resulting in 85% student freelancing success.",
    techStack: ["ReactJS", "Digital Marketing", "Figma"],
    icon: Cpu
  },
  {
    id: 3,
    client: "Dhaka Stock Exchange (DSE)",
    sector: "Financial & Banking",
    project: "Data Analytics Software & Staff Technical Workshop",
    results: "Custom data parsing module for financial record audit with 99.99% transaction data processing accuracy.",
    techStack: ["ASP.NET Core", "C#", "SQL Server"],
    icon: TrendingUp
  },
  {
    id: 4,
    client: "Popular Diagnostic Center",
    sector: "Healthcare",
    project: "Diagnostic Patient Billing & Lab Test Management Portal",
    results: "Centralized multi-branch patient test billing and automated SMS report delivery system used by 50,000+ patients monthly.",
    techStack: ["Laravel REST API", "ReactJS", "SMS Gateway"],
    icon: HeartPulse
  },
  {
    id: 5,
    client: "Walton Hi-Tech PLC",
    sector: "Corporate Enterprise",
    project: "Custom Web Application & Staff Growth Masterclass",
    results: "High-concurrency web application for promotional campaign tracking and staff digital marketing training.",
    techStack: ["Node.js", "MongoDB", "Facebook Meta Ads"],
    icon: Building
  },
  {
    id: 6,
    client: "Meena Bazar & Super Shops",
    sector: "Retail & E-Commerce",
    project: "Multi-Branch Barcode POS & Inventory Control System",
    results: "Real-time stock sync, thermal receipt printing, and automated low-stock alert system for 15+ retail outlets.",
    techStack: ["Electron POS", "Node.js", "Thermal Printer API"],
    icon: Home
  }
];

export default function OurClientsPage({ onNavigate, onOpenQuote }) {
  const [selectedSector, setSelectedSector] = useState("All");
  
  // Interactive ROI Calculator State
  const [softwareType, setSoftwareType] = useState("POS & Inventory Software");
  const [branchCount, setBranchCount] = useState(3);

  const calculateEstimate = () => {
    let base = 25000;
    if (softwareType === "CRM & Sales Software") base = 35000;
    if (softwareType === "Payroll & HR Management") base = 40000;
    if (softwareType === "Diagnostic Center System") base = 45000;
    return base + (branchCount * 8000);
  };

  const filteredStudies = selectedSector === "All"
    ? DETAILED_CASE_STUDIES
    : DETAILED_CASE_STUDIES.filter(cs => cs.sector.includes(selectedSector));

  return (
    <div style={{ background: '#070A12', color: 'white', minHeight: '100vh', padding: '50px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => onNavigate('home')} 
          className="btn-outline" 
          style={{ marginBottom: '30px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </button>

        {/* Page Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          padding: '40px 24px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#FF6B00" /> Enterprise Trust & Portfolio
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', lineHeight: 1.2 }}>
            Our Corporate Clients & Case Studies
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '850px', lineHeight: 1.6 }}>
            Over 500+ government bodies, corporate conglomerates, financial institutions, and retail brands rely on Media Scope IT Ltd for software solutions and IT training.
          </p>
        </div>

        {/* Sector Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {["All", "Government", "Financial", "Healthcare", "Retail"].map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`tab-btn ${selectedSector === sec ? 'active' : ''}`}
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              {sec} Projects
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '28px', marginBottom: '60px' }}>
          {filteredStudies.map(study => {
            const IconComponent = study.icon;
            return (
              <div key={study.id} style={{
                background: '#0F172A',
                borderRadius: '22px',
                padding: '30px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'rgba(0, 180, 216, 0.15)',
                      border: '1px solid #00B4D8',
                      color: '#00B4D8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComponent size={28} />
                    </div>

                    <span style={{
                      background: 'rgba(255, 107, 0, 0.15)',
                      color: '#FF6B00',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {study.sector}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
                    {study.client}
                  </h3>

                  <div style={{ fontSize: '0.92rem', color: '#00B4D8', fontWeight: 700, marginBottom: '14px' }}>
                    {study.project}
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.65, marginBottom: '20px' }}>
                    <strong>Delivered Impact:</strong> {study.results}
                  </p>

                  {/* Tech Stack Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {study.techStack.map((tech, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#E2E8F0',
                        fontSize: '0.74rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: '18px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>
                  <Award size={16} /> Verified Corporate SLA & Success
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Enterprise Cost Estimator Calculator */}
        <div style={{ background: '#0F172A', padding: '32px 20px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Calculator size={34} color="#00B4D8" style={{ marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800 }}>Instant Software Cost & Proposal Estimator</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.94rem' }}>Select your expected software type and branch size to calculate an estimated deployment investment.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '28px', alignItems: 'center', background: '#070A12', padding: '24px 18px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
            <div>
              <div className="form-group">
                <label className="form-label">Software Product Type *</label>
                <select 
                  className="form-select"
                  value={softwareType}
                  onChange={e => setSoftwareType(e.target.value)}
                >
                  <option value="POS & Inventory Software">POS & Multi-Branch Inventory Software</option>
                  <option value="CRM & Sales Software">CRM & Customer Support Software</option>
                  <option value="Payroll & HR Management">Payroll & Biometric HR Management</option>
                  <option value="Diagnostic Center System">Diagnostic Center & Lab Billing System</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Branches / Outlets: ({branchCount})</label>
                <input 
                  type="range" 
                  min="1" 
                  max="20"
                  value={branchCount}
                  onChange={e => setBranchCount(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#00B4D8' }}
                />
              </div>
            </div>

            <div style={{ background: '#0F172A', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '4px' }}>Estimated Deployment Investment</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00B4D8', marginBottom: '8px' }}>
                BDT {calculateEstimate().toLocaleString()} ৳
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600, marginBottom: '18px' }}>
                ✓ Includes Free Installation & 1 Year SLA Support
              </div>
              <button onClick={() => onOpenQuote()} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Request Formal Written Quotation
              </button>
            </div>
          </div>
        </div>

        {/* Corporate Client Badges Directory */}
        <div style={{
          background: '#0F172A',
          padding: '44px 36px',
          borderRadius: '24px',
          border: '1px solid var(--border-light)',
          marginBottom: '60px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
            Trusted Corporate Directory
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '32px' }}>
            We build long-term technology partnerships based on security, confidentiality, and reliability.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {CLIENT_LOGOS.map((client, idx) => {
              const IconComponent = iconMap[client.icon] || Building;
              return (
                <div key={idx} style={{
                  background: '#070A12',
                  padding: '18px 14px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  color: '#E2E8F0',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justify: 'center'
                }}>
                  <IconComponent size={20} color="#00B4D8" />
                  <span>{client.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* How We Deliver Corporate Projects (5-Step Process) */}
        <div style={{ background: '#0B1120', padding: '44px 36px', borderRadius: '24px', border: '1px solid var(--border-light)', marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ color: '#00B4D8', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Lifecycle</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>Our Software Engineering & SLA Workflow</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: '#FF6B00', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>01. Discovery</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>In-depth requirement analysis and business logic mapping.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: '#00B4D8', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>02. Architecture</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Database schema design and high-availability cloud architecture.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: '#FFB703', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>03. Agile Dev</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Sprint-based clean code development with regular client demos.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>04. UAT & Audit</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>User acceptance testing, load testing, and security vulnerability audit.</p>
            </div>

            <div style={{ background: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
              <div style={{ color: '#00B4D8', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>05. 24/7 SLA</div>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Production deployment with 24/7 technical hotline support.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '50px 30px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.8rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>Request Custom Enterprise Quotation</h3>
          <p style={{ color: '#94A3B8', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>Talk to our software engineering team and get a customized project proposal.</p>
          <button onClick={() => onOpenQuote()} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            <Briefcase size={20} /> Request Corporate Quotation / Demo
          </button>
        </div>
      </div>
    </div>
  );
}
