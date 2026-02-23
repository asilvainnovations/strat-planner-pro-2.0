import { Outlet, Link, useLocation } from 'react-router';
import { FileText, GitBranch, Lightbulb, LayoutDashboard, Network } from 'lucide-react';

const APP_LOGO_URL = 'https://appimize.app/assets/apps/user_1097/images/af83c19720de_707_1097.png';

export function RootLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/swot-input', label: 'SWOT Input', icon: FileText },
    { path: '/cld-builder', label: 'CLD Builder', icon: Network },
    { path: '/archetypes', label: 'Archetypes', icon: GitBranch },
    { path: '/strategic-options', label: 'Strategic Options', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-400/[0.07] blur-[100px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-purple-400/[0.06] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/[0.05] blur-[100px]" />
      </div>

      {/* Top glass navigation bar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src={APP_LOGO_URL}
                alt="Strat Planner Pro"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <h1 className="text-foreground tracking-tight">Strat Planner Pro</h1>
            </div>
            <p className="hidden sm:block text-sm text-muted-foreground">
              Systems Thinking for Strategic Development
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Glass tab navigation */}
        <nav className="flex gap-1 mb-8 p-1.5 bg-white/70 backdrop-blur-xl border border-black/[0.08] rounded-3xl w-fit shadow-sm">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] transition-all duration-200 ${
                  isActive
                    ? 'bg-white/90 shadow-[var(--shadow-md)] text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
