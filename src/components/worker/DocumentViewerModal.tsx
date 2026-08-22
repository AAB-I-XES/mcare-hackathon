import React, { useState, useEffect } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Calendar,
  Building2,
  UserCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { MedicalRecord } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface DocumentViewerModalProps {
  record: MedicalRecord;
  initialAttachmentIndex?: number;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  record,
  initialAttachmentIndex = 0,
  onClose,
}) => {
  const attachments = record.attachments && record.attachments.length > 0 ? record.attachments : [];
  const [currentIndex, setCurrentIndex] = useState(initialAttachmentIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentAttachment = attachments[currentIndex] || '';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < attachments.length - 1) {
        setCurrentIndex((i) => i + 1);
        setZoomLevel(1);
        setRotation(0);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setZoomLevel(1);
        setRotation(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, attachments.length, onClose]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.6));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const handleDownload = () => {
    if (!currentAttachment) return;
    const link = document.createElement('a');
    link.href = currentAttachment;
    link.download = `medical_record_${record.type}_${record.id}_page${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col justify-between p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-white shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 capitalize truncate">
                {record.type.replace('_', ' ')} Document
              </span>
              {attachments.length > 1 && (
                <span className="text-[10px] font-mono-code bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded border border-slate-700">
                  Page {currentIndex + 1} of {attachments.length}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {record.facility_name} · {formatDate(record.created_at)}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            title="Rotate 90°"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            title="Download Document Image"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={onClose}
            title="Close Viewer"
            className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Viewport */}
      <div className="relative flex-1 my-2 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800">
        {currentAttachment ? (
          <div
            className="w-full h-full flex items-center justify-center p-2 sm:p-6 overflow-auto cursor-grab active:cursor-grabbing transition-transform duration-200"
            onClick={handleResetZoom}
          >
            <img
              src={currentAttachment}
              alt={`${record.type} Document Page ${currentIndex + 1}`}
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.15s ease-out',
                maxHeight: '80vh',
                maxWidth: '90vw',
              }}
              className="rounded-lg shadow-2xl object-contain pointer-events-auto border border-slate-700/50 bg-white"
            />
          </div>
        ) : (
          <div className="text-center text-slate-500 p-8 space-y-2">
            <FileText className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No scanned document preview available</p>
          </div>
        )}

        {/* Carousel Prev/Next Overlay buttons if multi-page */}
        {attachments.length > 1 && (
          <>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((i) => Math.max(0, i - 1));
                setZoomLevel(1);
                setRotation(0);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed transition border border-slate-700 shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              disabled={currentIndex === attachments.length - 1}
              onClick={() => {
                setCurrentIndex((i) => Math.min(attachments.length - 1, i + 1));
                setZoomLevel(1);
                setRotation(0);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed transition border border-slate-700 shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Info Bar & Page Thumbnails */}
      <div className="w-full bg-slate-900/95 border border-slate-800 rounded-xl p-3 text-white space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Doctor / Provider Notes:</span>
              <span className="text-sky-400 font-semibold">{record.provider_name}</span>
            </div>
            <p className="text-slate-300 text-xs line-clamp-2">{record.notes}</p>
          </div>

          {/* Multi-page thumbnail selector */}
          {attachments.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-1">
              {attachments.map((att, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className={`relative w-10 h-12 rounded overflow-hidden border-2 transition cursor-pointer ${
                    currentIndex === idx
                      ? 'border-sky-400 ring-2 ring-sky-400/40'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={att}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-center font-bold">
                    P{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
