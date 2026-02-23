import { Link } from 'react-router';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowRight, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

const APP_LOGO_URL = 'https://appimize.app/assets/apps/user_1097/images/af83c19720de_707_1097.png';

export function Dashboard() {
  const { swotItems, cldNodes, causalLinks, feedbackLoops, strategicOptions } = useStore();

  const swotData = [
    { name: 'Strengths', count: swotItems.filter(i => i.category === 'strength').length, color: '#10b981' },
    { name: 'Weaknesses', count: swotItems.filter(i => i.category === 'weakness').length, color: '#ef4444' },
    { name: 'Opportunities', count: swotItems.filter(i => i.category === 'opportunity').length, color: '#3b82f6' },
    { name: 'Threats', count: swotItems.filter(i => i.category === 'threat').length, color: '#f97316' },
  ];

  const systemMetrics = [
    { label: 'SWOT Variables', value: swotItems.length, icon: Target, gradient: 'from-blue-500/10 to-blue-600/5' },
    { label: 'CLD Nodes', value: cldNodes.length, icon: TrendingUp, gradient: 'from-emerald-500/10 to-emerald-600/5' },
    { label: 'Causal Links', value: causalLinks.length, icon: ArrowRight, gradient: 'from-purple-500/10 to-purple-600/5' },
    { label: 'Feedback Loops', value: feedbackLoops.length, icon: AlertTriangle, gradient: 'from-amber-500/10 to-amber-600/5' },
  ];

  const metricColors = ['text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-amber-600'];

  const reinforcingLoops = feedbackLoops.filter(l => l.type === 'reinforcing').length;
  const balancingLoops = feedbackLoops.filter(l => l.type === 'balancing').length;

  return (
    <div className="space-y-6 stagger-children">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-[var(--radius-2xl)] p-8 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)]" />
        <div className="relative flex items-start gap-5">
          <img
            src={APP_LOGO_URL}
            alt="Strat Planner Pro"
            className="w-14 h-14 rounded-2xl object-contain bg-white/15 p-2 backdrop-blur-sm"
          />
          <div className="flex-1">
            <h2 className="text-2xl mb-2 tracking-tight">Welcome to Strat Planner Pro</h2>
            <p className="text-blue-100/80 mb-6 max-w-xl">
              Transform static SWOT analysis into dynamic systems mapping for strategic development planning
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/swot-input"
                className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 text-sm border border-white/10"
              >
                Start SWOT Analysis
              </Link>
              <Link
                to="/archetypes"
                className="bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm border border-white/10"
              >
                Explore Archetypes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`bg-white/70 backdrop-blur-xl border border-black/[0.08] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br ${metric.gradient}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl mt-2 text-foreground tracking-tight">{metric.value}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${metricColors[i]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="mb-4 text-foreground">SWOT Distribution</h3>
          {swotItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={swotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {swotData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="mb-3 text-muted-foreground">No SWOT data yet</p>
                <Link
                  to="/swot-input"
                  className="text-sm text-primary hover:underline"
                >
                  Add your first SWOT item &rarr;
                </Link>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-foreground">Feedback Loop Analysis</h3>
          {feedbackLoops.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Reinforcing', value: reinforcingLoops, color: '#ef4444' },
                      { name: 'Balancing', value: balancingLoops, color: '#10b981' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#ef4444" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-white/60 backdrop-blur-md border border-white/20 rounded-xl">
                <p className="text-sm">
                  {reinforcingLoops > balancingLoops ? (
                    <span className="text-amber-600">System dominated by reinforcing loops - potential for runaway effects</span>
                  ) : balancingLoops > reinforcingLoops ? (
                    <span className="text-emerald-600">System has self-correcting mechanisms in place</span>
                  ) : (
                    <span className="text-blue-600">Balanced system with equal reinforcing and balancing dynamics</span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="mb-3 text-muted-foreground">No feedback loops detected</p>
                <Link to="/cld-builder" className="text-sm text-primary hover:underline">
                  Build causal loop diagram &rarr;
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Recent Strategic Options */}
      {strategicOptions.length > 0 && (
        <GlassCard>
          <h3 className="mb-4 text-foreground">Recent Strategic Options</h3>
          <div className="space-y-3">
            {strategicOptions.slice(0, 3).map(option => (
              <div
                key={option.id}
                className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/20 hover:bg-white/70 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm mb-1 text-foreground">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description.slice(0, 150)}...</p>
                  </div>
                  <span
                    className={`ml-4 px-3 py-1 rounded-full text-xs ${
                      option.feasibility === 'high'
                        ? 'bg-emerald-100 text-emerald-700'
                        : option.feasibility === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {option.feasibility} feasibility
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/strategic-options"
            className="mt-4 inline-block text-primary hover:underline text-sm"
          >
            View all strategic options &rarr;
          </Link>
        </GlassCard>
      )}

      {/* Getting started steps */}
      <GlassCard className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <h3 className="text-foreground mb-2">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { step: '1', title: 'Input SWOT Variables', desc: 'Define strengths, weaknesses, opportunities, and threats with metadata' },
            { step: '2', title: 'Build Causal Links', desc: 'Map relationships and feedback loops in the CLD builder' },
            { step: '3', title: 'Generate Strategy', desc: 'Discover leverage points and strategic intervention options' },
          ].map(item => (
            <div key={item.step} className="bg-white/60 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/70 transition-all duration-200">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mb-3">
                {item.step}
              </div>
              <h4 className="text-sm mb-1 text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}