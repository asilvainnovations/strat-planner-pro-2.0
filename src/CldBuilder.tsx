import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CldNode, CausalLink, SwotCategory } from '../types';
import { Plus, Trash2, RefreshCw, Info } from 'lucide-react';

export function CldBuilder() {
  const {
    swotItems,
    cldNodes,
    causalLinks,
    feedbackLoops,
    addCldNode,
    updateCldNode,
    deleteCldNode,
    addCausalLink,
    deleteCausalLink,
    detectFeedbackLoops,
  } = useStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const categoryColors: Record<SwotCategory, { bg: string; border: string; accent: string }> = {
    strength: { bg: 'bg-emerald-100/80', border: 'border-emerald-500', accent: 'ring-emerald-400/40' },
    weakness: { bg: 'bg-red-100/80', border: 'border-red-500', accent: 'ring-red-400/40' },
    opportunity: { bg: 'bg-blue-100/80', border: 'border-blue-500', accent: 'ring-blue-400/40' },
    threat: { bg: 'bg-amber-100/80', border: 'border-amber-500', accent: 'ring-amber-400/40' },
  };

  const addNodeFromSwot = (swotItemId: string) => {
    const swotItem = swotItems.find(s => s.id === swotItemId);
    if (!swotItem) return;

    const newNode: CldNode = {
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      swotItemId,
      label: swotItem.text.slice(0, 50),
      category: swotItem.category,
      nodeType: swotItem.variableType === 'decision' ? 'decision' : swotItem.variableType,
      x: 200 + Math.random() * 300,
      y: 200 + Math.random() * 200,
    };

    addCldNode(newNode);
    setShowNodeDialog(false);
  };

  const handleNodeClick = (nodeId: string) => {
    if (linkingMode) {
      if (!linkSource) {
        setLinkSource(nodeId);
      } else if (linkSource !== nodeId) {
        const newLink: CausalLink = {
          id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: linkSource,
          targetId: nodeId,
          polarity: 'same',
          hasDelay: false,
        };
        addCausalLink(newLink);
        setLinkSource(null);
        setLinkingMode(false);
      }
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  const toggleLinkPolarity = (linkId: string) => {
    const link = causalLinks.find(l => l.id === linkId);
    if (link) {
      const store = useStore.getState();
      store.updateCausalLink(linkId, {
        polarity: link.polarity === 'same' ? 'opposite' : 'same',
      });
    }
  };

  const toggleLinkDelay = (linkId: string) => {
    const link = causalLinks.find(l => l.id === linkId);
    if (link) {
      const store = useStore.getState();
      store.updateCausalLink(linkId, { hasDelay: !link.hasDelay });
    }
  };

  useEffect(() => {
    if (causalLinks.length > 0 && cldNodes.length > 0) {
      detectFeedbackLoops();
    }
  }, [causalLinks.length, cldNodes.length]);

  return (
    <div className="space-y-6 stagger-children">
      {/* Header & toolbar */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl mb-1 text-foreground tracking-tight">
              Causal Loop Diagram Builder
            </h2>
            <p className="text-sm text-muted-foreground">
              Map relationships between SWOT variables
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowNodeDialog(!showNodeDialog)}
              className="btn-glass-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Node
            </button>
            <button
              onClick={() => {
                setLinkingMode(!linkingMode);
                setLinkSource(null);
              }}
              className={`btn-glass flex items-center gap-2 text-sm ${
                linkingMode
                  ? 'bg-purple-500/15 text-purple-700'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {linkingMode ? 'Cancel Linking' : 'Create Link'}
            </button>
            <button
              onClick={detectFeedbackLoops}
              className="btn-glass flex items-center gap-2 text-sm text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Detect Loops
            </button>
          </div>
        </div>

        {/* Node selector panel */}
        {showNodeDialog && (
          <div className="mb-6 p-5 glass-sm rounded-[var(--radius-lg)] animate-scale-in">
            <h3 className="text-sm mb-3 text-foreground">Select SWOT Variable to Add</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {swotItems
                .filter(item => !cldNodes.some(n => n.swotItemId === item.id))
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => addNodeFromSwot(item.id)}
                    className={`p-3 text-left rounded-[var(--radius-lg)] border-2 transition-all duration-200 hover:shadow-[var(--shadow-md)] ${categoryColors[item.category].bg} ${categoryColors[item.category].border}`}
                  >
                    <span className="text-xs px-2 py-1 bg-white/70 rounded-full">
                      {item.category.toUpperCase()}
                    </span>
                    <p className="text-sm mt-2 text-foreground">{item.text.slice(0, 100)}</p>
                  </button>
                ))}
              {swotItems.length === cldNodes.length && (
                <p className="text-sm text-muted-foreground col-span-2 text-center py-4">
                  All SWOT variables have been added to the diagram
                </p>
              )}
            </div>
          </div>
        )}

        {/* Linking mode indicator */}
        {linkingMode && linkSource && (
          <div className="mb-4 p-3 glass-sm rounded-[var(--radius-lg)] bg-purple-500/5 animate-fade-in">
            <p className="text-sm text-purple-700">
              Linking mode: Click target node to create causal link from "
              {cldNodes.find(n => n.id === linkSource)?.label.slice(0, 30)}..."
            </p>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative rounded-[var(--radius-xl)] glass-sm overflow-hidden"
          style={{ height: '600px' }}
        >
          {/* Links SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {causalLinks.map(link => {
              const source = cldNodes.find(n => n.id === link.sourceId);
              const target = cldNodes.find(n => n.id === link.targetId);
              if (!source || !target) return null;

              const dx = target.x - source.x;
              const dy = target.y - source.y;
              const angle = Math.atan2(dy, dx);
              const targetRadius = 40;
              const arrowX = target.x - Math.cos(angle) * targetRadius;
              const arrowY = target.y - Math.sin(angle) * targetRadius;
              const color = link.polarity === 'same' ? '#3b82f6' : '#ef4444';

              return (
                <g key={link.id}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={arrowX}
                    y2={arrowY}
                    stroke={color}
                    strokeWidth="2"
                    markerEnd={`url(#arrow-${link.polarity})`}
                    strokeDasharray={link.hasDelay ? '5,5' : '0'}
                    opacity={0.7}
                  />
                  {link.hasDelay && (
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 10}
                      fill="#64748b"
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="Inter"
                    >
                      delay
                    </text>
                  )}
                  <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 + 5}
                    fill={color}
                    fontSize="14"
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="Inter"
                  >
                    {link.polarity === 'same' ? '+' : '\u2212'}
                  </text>
                </g>
              );
            })}
            <defs>
              <marker
                id="arrow-same"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
              </marker>
              <marker
                id="arrow-opposite"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {cldNodes.map(node => {
            const nodeShape =
              node.nodeType === 'stock' ? 'circle' : node.nodeType === 'flow' ? 'rect' : 'diamond';
            const isInLoop = feedbackLoops.some(loop => loop.nodes.includes(node.id));

            return (
              <div
                key={node.id}
                className={`absolute cursor-pointer transition-all duration-200 ${categoryColors[node.category].bg} border-2 ${categoryColors[node.category].border} ${
                  selectedNode === node.id ? `ring-4 ${categoryColors[node.category].accent}` : ''
                } ${isInLoop ? 'shadow-[var(--shadow-lg)]' : 'shadow-[var(--shadow-md)]'} hover:shadow-[var(--shadow-xl)]`}
                style={{
                  left: `${node.x - 40}px`,
                  top: `${node.y - 40}px`,
                  width: nodeShape === 'diamond' ? '90px' : '80px',
                  height: nodeShape === 'diamond' ? '90px' : '80px',
                  borderRadius: nodeShape === 'circle' ? '50%' : nodeShape === 'rect' ? 'var(--radius-lg)' : '0',
                  transform: nodeShape === 'diamond' ? 'rotate(45deg)' : 'none',
                  zIndex: selectedNode === node.id ? 10 : 2,
                  backdropFilter: 'blur(8px)',
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                <div
                  className="flex items-center justify-center h-full p-2"
                  style={{
                    transform: nodeShape === 'diamond' ? 'rotate(-45deg)' : 'none',
                  }}
                >
                  <p className="text-xs text-center leading-tight text-foreground">
                    {node.label.slice(0, 40)}
                  </p>
                </div>
                {selectedNode === node.id && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteCldNode(node.id);
                      setSelectedNode(null);
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 z-20 shadow-[var(--shadow-md)] transition-all duration-200"
                    style={{
                      transform: nodeShape === 'diamond' ? 'rotate(-45deg)' : 'none',
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {cldNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Info className="w-6 h-6 text-muted-foreground opacity-50" />
                </div>
                <p className="text-muted-foreground">
                  Add SWOT variables to start building your causal loop diagram
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-5 text-sm flex-wrap">
          {[
            { label: 'Strength', bg: 'bg-emerald-200', border: 'border-emerald-500' },
            { label: 'Weakness', bg: 'bg-red-200', border: 'border-red-500' },
            { label: 'Opportunity', bg: 'bg-blue-200', border: 'border-blue-500' },
            { label: 'Threat', bg: 'bg-amber-200', border: 'border-amber-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-5 h-5 ${item.bg} border-2 ${item.border} rounded-full`} />
              <span className="text-muted-foreground text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Causal links list */}
      {causalLinks.length > 0 && (
        <div className="glass-card">
          <h3 className="mb-4 text-foreground">
            Causal Links <span className="text-muted-foreground">({causalLinks.length})</span>
          </h3>
          <div className="space-y-2">
            {causalLinks.map(link => {
              const source = cldNodes.find(n => n.id === link.sourceId);
              const target = cldNodes.find(n => n.id === link.targetId);
              if (!source || !target) return null;

              return (
                <div
                  key={link.id}
                  className="p-3 glass-sm rounded-[var(--radius-lg)] flex items-center justify-between transition-all duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span>{source.label.slice(0, 30)}</span>
                      <span
                        className={`mx-2 px-2.5 py-1 rounded-full text-xs ${
                          link.polarity === 'same'
                            ? 'bg-blue-500/10 text-blue-700'
                            : 'bg-red-500/10 text-red-700'
                        }`}
                      >
                        {link.polarity === 'same' ? '+ (same)' : '\u2212 (opposite)'}
                      </span>
                      <span>{target.label.slice(0, 30)}</span>
                      {link.hasDelay && (
                        <span className="ml-2 text-xs text-muted-foreground">with delay</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleLinkPolarity(link.id)}
                      className="px-3 py-1.5 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 text-xs transition-all duration-200"
                    >
                      Toggle Polarity
                    </button>
                    <button
                      onClick={() => toggleLinkDelay(link.id)}
                      className="px-3 py-1.5 rounded-[var(--radius-md)] bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 text-xs transition-all duration-200"
                    >
                      {link.hasDelay ? 'Remove Delay' : 'Add Delay'}
                    </button>
                    <button
                      onClick={() => deleteCausalLink(link.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-[var(--radius-md)] transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback loops */}
      {feedbackLoops.length > 0 && (
        <div className="glass-card">
          <h3 className="mb-4 text-foreground">
            Detected Feedback Loops{' '}
            <span className="text-muted-foreground">({feedbackLoops.length})</span>
          </h3>
          <div className="space-y-3">
            {feedbackLoops.map(loop => (
              <div
                key={loop.id}
                className={`p-4 rounded-[var(--radius-lg)] border-l-4 glass-sm ${
                  loop.type === 'reinforcing'
                    ? 'bg-amber-500/5 border-l-amber-500'
                    : 'bg-emerald-500/5 border-l-emerald-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          loop.type === 'reinforcing'
                            ? 'bg-amber-500/15 text-amber-700'
                            : 'bg-emerald-500/15 text-emerald-700'
                        }`}
                      >
                        {loop.type === 'reinforcing' ? 'R' : 'B'} - {loop.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {loop.nodes.length} variables
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{loop.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {loop.nodes.map((nodeId, idx) => {
                        const node = cldNodes.find(n => n.id === nodeId);
                        return node ? (
                          <span
                            key={nodeId}
                            className="text-xs px-2 py-1 glass-sm rounded-full text-foreground"
                          >
                            {idx > 0 && '\u2192 '}
                            {node.label.slice(0, 20)}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 glass-sm rounded-[var(--radius-lg)] bg-blue-500/5">
            <p className="text-sm text-foreground">
              <strong>R (Reinforcing)</strong> loops amplify change - they can create virtuous or
              vicious cycles.
              <strong className="ml-2">B (Balancing)</strong> loops resist change - they create
              stability and self-correction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
