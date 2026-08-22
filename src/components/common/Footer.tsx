import React from 'react';

interface FooterProps {
  customText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  customText = 'MigrantCare Portable Digital Health Pass &copy; 2026. Zero-knowledge consent protocol.',
}) => {
  return (
    <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
      <p dangerouslySetInnerHTML={{ __html: customText }} />
    </footer>
  );
};
