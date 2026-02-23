import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5">
        <AlertCircle className="w-7 h-7 text-muted-foreground opacity-50" />
      </div>
      <h2 className="text-2xl mb-2 text-foreground tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-glass-primary text-sm inline-flex items-center">
        Return to Dashboard
      </Link>
    </div>
  );
}