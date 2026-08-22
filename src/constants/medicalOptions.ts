export const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const;

export const COMMON_CHRONIC_CONDITIONS = [
  { id: 'Asthma', label: 'Asthma' },
  { id: 'Hypertension', label: 'Hypertension' },
  { id: 'Diabetes', label: 'Diabetes' },
  { id: 'Heart Disease', label: 'Heart Disease' },
  { id: 'Chronic Kidney Disease', label: 'Kidney Disease' },
  { id: 'Skin Dermatitis', label: 'Occupational Dermatitis' },
] as const;

export const DEMO_PASSENGERS = [
  { id: 'MC-5820-1943', name: 'Tareq Rahman', role: 'Construction Crew', detail: 'Penicillin Allergy · Blood: O+' },
  { id: 'MC-7412-8823', name: 'Siti Aminah', role: 'Factory Logistics', detail: 'Asthma Condition · Blood: A-' },
  { id: 'MC-1094-3329', name: 'Juan Carlos', role: 'Site Maintenance', detail: 'Hypertension · Blood: B+' },
] as const;
