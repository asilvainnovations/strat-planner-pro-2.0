import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Lightbulb, Target, Users, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export function StrategicOptions() {
  const {
    cldNodes,
    causalLinks,
    leveragePoints,
    strategicOptions,
    identifyLeveragePoints,
    generateStrategicOptions,
  } = useStore();

  useEffect(() => {
    if (cldNodes.length > 0 && causalLinks.length > 0) {
      identifyLeveragePoints();
      generateStrategicOptions();
    }
  }, [cldNodes.length, causalLinks.length]);

  const impactBadge: Record<string, string> = {
    high: 'bg-red-500/10 text-red-700 ring-red-500/20',
    medium: 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
    low: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  };

  const impactCard: Record<string, string> = {
    high: 'border-l-red-500 bg-red-500/3',
    medium: 'border-l-amber-500 bg-amber-500/3',
    low: 'border-l-emerald-500 bg-emerald-500/3',
  };

  const feasibilityBadge: Record<string, string> = {
    high: 'bg-emerald-500/10 text-emerald-700',
    medium: 'bg-amber-500/10 text-amber-700',
    low: 'bg-red-500/10 text-red-700',
  };

  return (
    <div className="space-y-6 stagger-children">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[var(--radius-2xl)] p-8 text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-2xl tracking-tight">Strategic Options Generator</h2>
          </div>
          <p className="text-white/70 max-w-xl">
            Leverage systems thinking insights to identify high-impact intervention strategies
            grounded in political economy analysis
          </p>
        </div>
      </div>

      {leveragePoints.length === 0 && strategicOptions.length === 0 ? (
        /* Empty state */
        <div className="glass-card text-center py-14">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-muted-foreground opacity-40" />
          </div>
          <h3 className="text-foreground mb-2">No Analysis Available</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Build a causal loop diagram first to generate strategic options and identify leverage
            points.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/swot-input"
              className="btn-glass-primary text-sm"
            >
              Input SWOT Variables
            </a>
            <a
              href="/cld-builder"
              className="btn-glass text-sm bg-purple-500/10 text-purple-700 hover:bg-purple-500/20"
            >
              Build CLD
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Leverage Points */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Target className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-foreground">
                  Leverage Points{' '}
                  <span className="text-muted-foreground">({leveragePoints.length})</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  High-impact intervention points identified through structural analysis
                </p>
              </div>
            </div>

            {leveragePoints.length > 0 ? (
              <div className="space-y-3">
                {leveragePoints.map(point => {
                  const node = cldNodes.find(n => n.id === point.nodeId);
                  return (
                    <div
                      key={point.id}
                      className={`p-4 rounded-[var(--radius-lg)] glass-sm border-l-4 ${impactCard[point.impact]}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span className="text-sm text-foreground">{node?.label}</span>
                            <span className="px-2.5 py-1 rounded-full text-xs bg-muted/60 text-muted-foreground">
                              {point.type.replace(/-/g, ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80">{point.description}</p>
                        </div>
                        <span
                          className={`ml-4 px-3 py-1 rounded-full text-xs ring-1 ring-inset ${impactBadge[point.impact]}`}
                        >
                          {point.impact} impact
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No leverage points detected. Create more feedback loops in the CLD builder.</p>
              </div>
            )}
          </div>

          {/* Strategic Options */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-foreground">
                  Strategic Intervention Options{' '}
                  <span className="text-muted-foreground">({strategicOptions.length})</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Actionable strategies derived from systems structure analysis
                </p>
              </div>
            </div>

            {strategicOptions.length > 0 ? (
              <div className="space-y-4">
                {strategicOptions.map(option => (
                  <div
                    key={option.id}
                    className="p-5 glass-sm rounded-[var(--radius-xl)] vibrancy transition-all duration-200 hover:shadow-[var(--shadow-lg)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-foreground">{option.title}</h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${feasibilityBadge[option.feasibility]}`}
                      >
                        {option.feasibility} feasibility
                      </span>
                    </div>

                    <p className="text-sm text-foreground/70 mb-4">{option.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          icon: Users,
                          label: 'Power Alignment',
                          value: option.politicalEconomy.powerAlignment,
                          color: 'text-purple-600',
                          bg: 'bg-purple-500/5',
                        },
                        {
                          icon: Target,
                          label: 'Institutional Capacity',
                          value: option.politicalEconomy.institutionalCapacity,
                          color: 'text-blue-600',
                          bg: 'bg-blue-500/5',
                        },
                        {
                          icon: Clock,
                          label: 'Time Horizon',
                          value: option.politicalEconomy.timeHorizon,
                          color: 'text-emerald-600',
                          bg: 'bg-emerald-500/5',
                        },
                        {
                          icon: Users,
                          label: 'Stakeholder Coalition',
                          value: option.politicalEconomy.stakeholderCoalition,
                          color: 'text-amber-600',
                          bg: 'bg-amber-500/5',
                        },
                      ].map((dim, i) => {
                        const Icon = dim.icon;
                        return (
                          <div
                            key={i}
                            className={`p-3 glass-sm rounded-[var(--radius-lg)] ${dim.bg}`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <Icon className={`w-3.5 h-3.5 ${dim.color}`} />
                              <span className="text-xs text-muted-foreground">{dim.label}</span>
                            </div>
                            <p className="text-xs text-foreground/80">{dim.value}</p>
                          </div>
                        );
                      })}
                    </div>

                    {option.leveragePoints.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          Addresses {option.leveragePoints.length} leverage point(s)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No strategic options generated yet. Add more SWOT variables and causal links.</p>
              </div>
            )}
          </div>

          {/* Political Economy Framework */}
          <div className="glass-card bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
            <h3 className="text-foreground mb-4">Political Economy Analysis Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  title: 'Power',
                  desc: 'Which actors have authority and influence? What coalitions are needed?',
                },
                {
                  title: 'Institutions',
                  desc: 'What formal and informal rules govern behavior? What capacity exists?',
                },
                {
                  title: 'Incentives',
                  desc: 'What motivates stakeholders? How can incentives be aligned with goals?',
                },
                {
                  title: 'Resources',
                  desc: 'What financial, human, and technical resources are available?',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="glass-sm rounded-[var(--radius-lg)] p-4 vibrancy"
                >
                  <h4 className="text-sm mb-2 text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
