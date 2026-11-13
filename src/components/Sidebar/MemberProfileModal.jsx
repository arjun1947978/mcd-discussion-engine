import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  Clock,
  Copy,
  Check,
  UserPlus,
  ExternalLink,
  Users,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { getMemberDepartmentAffiliations } from '../../data/roomMembers';

const hash = (s = '') =>
  Array.from(String(s)).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 0 && (window.innerWidth <= 1024 || window.innerHeight <= 560));

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};

/**
 * Smart Algorithmic Color Generator:
 * Generates an individualized, vibrant, balanced color palette dynamically
 * from any string (Group name or Query ID). Never hardcoded.
 */
export const getSmartColor = (text = '') => {
  let hashVal = 0;
  for (let i = 0; i < text.length; i++) {
    hashVal = (hashVal * 31 + text.charCodeAt(i)) >>> 0;
  }
  const hue = hashVal % 360;
  return {
    hue,
    accent: `hsl(${hue}, 82%, 48%)`,
    barColor: `hsl(${hue}, 85%, 52%)`,
    bgLight: `hsl(${hue}, 65%, 97%)`,
    bgDark: `hsl(${hue}, 35%, 15%)`,
    borderLight: `hsl(${hue}, 60%, 82%)`,
    borderDark: `hsl(${hue}, 40%, 28%)`,
    badgeBgLight: `hsl(${hue}, 75%, 90%)`,
    badgeBgDark: `hsl(${hue}, 50%, 22%)`,
    badgeTextLight: `hsl(${hue}, 85%, 26%)`,
    badgeTextDark: `hsl(${hue}, 80%, 75%)`
  };
};

/**
 * Resolves Groups and Active/Inactive queries for any member
 */
const getMemberAffiliations = (member, deptName) => {
  const h = hash(member.name);
  const dept = member.department || deptName || 'Enterprise';

  // 1. Fetch real department affiliations across all enterprise departments
  const realDeptAffils = getMemberDepartmentAffiliations(member.name);
  let groups = [];

  if (realDeptAffils && realDeptAffils.length > 0) {
    groups = realDeptAffils.map((aff) => ({
      id: `grp-${aff.deptKey}`,
      name: `${aff.departmentName} Group`,
      category: 'Department Team',
      role: aff.role,
      status: 'Active Member'
    }));
  } else {
    const taskforces = [
      'Plant Emergency Response Team',
      'MCD Innovation & Automation Council',
      'ISO-9001 Quality Audit Taskforce',
      'Supply Chain Dispatch Steering Comm.',
      'Tooling Calibration Steering Group',
      'Health & Workplace Safety Committee'
    ];
    const secondGroup = taskforces[h % taskforces.length];

    groups = [
      {
        id: `grp-1-${member.id}`,
        name: `${dept} Group`,
        category: 'Primary Department',
        role: member.role || 'Member',
        status: 'Active Group'
      },
      {
        id: `grp-2-${member.id}`,
        name: secondGroup,
        category: 'Cross-Functional Taskforce',
        role: (h % 3 === 0) ? 'Group Lead' : 'Active Contributor',
        status: 'Standing Committee'
      }
    ];
  }

  const nameLower = (member.name || '').toLowerCase();
  let queries = [];

  if (nameLower.includes('vikram') || nameLower.includes('patel') || dept.includes('Tool')) {
    queries = [
      {
        id: 'MCD-Q101',
        title: 'CNC Machine 04 Tooling Calibration & Spindle Runout',
        type: 'Machine Deviation',
        state: 'active',
        status: 'In Discussion'
      },
      {
        id: 'TOOL-Q088',
        title: 'Hydraulic Seals Routine Re-greasing & Inspection',
        type: 'Preventive Task',
        state: 'inactive',
        status: 'Resolved'
      }
    ];
  } else if (nameLower.includes('pooja') || nameLower.includes('amit') || dept.includes('Sales')) {
    queries = [
      {
        id: 'SALES-Q201',
        title: 'Bulk Export Order Discount Authorization (Zenith Corp)',
        type: 'Commercial Pricing',
        state: 'active',
        status: 'In Discussion'
      },
      {
        id: 'SALES-Q194',
        title: 'Custom Packaging & Barcode Thermal Ribbon Verification',
        type: 'Logistics SLA',
        state: 'inactive',
        status: 'Closed'
      }
    ];
  } else if (nameLower.includes('kailash') || nameLower.includes('roy') || nameLower.includes('sen') || dept.includes('Quality') || dept.includes('R&D')) {
    queries = [
      {
        id: 'QCR-Q301',
        title: 'Polymer Injection Sink Marks on Bezel Batch #991',
        type: 'Critical Reject',
        state: 'active',
        status: 'In Discussion'
      },
      {
        id: 'QCR-Q280',
        title: 'Polycarbonate Resin MFI Batch #910 Certification',
        type: 'Raw Material Testing',
        state: 'inactive',
        status: 'Resolved'
      }
    ];
  } else {
    queries = [
      {
        id: `MCD-Q${100 + (h % 900)}`,
        title: `${dept} Operational Review & Resource Allocation`,
        type: 'Internal Review',
        state: 'active',
        status: 'In Discussion'
      },
      {
        id: `MCD-Q${50 + (h % 50)}`,
        title: 'Annual Departmental Equipment Audit & Compliance',
        type: 'Audit Closed',
        state: 'inactive',
        status: 'Closed'
      }
    ];
  }

  return { groups, queries };
};

export const MemberProfileModal = ({ member, roomContext, onClose }) => {
  const [copied, setCopied] = useState('');
  const [saved, setSaved] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  const isOnline = member.status === 'online';
  const h = hash(member.name);
  const email =
    member.name
      .toLowerCase()
      .replace(/^dr\.\s*/, '')
      .replace(/[^a-z ]/g, '')
      .trim()
      .replace(/\s+/g, '.') + '@marcacoroma.com';
  const phone = `+91 98${String(h % 100000000).padStart(8, '0')}`;
  const phoneDigits = phone.replace(/\s/g, '');
  const empId = `MC-${1000 + (h % 9000)}`;
  const dept =
    member.department ||
    (roomContext?.type === 'query'
      ? roomContext?.data?.department || 'Enterprise'
      : roomContext?.data?.name || 'Enterprise');
  const bigPhoto = (member.avatar || '').replace('w=100', 'w=600');
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    member.name
  )}&background=00a884&color=fff&size=512`;

  const { groups, queries } = useMemo(
    () => getMemberAffiliations(member, dept),
    [member, dept]
  );

  const doCopy = async (key, text) => {
    await copyText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const composeMail = () => {
    if (isMobileDevice()) {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  const callNumber = () => {
    window.location.href = `tel:${phoneDigits}`;
  };

  const saveContact = () => {
    const vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${member.name}`,
      `ORG:Marca Coroma;${dept}`,
      `TITLE:${member.role}`,
      `TEL;TYPE=CELL:${phoneDigits}`,
      `EMAIL;TYPE=WORK:${email}`,
      'END:VCARD'
    ].join('\r\n');
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${member.name.replace(/[^a-z0-9]+/gi, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const CopyBtn = ({ k, text }) => (
    <button type="button" className="mcd-mini-btn" onClick={() => doCopy(k, text)} title="Copy">
      {copied === k ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied === k ? 'Copied' : 'Copy'}</span>
    </button>
  );

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    // Native coordinate threshold:
    // When square hero image (270px tall) scrolls past 160px, header cleanly docks
    const scrolled = e.target.scrollTop > 160;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  };

  return (
    <div className="mcd-profile-backdrop" onClick={onClose}>
      <div
        ref={cardRef}
        className="mcd-profile-card"
        onClick={(e) => e.stopPropagation()}
        onScroll={handleScroll}
      >
        {/* ==============================================================
            1. WHATSAPP NATIVE STICKY HEADER (OS-Style Coordinate Docking)
            At top: Transparent header with floating close button.
            When scrolled: Solid header with docked 40px circle avatar, name & role.
            Zero layout thrashing, zero reflow, 100% butter-smooth.
            ============================================================== */}
        <div
          className={`mcd-sticky-top-bar ${isScrolled ? 'is-docked' : 'is-transparent'
            }`}
        >
          {/* Docked Circle Avatar & Name (Slides in smoothly when scrolled) */}
          <div className="mcd-sticky-docked-content">
            <div className="mcd-sticky-circle-avatar">
              <img
                src={imgError ? fallbackAvatar : (bigPhoto || fallbackAvatar)}
                alt={member.name}
                className="mcd-circle-img"
                onError={() => setImgError(true)}
              />
              <span
                className={`mcd-circle-dot ${isOnline ? 'is-online' : 'is-offline'
                  }`}
              />
            </div>
            <div className="mcd-sticky-docked-info min-w-0 flex-1">
              <h4 className="mcd-docked-name truncate">{member.name}</h4>
              <span className="mcd-docked-role truncate">
                {isOnline ? 'Online now' : member.role}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            className={`mcd-modal-close-btn ${isScrolled ? 'is-docked-btn' : 'is-floating-btn'
              }`}
            onClick={onClose}
            title="Close profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* ==============================================================
            2. NATIVE SQUARE HERO PHOTO (Zero-Jitter In-Flow Scroll)
            Scrolls naturally at hardware-accelerated OS speed with NO resizing math.
            ============================================================== */}
        <div className="mcd-hero-square-wrap">
          <img
            src={imgError ? fallbackAvatar : (bigPhoto || fallbackAvatar)}
            alt={member.name}
            className="mcd-hero-square-img"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Profile Body Content */}
        <div className="mcd-profile-body">
          {/* Main Name & Role in body (visible at top) */}
          <div className="mcd-body-hero-text">
            <h3 className="mcd-profile-name">{member.name}</h3>
            <p className="mcd-profile-role">{member.role}</p>
            <span className={`mcd-profile-status ${isOnline ? 'is-online' : ''}`}>
              <span className="mcd-profile-status-dot" />
              {isOnline ? 'Online now' : `Last seen ${member.lastSeen}`}
            </span>
          </div>

          {/* Key Details Rows */}
          <div className="mcd-profile-details">
            <div className="mcd-profile-row">
              <Building2 size={16} />
              <div>
                <small>Department</small>
                <span>{dept}</span>
              </div>
            </div>

            <div className="mcd-profile-row">
              <BadgeCheck size={16} />
              <div>
                <small>Employee ID</small>
                <span>{empId}</span>
              </div>
            </div>

            <div className="mcd-profile-row">
              <Mail size={16} />
              <div>
                <small>Email</small>
                <button
                  type="button"
                  className="mcd-link"
                  onClick={composeMail}
                  title="Compose mail"
                >
                  {email} <ExternalLink size={12} />
                </button>
              </div>
              <CopyBtn k="mail" text={email} />
            </div>

            <div className="mcd-profile-row">
              <Phone size={16} />
              <div>
                <small>Phone</small>
                <button
                  type="button"
                  className="mcd-link"
                  onClick={callNumber}
                  title="Call"
                >
                  {phone}
                </button>
              </div>
              <CopyBtn k="phone" text={phone} />
            </div>

            <div className="mcd-profile-row">
              <Clock size={16} />
              <div>
                <small>Shift</small>
                <span>General (9:00 AM – 6:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Save Contact vCard Button */}
          <button
            type="button"
            className="mcd-save-contact"
            onClick={saveContact}
          >
            {saved ? <Check size={16} /> : <UserPlus size={16} />}
            {saved ? 'Contact saved' : 'Save contact'}
          </button>

          {/* ==============================================================
              "MEMBER OF" SECTION: GROUPS AND ACTIVE / INACTIVE QUERIES
              (Bar-style cards with smart algorithmically-derived colors)
              ============================================================== */}
          <div className="mcd-profile-section-divider" />

          <div className="mcd-member-of-section">
            <div className="mcd-section-title-row">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-emerald-500" />
                <h4 className="mcd-section-heading">Member of</h4>
              </div>
              <span className="mcd-section-total-count">
                {groups.length + queries.length} total
              </span>
            </div>

            {/* 1. GROUPS (Bar-Style Cards with Smart Dynamic Colors) */}
            <div className="mcd-affiliation-group">
              <span className="mcd-sub-heading">Teams & Groups ({groups.length})</span>
              <div className="mcd-bar-cards-list">
                {groups.map((grp) => {
                  const colors = getSmartColor(grp.name);
                  return (
                    <div
                      key={grp.id}
                      className="mcd-bar-card"
                      style={{
                        '--bar-color': colors.barColor,
                        '--bg-light': colors.bgLight,
                        '--bg-dark': colors.bgDark,
                        '--border-light': colors.borderLight,
                        '--border-dark': colors.borderDark,
                        '--badge-bg-light': colors.badgeBgLight,
                        '--badge-bg-dark': colors.badgeBgDark,
                        '--badge-text-light': colors.badgeTextLight,
                        '--badge-text-dark': colors.badgeTextDark
                      }}
                    >
                      {/* Left Smart Accent Bar */}
                      <span className="mcd-bar-card-stripe" />

                      <div className="mcd-bar-card-content">
                        <div className="mcd-bar-card-top">
                          <h5 className="mcd-bar-card-title truncate">
                            {grp.name}
                          </h5>
                          <span className="mcd-bar-badge">
                            {grp.status}
                          </span>
                        </div>

                        <div className="mcd-bar-card-bottom">
                          <span className="mcd-bar-card-sub">
                            {grp.category}
                          </span>
                          <span className="mcd-bar-card-dot">•</span>
                          <span className="mcd-bar-card-role truncate">
                            {grp.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. ACTIVE & INACTIVE QUERIES (Bar-Style Cards with Smart Dynamic Colors) */}
            <div className="mcd-affiliation-group">
              <span className="mcd-sub-heading">
                Query Assignments ({queries.length})
              </span>
              <div className="mcd-bar-cards-list">
                {queries.map((q) => {
                  const colors = getSmartColor(q.id + q.title);
                  const isActive = q.state === 'active';

                  return (
                    <div
                      key={q.id}
                      className={`mcd-bar-card ${isActive ? 'is-query-active' : 'is-query-inactive'
                        }`}
                      style={{
                        '--bar-color': colors.barColor,
                        '--bg-light': colors.bgLight,
                        '--bg-dark': colors.bgDark,
                        '--border-light': colors.borderLight,
                        '--border-dark': colors.borderDark,
                        '--badge-bg-light': colors.badgeBgLight,
                        '--badge-bg-dark': colors.badgeBgDark,
                        '--badge-text-light': colors.badgeTextLight,
                        '--badge-text-dark': colors.badgeTextDark
                      }}
                    >
                      {/* Left Smart Accent Bar */}
                      <span className="mcd-bar-card-stripe" />

                      <div className="mcd-bar-card-content">
                        <div className="mcd-bar-card-top">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="mcd-bar-query-id">{q.id}</span>
                            <span className="mcd-bar-query-type truncate">
                              {q.type}
                            </span>
                          </div>

                          <span
                            className={`mcd-query-state-badge ${isActive ? 'badge-active' : 'badge-inactive'
                              }`}
                          >
                            {isActive ? (
                              <span className="mcd-active-dot" />
                            ) : (
                              <CheckCircle2 size={11} className="inline mr-1" />
                            )}
                            {q.status}
                          </span>
                        </div>

                        <p className="mcd-bar-card-qtitle truncate">
                          {q.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
