import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  Upload,
  RefreshCw,
  Zap,
  ZapOff,
  CheckCircle2,
  FileText,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  Pill,
  Syringe,
  FlaskConical,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedicalRecordType, NewMedicalRecordInput } from '../../types';
import { useI18n } from '../../i18n';
import {
  captureVideoFrame,
  processUploadedFile,
  ImageFilterMode,
} from '../../utils/cameraUtils';
import { SAMPLE_DOC_PRESETS, SampleDocPreset } from '../../constants/sampleMedicalDocs';

interface DocumentScannerModalProps {
  workerId: string;
  onClose: () => void;
  onRecordSaved: (recordInput: NewMedicalRecordInput) => void;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  workerId,
  onClose,
  onRecordSaved,
}) => {
  const { t } = useI18n();

  const [mode, setMode] = useState<'camera' | 'review' | 'details'>('camera');
  const [capturedPages, setCapturedPages] = useState<string[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<ImageFilterMode>('enhanced');
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [torchActive, setTorchActive] = useState(false);
  const [hasTorchCapability, setHasTorchCapability] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterActive, setIsShutterActive] = useState(false);

  // Form Details State
  const [recordType, setRecordType] = useState<MedicalRecordType>('prescription');
  const [facilityName, setFacilityName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize and stop camera stream
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasCameraPermission(true);

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as any;
        if (capabilities && capabilities.torch) {
          setHasTorchCapability(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCameraPermission(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. You can still upload files directly or use sample medical documents.'
          : 'Unable to access video camera. Please use file upload or demo samples.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera(cameraFacing);
    return () => {
      stopCamera();
    };
  }, [cameraFacing]);

  // Toggle flash torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchActive }],
        });
        setTorchActive(!torchActive);
      } catch (e) {
        console.warn('Torch constraint error:', e);
      }
    }
  };

  // Switch between front and back camera
  const toggleFacingMode = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
  };

  // Capture frame from video feed
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;

    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

    const frameData = captureVideoFrame(videoRef.current, filterMode);
    if (frameData) {
      const updatedPages = [...capturedPages, frameData];
      setCapturedPages(updatedPages);
      setSelectedPageIndex(updatedPages.length - 1);
      setMode('review');
    }
  };

  // Handle manual file upload from disk or gallery
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const newPages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await processUploadedFile(file);
        newPages.push(dataUrl);
      }

      const updated = [...capturedPages, ...newPages];
      setCapturedPages(updated);
      setSelectedPageIndex(updated.length - 1);
      setMode('review');
    } catch (err: any) {
      setCameraError('Failed to process image file.');
    }
  };

  // Quick load sample document preset
  const handleSelectSample = (sample: SampleDocPreset) => {
    setCapturedPages([sample.previewUrl]);
    setSelectedPageIndex(0);
    setRecordType(sample.type);
    setFacilityName(sample.facility);
    setProviderName(sample.provider);
    setNotes(sample.notes);
    setRecordDate(sample.date);
    setMode('review');
  };

  // Remove a captured page
  const handleDeletePage = (indexToRemove: number) => {
    const updated = capturedPages.filter((_, idx) => idx !== indexToRemove);
    setCapturedPages(updated);
    if (updated.length === 0) {
      setMode('camera');
    } else {
      setSelectedPageIndex(Math.max(0, indexToRemove - 1));
    }
  };

  // Proceed from review to entering record details
  const handleProceedToDetails = () => {
    if (capturedPages.length === 0) {
      setCameraError('Please capture at least one document page.');
      return;
    }
    // Auto-fill default facility if blank
    if (!facilityName) {
      setFacilityName('Community Health Clinic');
    }
    if (!providerName) {
      setProviderName('Attending Physician');
    }
    setMode('details');
  };

  // Final submit and save record
  const handleFinalSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!facilityName.trim()) {
      setFormError('Please enter the clinic or issuing hospital name.');
      return;
    }
    if (!notes.trim()) {
      setFormError('Please provide clinical notes or prescription instructions.');
      return;
    }

    setIsSaving(true);

    const recordInput: NewMedicalRecordInput = {
      worker_id: workerId,
      type: recordType,
      facility_name: facilityName.trim(),
      provider_name: providerName.trim() || 'Attending Physician',
      notes: `${notes.trim()}${recordDate ? `\n[Document Date: ${recordDate}]` : ''}`,
      attachments: capturedPages,
    };

    onRecordSaved(recordInput);

    confetti({
      particleCount: 110,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {mode === 'camera' && t('cameraScannerTitle')}
                {mode === 'review' && 'Document Review & Filter'}
                {mode === 'details' && t('documentReview')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {mode === 'camera' && t('cameraScannerSubtitle')}
                {mode === 'review' && `${capturedPages.length} Page(s) Scanned`}
                {mode === 'details' && 'Attach details to your portable health pass'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE 1: LIVE CAMERA VIEWFINDER */}
        {mode === 'camera' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Viewfinder Container */}
            <div className="relative w-full aspect-4/3 max-h-[380px] mx-auto bg-slate-950 rounded-2xl overflow-hidden border-2 border-sky-500/40 shadow-inner flex items-center justify-center">
              {/* Shutter visual flash effect */}
              {isShutterActive && (
                <div className="absolute inset-0 bg-white z-30 opacity-90 animate-out fade-out duration-150" />
              )}

              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Grid Overlay & Laser line */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Rule of thirds grid */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20 border border-white/30">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Corner document frame markers */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-sky-400 rounded-tl-sm shadow-md" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-sky-400 rounded-tr-sm shadow-md" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-sky-400 rounded-bl-sm shadow-md" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-sky-400 rounded-br-sm shadow-md" />

                {/* Animated scanning laser guide */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse" />

                <div className="absolute bottom-3 inset-x-0 flex justify-center">
                  <span className="text-[10px] font-mono-code font-bold tracking-wider text-sky-200 bg-slate-950/80 px-3 py-1 rounded-full border border-sky-500/30">
                    ALIGN MEDICAL DOCUMENT IN FRAME
                  </span>
                </div>
              </div>

              {/* Viewfinder On-Screen Camera Controls */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                {hasTorchCapability && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    title={t('torchToggle')}
                    className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                      torchActive
                        ? 'bg-amber-400 text-slate-950 shadow-lg'
                        : 'bg-slate-900/70 text-white hover:bg-slate-800'
                    }`}
                  >
                    {torchActive ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title={t('switchCamera')}
                  className="p-2 rounded-full bg-slate-900/70 backdrop-blur-md text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error or Permission Alert if any */}
            {cameraError && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{cameraError}</p>
                  <p className="text-[11px] text-amber-700">
                    Tip: You can take a photo with your phone camera or select an existing prescription file below.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Camera Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-minimal-secondary flex items-center gap-1.5 py-2.5 px-3 text-xs cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>{t('uploadFromGallery')}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                multiple
                className="hidden"
              />

              {/* Primary Snapshot Capture Button */}
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="flex-1 max-w-[200px] py-3 px-4 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white/40" />
                <span className="text-sm font-extrabold">{t('capturePhoto')}</span>
              </button>

              {/* Review Page Count Badge if already has pages */}
              {capturedPages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 text-xs py-2.5 px-3 cursor-pointer"
                >
                  <span>Review ({capturedPages.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Demo Sample Documents (For easy testing without physical paper) */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('samplesTitle')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_DOC_PRESETS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-left transition flex flex-col justify-between text-xs cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-sky-900 line-clamp-1">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-sky-600 font-semibold mt-1">
                      Scan Sample →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: DOCUMENT PREVIEW & ENHANCEMENT */}
        {mode === 'review' && (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Scanned Document Image Preview Box */}
            <div className="relative w-full aspect-4/3 max-h-[340px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 flex items-center justify-center p-2">
              {capturedPages[selectedPageIndex] ? (
                <img
                  src={capturedPages[selectedPageIndex]}
                  alt={`Scanned Document Page ${selectedPageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain rounded shadow-lg bg-white"
                />
              ) : (
                <span className="text-slate-400 text-xs">No page selected</span>
              )}

              {/* Top Page Count overlay */}
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-mono-code font-bold px-2.5 py-1 rounded-full border border-slate-700">
                Page {selectedPageIndex + 1} of {capturedPages.length}
              </div>

              {/* Delete current page button */}
              <button
                type="button"
                onClick={() => handleDeletePage(selectedPageIndex)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 transition cursor-pointer"
                title="Delete this page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Multi-Page Tray Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {capturedPages.map((page, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    selectedPageIndex === idx
                      ? 'border-sky-500 ring-2 ring-sky-500/30'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={page}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-white text-center font-bold">
                    P{idx + 1}
                  </span>
                </button>
              ))}

              {/* Add another page button */}
              <button
                type="button"
                onClick={() => {
                  startCamera(cameraFacing);
                  setMode('camera');
                }}
                className="w-14 h-16 rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-500 hover:bg-sky-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-sky-700 transition cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-0.5">{t('addAnotherPage')}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  startCamera(cameraFacing);
                  setMode('camera');
                }}
                className="btn-minimal-secondary cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('retakePhoto')} / Add</span>
              </button>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="btn-minimal-primary cursor-pointer"
              >
                <span>Continue to Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: RECORD METADATA & SUMMARY FORM */}
        {mode === 'details' && (
          <form onSubmit={handleFinalSave} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {formError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('recordType')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'prescription', label: t('recordType_prescription'), icon: Pill },
                  { id: 'visit', label: t('recordType_visit'), icon: Stethoscope },
                  { id: 'vaccination', label: t('recordType_vaccination'), icon: Syringe },
                  { id: 'lab_result', label: t('recordType_lab_result'), icon: FlaskConical },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = recordType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRecordType(item.id as MedicalRecordType)}
                      className={`p-2.5 rounded-lg border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-600 text-sky-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facility & Doctor Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('facilityLabel')}</span>
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. Tuas Community Clinic, NUH"
                  className="w-full minimal-input px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('doctorLabel')}</span>
                </label>
                <input
                  type="text"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins / Attending Dr"
                  className="w-full minimal-input px-3 py-2 text-xs"
                />
              </div>
            </div>

            {/* Document Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('recordDate')}</span>
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full minimal-input px-3 py-2 text-xs bg-white cursor-pointer"
              />
            </div>

            {/* Notes & Prescriptions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>{t('notes')}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Medications, dosage, instructions
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Prescribed Amoxicillin 500mg (1 cap 3x daily x 5 days). Advised on 2 days light duty. No heavy lifting."
                className="w-full minimal-input p-3 text-xs"
                required
              />
            </div>

            {/* Attached Thumbnails Indicator */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-slate-800">
                  {capturedPages.length} Attached Scanned Document(s)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMode('review')}
                className="text-sky-600 hover:text-sky-800 font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Review Images</span>
              </button>
            </div>

            {/* Form Footer Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('review')}
                className="btn-minimal-secondary cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Images</span>
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaving ? 'Encrypting & Saving...' : 'Save to Passport'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
