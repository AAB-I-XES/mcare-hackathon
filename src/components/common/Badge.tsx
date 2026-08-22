import React from 'react';

export type BadgeVariant = 'emerald' | 'sky' | 'amber' | 'purple' | 'rose' | 'slate';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald: 'badge-clean-emerald',
  sky: 'badge-clean-sky',
  amber: 'badge-clean-amber',
  purple: 'badge-clean-purple',
  rose: 'badge-clean-rose',
  slate: 'badge-clean-slate',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  children,
  icon,
  className = '',
}) => {
  return (
    <span className={`badge-clean ${variantStyles[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
