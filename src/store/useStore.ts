import { create } from 'zustand';
import { SwotItem, CausalLink, CldNode, FeedbackLoop, LeveragePoint, StrategicOption } from '../types';

interface AppState {
  swotItems: SwotItem[];
  cldNodes: CldNode[];
  causalLinks: CausalLink[];
  feedbackLoops: FeedbackLoop[];
  leveragePoints: LeveragePoint[];
  strategicOptions: StrategicOption[];
  
  // SWOT actions
  addSwotItem: (item: SwotItem) => void;
  updateSwotItem: (id: string, updates: Partial<SwotItem>) => void;
  deleteSwotItem: (id: string) => void;
  
  // CLD actions
  addCldNode: (node: CldNode) => void;
  updateCldNode: (id: string, updates: Partial<CldNode>) => void;
  deleteCldNode: (id: string) => void;
  
  addCausalLink: (link: CausalLink) => void;
  updateCausalLink: (id: string, updates: Partial<CausalLink>) => void;
  deleteCausalLink: (id: string) => void;
  
  // Analysis actions
  detectFeedbackLoops: () => void;
  identifyLeveragePoints: () => void;
  generateStrategicOptions: () => void;
  
  // Utility
  clearAll: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  swotItems: [],
  cldNodes: [],
  causalLinks: [],
  feedbackLoops: [],
  leveragePoints: [],
  strategicOptions: [],
  
  addSwotItem: (item) => set((state) => ({ 
    swotItems: [...state.swotItems, item] 
  })),
  
  updateSwotItem: (id, updates) => set((state) => ({
    swotItems: state.swotItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  deleteSwotItem: (id) => set((state) => ({
    swotItems: state.swotItems.filter(item => item.id !== id),
    cldNodes: state.cldNodes.filter(node => node.swotItemId !== id)
  })),
  
  addCldNode: (node) => set((state) => ({ 
    cldNodes: [...state.cldNodes, node] 
  })),
  
  updateCldNode: (id, updates) => set((state) => ({
    cldNodes: state.cldNodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    )
  })),
  
  deleteCldNode: (id) => set((state) => ({
    cldNodes: state.cldNodes.filter(node => node.id !== id),
    causalLinks: state.causalLinks.filter(link => 
      link.sourceId !== id && link.targetId !== id
    )
  })),
  
  addCausalLink: (link) => set((state) => ({ 
    causalLinks: [...state.causalLinks, link] 
  })),
  
  updateCausalLink: (id, updates) => set((state) => ({
    causalLinks: state.causalLinks.map(link => 
      link.id === id ? { ...link, ...updates } : link
    )
  })),
  
  deleteCausalLink: (id) => set((state) => ({
    causalLinks: state.causalLinks.filter(link => link.id !== id)
  })),
  
  detectFeedbackLoops: () => {
    const { cldNodes, causalLinks } = get();
    const loops: FeedbackLoop[] = [];
    
    // Simple cycle detection algorithm
    const adjacencyMap = new Map<string, string[]>();
    causalLinks.forEach(link => {
      if (!adjacencyMap.has(link.sourceId)) {
        adjacencyMap.set(link.sourceId, []);
      }
      adjacencyMap.get(link.sourceId)!.push(link.targetId);
    });
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const currentPath: string[] = [];
    
    const dfs = (nodeId: string): void => {
      visited.add(nodeId);
      recursionStack.add(nodeId);
      currentPath.push(nodeId);
      
      const neighbors = adjacencyMap.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        } else if (recursionStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = currentPath.indexOf(neighbor);
          const cycle = currentPath.slice(cycleStart);
          
          // Calculate loop polarity
          let negativeCount = 0;
          for (let i = 0; i < cycle.length; i++) {
            const current = cycle[i];
            const next = cycle[(i + 1) % cycle.length];
            const link = causalLinks.find(l => 
              l.sourceId === current && l.targetId === next
            );
            if (link?.polarity === 'opposite') negativeCount++;
          }
          
          const loopType = negativeCount % 2 === 0 ? 'reinforcing' : 'balancing';
          
          loops.push({
            id: `loop-${loops.length + 1}`,
            nodes: [...cycle],
            type: loopType,
            description: `${loopType === 'reinforcing' ? 'Reinforcing' : 'Balancing'} loop involving ${cycle.length} variables`
          });
        }
      }
      
      currentPath.pop();
      recursionStack.delete(nodeId);
    };
    
    cldNodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
      }
    });
    
    set({ feedbackLoops: loops });
  },
  
  identifyLeveragePoints: () => {
    const { cldNodes, causalLinks, feedbackLoops } = get();
    const points: LeveragePoint[] = [];
    
    // Calculate centrality (number of connections)
    const connectionCount = new Map<string, number>();
    causalLinks.forEach(link => {
      connectionCount.set(link.sourceId, (connectionCount.get(link.sourceId) || 0) + 1);
      connectionCount.set(link.targetId, (connectionCount.get(link.targetId) || 0) + 1);
    });
    
    // High-impact nodes (high centrality in reinforcing loops)
    cldNodes.forEach(node => {
      const connections = connectionCount.get(node.id) || 0;
      const inReinforcingLoop = feedbackLoops.some(loop => 
        loop.type === 'reinforcing' && loop.nodes.includes(node.id)
      );
      
      if (connections >= 3 && inReinforcingLoop) {
        points.push({
          id: `lp-${points.length + 1}`,
          nodeId: node.id,
          impact: 'high',
          type: 'loop-breaker',
          description: `High-leverage intervention point: Breaking the reinforcing dynamic at "${node.label}" can shift system behavior`
        });
      }
      
      // Delay-sensitive variables
      const hasDelayedLink = causalLinks.some(link => 
        (link.sourceId === node.id || link.targetId === node.id) && link.hasDelay
      );
      
      if (hasDelayedLink) {
        points.push({
          id: `lp-${points.length + 1}`,
          nodeId: node.id,
          impact: 'medium',
          type: 'delay-sensitive',
          description: `Time-sensitive variable: Early action on "${node.label}" is critical due to delay effects`
        });
      }
    });
    
    set({ leveragePoints: points });
  },
  
  generateStrategicOptions: () => {
    const { leveragePoints, cldNodes, feedbackLoops } = get();
    const options: StrategicOption[] = [];
    
    leveragePoints.forEach(point => {
      const node = cldNodes.find(n => n.id === point.nodeId);
      if (!node) return;
      
      if (point.type === 'loop-breaker') {
        options.push({
          id: `option-${options.length + 1}`,
          title: `Interrupt Reinforcing Dynamic at ${node.label}`,
          description: `Introduce a balancing mechanism to stabilize the reinforcing feedback loop. This could involve creating accountability structures, resource caps, or counter-incentives that prevent runaway effects.`,
          leveragePoints: [point.id],
          politicalEconomy: {
            powerAlignment: 'Requires coalition of stakeholders benefiting from system stability',
            institutionalCapacity: 'Medium - needs monitoring and enforcement mechanisms',
            timeHorizon: 'Medium-term (6-18 months for visible effects)',
            stakeholderCoalition: 'Build alliance between reform champions and those experiencing negative externalities'
          },
          feasibility: 'medium'
        });
      }
      
      if (point.type === 'delay-sensitive') {
        options.push({
          id: `option-${options.length + 1}`,
          title: `Early Investment in ${node.label}`,
          description: `Address this critical bottleneck before delays compound. Delays in this variable create system-wide ripple effects, so proactive capacity building is essential.`,
          leveragePoints: [point.id],
          politicalEconomy: {
            powerAlignment: 'May face resistance from short-term oriented actors',
            institutionalCapacity: 'High - requires sustained investment and long-term commitment',
            timeHorizon: 'Long-term (18+ months before results materialize)',
            stakeholderCoalition: 'Engage future-oriented stakeholders and technical experts'
          },
          feasibility: 'low'
        });
      }
    });
    
    // Generate options based on archetype patterns
    const reinforcingLoops = feedbackLoops.filter(l => l.type === 'reinforcing');
    const balancingLoops = feedbackLoops.filter(l => l.type === 'balancing');
    
    if (reinforcingLoops.length > balancingLoops.length) {
      options.push({
        id: `option-${options.length + 1}`,
        title: 'Strengthen Balancing Feedback Mechanisms',
        description: `The system is dominated by reinforcing loops (${reinforcingLoops.length} reinforcing vs ${balancingLoops.length} balancing). Add self-correcting mechanisms such as performance reviews, stakeholder consultation processes, or adaptive management frameworks.`,
        leveragePoints: [],
        politicalEconomy: {
          powerAlignment: 'Requires buy-in from those currently benefiting from unchecked growth',
          institutionalCapacity: 'Medium - needs new governance structures',
          timeHorizon: 'Medium-term (12-24 months)',
          stakeholderCoalition: 'Form coalition around sustainable development principles'
        },
        feasibility: 'medium'
      });
    }
    
    set({ strategicOptions: options });
  },
  
  clearAll: () => set({
    swotItems: [],
    cldNodes: [],
    causalLinks: [],
    feedbackLoops: [],
    leveragePoints: [],
    strategicOptions: []
  })
}));
