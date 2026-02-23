import { useState } from 'react';
import { systemArchetypes } from '../data/archetypes';
import { useStore } from '../store/useStore';
import { CldNode, CausalLink } from '../types';
import { BookOpen, Play, Info, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function ArchetypesLibrary() {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const { addCldNode, addCausalLink } = useStore();

  const archetype = selectedArchetype
    ? systemArchetypes.find(a => a.id === selectedArchetype)
    : null;

  const applyArchetype = () => {
    if (!archetype) return;

    const nodeIdMap = new Map<number, string>();

    archetype.template.nodes.forEach((nodeTemplate, idx) => {
      const newNode: CldNode = {
        id: `node-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        label: nodeTemplate.label,
        category: nodeTemplate.category,
        nodeType: nodeTemplate.nodeType,
        x: nodeTemplate.x,
        y: nodeTemplate.y,
      };
      addCldNode(newNode);
      nodeIdMap.set(idx, newNode.id);
    });

    archetype.template.links.forEach((linkTemplate, idx) => {
      if (idx < archetype.template.nodes.length - 1) {
        const newLink: CausalLink = {
          id: `link-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: nodeIdMap.get(idx)!,
          targetId: nodeIdMap.get(idx + 1)!,
          polarity: linkTemplate.polarity,
          hasDelay: linkTemplate.hasDelay,
        };
        addCausalLink(newLink);
      }
    });

    alert(
      `Applied ${archetype.name} archetype! Navigate to CLD Builder to view and customize.`
    );
  };

  const generateBehaviorData = (archetypeId: string) => {
    const timePoints = Array.from({ length: 20 }, (_, i) => i);

    switch (archetypeId) {
      case 'fixes-that-fail':
        return timePoints.map(t => ({
          time: t,
          problem: 100 - Math.min(t * 10, 50) + Math.max(0, (t - 10) * 8),
          quickFix: t < 10 ? t * 5 : Math.max(0, 50 - (t - 10) * 3),
        }));
      case 'escalation':
        return timePoints.map(t => ({
          time: t,
          partyA: 20 + t * 3,
          partyB: 15 + t * 3.5,
        }));
      case 'limits-to-growth':
        return timePoints.map(t => ({
          time: t,
          growth: 100 * (1 - Math.exp(-0.3 * t)) * Math.exp(-0.05 * Math.max(0, t - 10)),
        }));
      default:
        return timePoints.map(t => ({
          time: t,
          value: 50 + Math.sin(t * 0.5) * 20,
        }));
    }
  };

  const strategicInsights: Record<string, string> = {
    'fixes-that-fail':
      'Quick fixes provide short-term relief but worsen the underlying problem. Focus on root causes rather than symptoms.',
    'shifting-the-burden':
      'Over-reliance on symptomatic solutions weakens fundamental solutions. Invest in long-term capacity building.',
    escalation:
      'Competitive dynamics create lose-lose spirals. Introduce shared goals or reframe the competition.',
    'tragedy-of-the-commons':
      'Individual incentives lead to collective collapse. Establish governance mechanisms for shared resources.',
    'growth-and-underinvestment':
      'Delayed investment in capacity leads to performance collapse. Invest proactively during growth periods.',
    'success-to-the-successful':
      'Winner-take-all dynamics starve alternatives. Ensure equitable resource allocation mechanisms.',
    'limits-to-growth':
      'All growth eventually hits constraints. Identify and address limiting factors early.',
    'drifting-goals':
      'Lowering standards normalizes poor performance. Maintain rigorous goals and invest in improvement.',
  };

  const categoryBadge: Record<string, string> = {
    strength: 'bg-emerald-500/10 text-emerald-700',
    weakness: 'bg-red-500/10 text-red-700',
    opportunity: 'bg-blue-500/10 text-blue-700',
    threat: 'bg-amber-500/10 text-amber-700',
  };

  return (
    <div className="space-y-6 stagger-children">
      {/* Library header */}
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl text-foreground tracking-tight">Systems Archetypes Library</h2>
            <p className="text-sm text-muted-foreground">
              Pre-built templates for common development dynamics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {systemArchetypes.map(arch => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchetype(arch.id)}
              className={`p-4 rounded-[var(--radius-lg)] text-left transition-all duration-200 vibrancy ${
                selectedArchetype === arch.id
                  ? 'glass-md ring-2 ring-primary/30 bg-primary/5'
                  : 'glass-sm hover:shadow-[var(--shadow-md)]'
              }`}
            >
              <h3 className="text-sm mb-2 text-foreground">{arch.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3">{arch.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Archetype detail */}
      {archetype && (
        <div className="glass-card animate-scale-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl mb-2 text-foreground tracking-tight">{archetype.name}</h3>
              <p className="text-foreground/80 mb-4">{archetype.description}</p>
            </div>
            <button
              onClick={applyArchetype}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-lg)] bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 transition-all duration-200 text-sm"
            >
              <Play className="w-4 h-4" />
              Apply Template
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <h4 className="text-sm mb-3 flex items-center gap-2 text-foreground">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                </div>
                Development Context Application
              </h4>
              <div className="p-4 glass-sm rounded-[var(--radius-lg)] bg-blue-500/5">
                <p className="text-sm text-foreground/80">{archetype.developmentContext}</p>
              </div>

              <h4 className="text-sm mt-6 mb-3 flex items-center gap-2 text-foreground">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                Key Structural Elements
              </h4>
              <div className="space-y-2">
                {archetype.structuralElements.map((element, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 glass-sm rounded-[var(--radius-lg)]"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground/80">{element}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div>
              <h4 className="text-sm mb-3 text-foreground">Behavior Over Time</h4>
              <div className="p-4 glass-sm rounded-[var(--radius-lg)]">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={generateBehaviorData(archetype.id)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis
                      dataKey="time"
                      label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    />
                    <Legend />
                    {Object.keys(generateBehaviorData(archetype.id)[0])
                      .filter(key => key !== 'time')
                      .map((key, idx) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={
                            ['#3b82f6', '#ef4444', '#10b981', '#f97316'][idx % 4]
                          }
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 glass-sm rounded-[var(--radius-lg)] bg-amber-500/5 border-l-4 border-l-amber-500">
                <h5 className="text-sm text-foreground mb-2">Strategic Insight</h5>
                <p className="text-sm text-foreground/80">
                  {strategicInsights[archetype.id] || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Template preview */}
          <div className="mt-6 p-4 glass-sm rounded-[var(--radius-lg)]">
            <h4 className="text-sm mb-3 text-foreground">Template Structure Preview</h4>
            <div className="flex flex-wrap gap-2">
              {archetype.template.nodes.map((node, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-full text-xs ${categoryBadge[node.category] || 'bg-muted text-muted-foreground'}`}
                >
                  {node.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info footer */}
      <div className="glass-card bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <h3 className="text-foreground mb-3">Understanding Systems Archetypes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-sm rounded-[var(--radius-lg)] p-4 vibrancy">
            <h4 className="text-sm mb-2 text-foreground">What are Archetypes?</h4>
            <p className="text-sm text-muted-foreground">
              Systems archetypes are recurring patterns of behavior found in complex systems. They
              help identify common dysfunctional dynamics and suggest high-leverage intervention
              points.
            </p>
          </div>
          <div className="glass-sm rounded-[var(--radius-lg)] p-4 vibrancy">
            <h4 className="text-sm mb-2 text-foreground">How to Use Them</h4>
            <p className="text-sm text-muted-foreground">
              Match your situation to an archetype, apply the template, then customize nodes and
              links to reflect your specific context. Focus on breaking problematic feedback loops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
