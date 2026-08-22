/**
 * Realistic Medical Document Generators for Demo & Testing
 */

export interface SampleDocPreset {
  id: string;
  title: string;
  type: 'visit' | 'prescription' | 'lab_result' | 'vaccination';
  facility: string;
  provider: string;
  notes: string;
  date: string;
  previewUrl: string;
}

/**
 * Creates SVG Data URI for realistic clinical document previews
 */
const createSampleDocSvg = (
  headerTitle: string,
  docType: string,
  facilityName: string,
  details: string[],
  stampText: string,
  accentColor: string
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
    <!-- Paper background -->
    <rect width="600" height="800" fill="#fcfbf7"/>
    <rect x="20" y="20" width="560" height="760" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="8"/>
    
    <!-- Top Header Bar -->
    <rect x="40" y="45" width="520" height="6" fill="${accentColor}" rx="3"/>
    
    <!-- Clinic Logo & Title -->
    <circle cx="70" cy="85" r="18" fill="${accentColor}" opacity="0.15"/>
    <path d="M70 75v20M60 85h20" stroke="${accentColor}" stroke-width="3" stroke-linecap="round"/>
    
    <text x="100" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">${facilityName}</text>
    <text x="100" y="98" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748b">Digital Health Records Exchange · Registry Document</text>
    <line x1="40" y1="120" x2="560" y2="120" stroke="#cbd5e1" stroke-dasharray="3 3"/>
    
    <!-- Document Title Badge -->
    <rect x="40" y="140" width="220" height="28" fill="${accentColor}" opacity="0.1" rx="4"/>
    <text x="50" y="159" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="${accentColor}">DOCUMENT: ${docType}</text>
    
    <text x="40" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="bold" fill="#1e293b">${headerTitle}</text>
    
    <!-- Structured Details -->
    ${details
      .map((line, idx) => {
        const y = 240 + idx * 34;
        return `<g>
          <rect x="40" y="${y - 18}" width="520" height="26" fill="${idx % 2 === 0 ? '#f8fafc' : '#ffffff'}" rx="4"/>
          <text x="50" y="${y}" font-family="monospace, Courier" font-size="12" fill="#334155">${line}</text>
        </g>`;
      })
      .join('')}
      
    <!-- Official Stamp -->
    <g transform="translate(380, 580) rotate(-8)">
      <rect width="160" height="65" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4 2" rx="6"/>
      <text x="80" y="28" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="${accentColor}" text-anchor="middle">OFFICIALLY VERIFIED</text>
      <text x="80" y="46" font-family="system-ui, sans-serif" font-size="9" fill="${accentColor}" text-anchor="middle">${stampText}</text>
    </g>
    
    <!-- Barcode at bottom -->
    <rect x="40" y="710" width="2" height="30" fill="#0f172a"/>
    <rect x="44" y="710" width="4" height="30" fill="#0f172a"/>
    <rect x="52" y="710" width="1" height="30" fill="#0f172a"/>
    <rect x="56" y="710" width="3" height="30" fill="#0f172a"/>
    <rect x="62" y="710" width="6" height="30" fill="#0f172a"/>
    <rect x="72" y="710" width="2" height="30" fill="#0f172a"/>
    <rect x="78" y="710" width="4" height="30" fill="#0f172a"/>
    <rect x="86" y="710" width="2" height="30" fill="#0f172a"/>
    <rect x="92" y="710" width="5" height="30" fill="#0f172a"/>
    <rect x="100" y="710" width="2" height="30" fill="#0f172a"/>
    <text x="115" y="728" font-family="monospace" font-size="10" fill="#64748b">REF: MC-DOC-2026-REG-8921</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_DOC_PRESETS: SampleDocPreset[] = [
  {
    id: 'sample_prescription',
    title: 'Clinic Prescription & Medication Slip',
    type: 'prescription',
    facility: 'Tuas Community Medical Center',
    provider: 'Dr. Sarah Jenkins (MCR-2018-9482)',
    date: '2026-08-15',
    notes: 'Prescribed Amoxicillin 500mg (1 cap 3x daily x 5 days) + Paracetamol 500mg PRN for fever. Worker advised on 2 days light duty.',
    previewUrl: createSampleDocSvg(
      'OUTPATIENT PRESCRIPTION & MEDICATION ORDER',
      'PRESCRIPTION ORDER',
      'Tuas Community Medical Center',
      [
        'Rx 1: Amoxicillin 500mg capsules · 1 cap TID x 5 days',
        'Rx 2: Paracetamol 500mg tabs · 2 tabs QDS PRN Pain/Fever',
        'Rx 3: Chlorpheniramine 4mg · 1 tab nocte x 3 days',
        'Diagnosis: Acute Upper Respiratory Tract Infection',
        'Medical Leave: 2 Days Light Duty Recommended',
        'Allergies Checked: No known drug allergies (NKDA)'
      ],
      'TUAS CLINIC PHARMACY',
      '#0284c7'
    ),
  },
  {
    id: 'sample_vaccine',
    title: 'National Immunization & Vaccine Card',
    type: 'vaccination',
    facility: 'National Digital Health Vaccination Registry',
    provider: 'Ministry of Health Authorized Clinic',
    date: '2026-06-20',
    notes: 'Tetanus Toxoid Booster administered (Site: Left Deltoid, Batch: TT-90218). COVID-19 mRNA Booster Dose 3 recorded.',
    previewUrl: createSampleDocSvg(
      'CERTIFICATE OF VACCINATION & IMMUNIZATION',
      'VACCINATION RECORD',
      'National Health Vaccine Registry',
      [
        'Dose 1: Tetanus Toxoid (TT-90218) · Left Deltoid · Valid 10 Yrs',
        'Dose 2: COVID-19 mRNA Updated Booster · Lot #EL-8941',
        'Dose 3: Hepatitis B Recombinant Booster · Lot #HB-4412',
        'Immunization Status: COMPLIANT FOR INDUSTRIAL SITES',
        'Next Booster Due: 2036-06-20'
      ],
      'MOH IMMUNIZATION DEPT',
      '#d97706'
    ),
  },
  {
    id: 'sample_lab',
    title: 'Diagnostic Lab Test & Chest X-Ray Report',
    type: 'lab_result',
    facility: 'Jurong Diagnostic & Pathology Laboratories',
    provider: 'Dr. Kelvin Ho (Consultant Pathologist)',
    date: '2026-05-10',
    notes: 'Annual Foreign Worker Medical Exam: Chest X-Ray Normal (no active pulmonary lesions). Fasting blood sugar 5.2 mmol/L. Hemoglobin 14.8 g/dL.',
    previewUrl: createSampleDocSvg(
      'DIAGNOSTIC PATHOLOGY & X-RAY LAB REPORT',
      'LABORATORY REPORT',
      'Jurong Diagnostic Laboratories',
      [
        'Chest X-Ray: Clear lung fields, heart size normal',
        'Hemoglobin (Hb): 14.8 g/dL (Normal: 13.5 - 17.5)',
        'Fasting Blood Glucose: 5.2 mmol/L (Normal < 6.0)',
        'Liver Function Panel: ALT 24 U/L, AST 22 U/L (Normal)',
        'Urine Multistix: Protein Nil, Glucose Nil, Blood Nil',
        'Conclusion: All parameters within standard reference ranges'
      ],
      'PATHOLOGY CERTIFIED',
      '#9333ea'
    ),
  },
  {
    id: 'sample_fitness',
    title: 'Statutory Fit-for-Work Medical Certificate',
    type: 'visit',
    facility: 'Occupational Health & Screening Center',
    provider: 'Dr. Raymond Tan (Occupational Physician)',
    date: '2026-07-02',
    notes: 'Comprehensive occupational health screening completed. Fit for work at height, heavy lifting, and standard industrial operations without restrictions.',
    previewUrl: createSampleDocSvg(
      'STATUTORY WORK FITNESS CLEARANCE CERTIFICATE',
      'FITNESS CERTIFICATE',
      'Occupational Health Screening Center',
      [
        'Examination: Full Pre-Placement & Periodic Exam',
        'Visual Acuity: 6/6 bilateral (corrected)',
        'Audiometry: Normal hearing thresholds bilateral',
        'Blood Pressure: 118/76 mmHg · Pulse: 72 bpm',
        'Musculoskeletal: Normal range of motion, spine intact',
        'FINAL CLEARANCE: FIT FOR ALL SITE & CONSTRUCTION ROLES'
      ],
      'OCCUPATIONAL CLEARANCE',
      '#059669'
    ),
  },
];
