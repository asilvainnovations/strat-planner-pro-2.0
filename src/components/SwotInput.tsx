import { useState } from 'react';
import { useStore } from '../store/useStore';
import { SwotCategory, VariableType, TimeHorizon, PoliticalEconomyDimension } from '../types';
import { Plus, Trash2, Save, Sparkles } from 'lucide-react';

export function SwotInput() {
  const { swotItems, addSwotItem, deleteSwotItem } = useStore();
  const [formData, setFormData] = useState({
    category: 'strength' as SwotCategory,
    text: '',
    variableType: 'stock' as VariableType,
    timeHorizon: 'medium-term' as TimeHorizon,
    politicalDimension: 'institutions' as PoliticalEconomyDimension,
    stakeholder: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    addSwotItem({
      id: `swot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
    });

    setFormData({
      ...formData,
      text: '',
      stakeholder: '',
    });
  };

  const categoryBadge: Record<SwotCategory, string> = {
    strength: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
    weakness: 'bg-red-500/10 text-red-700 ring-red-500/20',
    opportunity: 'bg-blue-500/10 text-blue-700 ring-blue-500/20',
    threat: 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
  };

  const categoryCard: Record<SwotCategory, string> = {
    strength: 'border-l-emerald-500',
    weakness: 'border-l-red-500',
    opportunity: 'border-l-blue-500',
    threat: 'border-l-amber-500',
  };

  const suggestRelationships = () => {
    alert(
      'AI suggestion feature would analyze semantic relationships between SWOT items and propose causal connections. For example: "Weak institutional capacity" (W) → "Donor dependency" (T) with opposite polarity.'
    );
  };

  const selectClass =
    'w-full px-4 py-2.5 glass-sm rounded-[var(--radius-lg)] text-foreground bg-white/60 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 appearance-none cursor-pointer';

  return (
    <div className="space-y-6 stagger-children">
      {/* Form */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl mb-1 text-foreground tracking-tight">SWOT Variable Input</h2>
            <p className="text-sm text-muted-foreground">
              Define strategic variables with systems thinking metadata
            </p>
          </div>
          <button
            onClick={suggestRelationships}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-lg)] bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI Suggest Links</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">SWOT Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as SwotCategory })}
                className={selectClass}
              >
                <option value="strength">Strength</option>
                <option value="weakness">Weakness</option>
                <option value="opportunity">Opportunity</option>
                <option value="threat">Threat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Variable Type</label>
              <select
                value={formData.variableType}
                onChange={e => setFormData({ ...formData, variableType: e.target.value as VariableType })}
                className={selectClass}
              >
                <option value="stock">Stock (accumulates over time)</option>
                <option value="flow">Flow (rate of change)</option>
                <option value="auxiliary">Auxiliary (supporting variable)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Time Horizon</label>
              <select
                value={formData.timeHorizon}
                onChange={e => setFormData({ ...formData, timeHorizon: e.target.value as TimeHorizon })}
                className={selectClass}
              >
                <option value="short-term">Short-term (&lt; 6 months)</option>
                <option value="medium-term">Medium-term (6-18 months)</option>
                <option value="long-term">Long-term (&gt; 18 months)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Political Economy Dimension
              </label>
              <select
                value={formData.politicalDimension}
                onChange={e =>
                  setFormData({
                    ...formData,
                    politicalDimension: e.target.value as PoliticalEconomyDimension,
                  })
                }
                className={selectClass}
              >
                <option value="power">Power (authority & influence)</option>
                <option value="institutions">Institutions (rules & norms)</option>
                <option value="incentives">Incentives (motivations)</option>
                <option value="resources">Resources (capacity & assets)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Variable Description</label>
            <textarea
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              placeholder="e.g., 'Weak institutional capacity for policy implementation' or 'Growing civil society engagement'"
              className="w-full px-4 py-3 glass-sm rounded-[var(--radius-lg)] text-foreground bg-white/60 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 h-24 resize-none placeholder:text-muted-foreground/60"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Stakeholder Attribution</label>
            <input
              type="text"
              value={formData.stakeholder}
              onChange={e => setFormData({ ...formData, stakeholder: e.target.value })}
              placeholder="e.g., 'Ministry of Finance', 'Local NGOs', 'Donor Community'"
              className="w-full px-4 py-2.5 glass-sm rounded-[var(--radius-lg)] text-foreground bg-white/60 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 placeholder:text-muted-foreground/60"
            />
          </div>

          <button
            type="submit"
            className="btn-glass-primary flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add SWOT Variable
          </button>
        </form>
      </div>

      {/* Variable list */}
      <div className="glass-card">
        <h3 className="mb-4 text-foreground">
          SWOT Variables{' '}
          <span className="text-muted-foreground">({swotItems.length})</span>
        </h3>

        {swotItems.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Save className="w-6 h-6 opacity-40" />
            </div>
            <p>No SWOT variables yet. Add your first variable above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {swotItems.map(item => (
              <div
                key={item.id}
                className={`p-4 glass-sm rounded-[var(--radius-lg)] border-l-4 ${categoryCard[item.category]} vibrancy transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs ring-1 ring-inset ${categoryBadge[item.category]}`}>
                        {item.category.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-muted/60 text-muted-foreground">
                        {item.variableType}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-muted/60 text-muted-foreground">
                        {item.timeHorizon}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs bg-muted/60 text-muted-foreground">
                        {item.politicalDimension}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-1">{item.text}</p>
                    {item.stakeholder && (
                      <p className="text-xs text-muted-foreground">
                        Stakeholder: {item.stakeholder}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteSwotItem(item.id)}
                    className="ml-4 p-2 rounded-[var(--radius-md)] hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-all duration-200"
                    title="Delete variable"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="glass-card bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <h4 className="text-sm text-foreground mb-2">Systems Thinking Tip</h4>
        <p className="text-sm text-muted-foreground">
          When defining variables, think about accumulations (stocks) vs. rates of change (flows).
          For example: "Institutional capacity" is a stock that accumulates, while "reform
          initiatives per year" is a flow.
        </p>
      </div>
    </div>
  );
}
