import { SystemArchetype } from '../types';

export const systemArchetypes: SystemArchetype[] = [
  {
    id: 'fixes-that-fail',
    name: 'Fixes That Fail',
    description: 'A quick fix produces immediate improvement but has unintended consequences that worsen the original problem over time',
    developmentContext: 'Short-term donor projects mask governance gaps - emergency aid creates dependency rather than building local capacity',
    structuralElements: [
      'Problem Symptom',
      'Quick Fix',
      'Unintended Consequence',
      'Delay between fix and consequence'
    ],
    template: {
      nodes: [
        { label: 'Problem Symptom', category: 'weakness', nodeType: 'stock', x: 150, y: 100 },
        { label: 'Quick Fix', category: 'opportunity', nodeType: 'flow', x: 400, y: 100 },
        { label: 'Unintended Consequence', category: 'threat', nodeType: 'stock', x: 400, y: 300 }
      ],
      links: [
        { polarity: 'same', hasDelay: false },
        { polarity: 'opposite', hasDelay: false },
        { polarity: 'same', hasDelay: true }
      ]
    }
  },
  {
    id: 'shifting-the-burden',
    name: 'Shifting the Burden',
    description: 'A symptomatic solution creates side effects that undermine the fundamental solution, making the system increasingly dependent on the symptomatic fix',
    developmentContext: 'Technical capacity building vs. institutional reform - bringing in external consultants instead of reforming hiring/training systems',
    structuralElements: [
      'Problem Symptom',
      'Symptomatic Solution',
      'Fundamental Solution',
      'Side Effect'
    ],
    template: {
      nodes: [
        { label: 'Problem Symptom', category: 'weakness', nodeType: 'stock', x: 250, y: 150 },
        { label: 'Symptomatic Solution', category: 'opportunity', nodeType: 'flow', x: 100, y: 300 },
        { label: 'Fundamental Solution', category: 'strength', nodeType: 'flow', x: 400, y: 300 },
        { label: 'Side Effect', category: 'threat', nodeType: 'stock', x: 100, y: 450 }
      ],
      links: []
    }
  },
  {
    id: 'escalation',
    name: 'Escalation',
    description: 'Two parties each see their actions as defensive responses to the other, creating a reinforcing spiral of competition',
    developmentContext: 'Competitive resource allocation between agencies - Ministry A expands mandate, Ministry B retaliates, leading to duplication and turf wars',
    structuralElements: [
      'Party A Action',
      'Party B Action',
      'Relative Position',
      'Competitive Pressure'
    ],
    template: {
      nodes: [
        { label: 'Party A Action', category: 'opportunity', nodeType: 'flow', x: 150, y: 200 },
        { label: 'Party B Action', category: 'opportunity', nodeType: 'flow', x: 450, y: 200 },
        { label: 'A\'s Relative Position', category: 'strength', nodeType: 'stock', x: 150, y: 350 },
        { label: 'B\'s Relative Position', category: 'strength', nodeType: 'stock', x: 450, y: 350 }
      ],
      links: []
    }
  },
  {
    id: 'tragedy-of-the-commons',
    name: 'Tragedy of the Commons',
    description: 'Individual actors gain short-term benefits from a shared resource, but collective activity depletes the resource for everyone',
    developmentContext: 'Shared natural resource depletion - farmers over-irrigate from common aquifer, leading to water table collapse',
    structuralElements: [
      'Individual Gain',
      'Total Activity',
      'Resource Availability',
      'Net Gain per Person'
    ],
    template: {
      nodes: [
        { label: 'Individual Gain', category: 'opportunity', nodeType: 'flow', x: 150, y: 150 },
        { label: 'Total Activity', category: 'weakness', nodeType: 'stock', x: 350, y: 150 },
        { label: 'Resource Availability', category: 'strength', nodeType: 'stock', x: 350, y: 350 },
        { label: 'Net Gain per Person', category: 'weakness', nodeType: 'stock', x: 150, y: 350 }
      ],
      links: []
    }
  },
  {
    id: 'growth-and-underinvestment',
    name: 'Growth and Underinvestment',
    description: 'Growing demand creates performance pressure, but investment in capacity is delayed, leading to performance collapse',
    developmentContext: 'Infrastructure capacity vs. urban migration - cities under-invest in water/power systems, leading to service breakdown',
    structuralElements: [
      'Growth',
      'Demand',
      'Performance',
      'Investment in Capacity',
      'Capacity'
    ],
    template: {
      nodes: [
        { label: 'Demand', category: 'opportunity', nodeType: 'stock', x: 200, y: 100 },
        { label: 'Performance', category: 'strength', nodeType: 'stock', x: 400, y: 200 },
        { label: 'Capacity', category: 'weakness', nodeType: 'stock', x: 200, y: 300 },
        { label: 'Investment', category: 'opportunity', nodeType: 'flow', x: 400, y: 400 }
      ],
      links: []
    }
  },
  {
    id: 'success-to-the-successful',
    name: 'Success to the Successful',
    description: 'Two activities compete for limited resources. Success brings more resources, creating a reinforcing cycle that starves the other activity',
    developmentContext: 'Donor funding concentration on "proven" partners - successful NGOs get more funding, while struggling orgs can\'t build capacity',
    structuralElements: [
      'Success of A',
      'Success of B',
      'Resources to A',
      'Resources to B',
      'Allocation Decision'
    ],
    template: {
      nodes: [
        { label: 'Success of A', category: 'strength', nodeType: 'stock', x: 150, y: 150 },
        { label: 'Resources to A', category: 'opportunity', nodeType: 'flow', x: 150, y: 300 },
        { label: 'Success of B', category: 'weakness', nodeType: 'stock', x: 450, y: 150 },
        { label: 'Resources to B', category: 'threat', nodeType: 'flow', x: 450, y: 300 }
      ],
      links: []
    }
  },
  {
    id: 'limits-to-growth',
    name: 'Limits to Growth',
    description: 'A reinforcing growth process hits a constraint that slows and eventually stops the growth',
    developmentContext: 'Reform momentum hitting political resistance - initial reforms succeed, but threaten entrenched interests who mobilize opposition',
    structuralElements: [
      'Growing Action',
      'Performance',
      'Constraint',
      'Slowing Action'
    ],
    template: {
      nodes: [
        { label: 'Performance', category: 'strength', nodeType: 'stock', x: 200, y: 150 },
        { label: 'Growth Action', category: 'opportunity', nodeType: 'flow', x: 400, y: 150 },
        { label: 'Constraint', category: 'threat', nodeType: 'stock', x: 400, y: 300 },
        { label: 'Slowing Action', category: 'weakness', nodeType: 'flow', x: 200, y: 300 }
      ],
      links: []
    }
  },
  {
    id: 'drifting-goals',
    name: 'Drifting Goals',
    description: 'When faced with a gap between goals and actual conditions, the system responds by lowering goals rather than improving performance',
    developmentContext: 'Standards erosion under implementation pressure - service delivery targets are quietly revised downward as capacity constraints persist',
    structuralElements: [
      'Goal',
      'Actual Condition',
      'Gap',
      'Pressure to Adjust Goal',
      'Corrective Action'
    ],
    template: {
      nodes: [
        { label: 'Goal/Standard', category: 'opportunity', nodeType: 'stock', x: 150, y: 150 },
        { label: 'Actual Performance', category: 'weakness', nodeType: 'stock', x: 450, y: 150 },
        { label: 'Performance Gap', category: 'threat', nodeType: 'stock', x: 300, y: 300 },
        { label: 'Corrective Action', category: 'opportunity', nodeType: 'flow', x: 450, y: 400 }
      ],
      links: []
    }
  }
];
