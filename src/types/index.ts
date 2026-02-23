export type SwotCategory = 'strength' | 'weakness' | 'opportunity' | 'threat';
export type VariableType = 'stock' | 'flow' | 'auxiliary';
export type TimeHorizon = 'short-term' | 'medium-term' | 'long-term';
export type PoliticalEconomyDimension = 'power' | 'institutions' | 'incentives' | 'resources';
export type Polarity = 'same' | 'opposite';
export type LoopType = 'reinforcing' | 'balancing';
export type NodeType = 'stock' | 'flow' | 'decision';

export interface SwotItem {
  id: string;
  category: SwotCategory;
  text: string;
  variableType: VariableType;
  timeHorizon: TimeHorizon;
  politicalDimension: PoliticalEconomyDimension;
  stakeholder: string;
}

export interface CausalLink {
  id: string;
  sourceId: string;
  targetId: string;
  polarity: Polarity;
  hasDelay: boolean;
  description?: string;
}

export interface CldNode {
  id: string;
  swotItemId?: string;
  label: string;
  category: SwotCategory;
  nodeType: NodeType;
  x: number;
  y: number;
}

export interface FeedbackLoop {
  id: string;
  nodes: string[];
  type: LoopType;
  description: string;
}

export interface SystemArchetype {
  id: string;
  name: string;
  description: string;
  developmentContext: string;
  structuralElements: string[];
  template: {
    nodes: Omit<CldNode, 'id'>[];
    links: Omit<CausalLink, 'id' | 'sourceId' | 'targetId'>[];
  };
}

export interface LeveragePoint {
  id: string;
  nodeId: string;
  impact: 'high' | 'medium' | 'low';
  type: 'loop-breaker' | 'delay-sensitive' | 'polarity-reversal';
  description: string;
}

export interface StrategicOption {
  id: string;
  title: string;
  description: string;
  leveragePoints: string[];
  politicalEconomy: {
    powerAlignment: string;
    institutionalCapacity: string;
    timeHorizon: string;
    stakeholderCoalition: string;
  };
  feasibility: 'high' | 'medium' | 'low';
}
