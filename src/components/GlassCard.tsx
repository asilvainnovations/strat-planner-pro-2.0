import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-xl border border-black/[0.08] rounded-3xl p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassButton({
  children,
  className = '',
  primary = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  primary?: boolean;
  [key: string]: any;
}) {
  const baseClasses = primary
    ? 'bg-blue-500/85 hover:bg-blue-500/95 text-white'
    : 'bg-white/60 hover:bg-white/80 text-foreground';

  return (
    <button
      className={`${baseClasses} backdrop-blur-md border border-white/20 rounded-xl px-5 py-2.5 shadow-sm transition-all duration-200 active:scale-[0.97] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
