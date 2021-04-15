export const mockData = {
  nodes: [
    {
      id: '1',
      name: '默认节点1',
      label: '这是描述。。。。',
      status: '',
      type: 'flow-rect',
      nodetype: 'end',
      size: [100, 100],
      src: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ',
      x: 300,
      y: 200,
      style: {
        fill: "#ccc",
        stroke: '#12fbc'
      }
    },
    {
      id: '2',
      name: '默认节点2',
      label: '这是描述。。。。',
      status: '',
      type: 'flow-rect',
      nodetype: 'begin',
      src: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ',
      size: [100, 100],
      x: 600,
      y: 200,
    }
  ],
  edges: [
    {
      source: '1',
      target: '2',
      id: '12'
    }
  ]
};

export const defaultNodeConfig = {
  name: '默认节点',
  label: '这是描述。。。。',
  status: 'B',
  type: 'flow-rect',
  // type: 'dom-node',
  x: 600,
  y: 200,
  size: [180, 80],
  src: 'https://cdn-test.iyb.tm/static/res/iyb/cloud132881571fecab4d8fc47.jpg',
  anchorPoints: [
    [0.5, 0], // 上中
    [1, 0.5], // 右中
    [0.5, 1], // 下中
    [0, 0.5], // 左中
  ],
};

export const NodeModelMap = {
  begin: {
    ...defaultNodeConfig,
    name: '开始节点',
    nodetype: 'begin',
  },
  process: {
    ...defaultNodeConfig,
    name: '决策节点',
    nodetype: 'process',
  },
  condition: {
    ...defaultNodeConfig,
    // type: 'diamond',
    name: '条件节点',
    nodetype: 'condition',
  },
  end: {
    ...defaultNodeConfig,
    name: '结束节点',
    nodetype: 'end',
  }
};

export const colors = {
  begin: '#5B8FF9',
  process: '#F46649',
  condition: '#EEBC20',
  end: '#5BD8A6',
  DI: '#A7A7A7',
};

export const anchorList = {
  'points-left': 0,
  'points-top': 1,
  'points-right': 2,
  'points-bottom': 3,
};

//  graphConfig
export const graphConfig = {
  // data: mockData,
  data: {
    nodes: [],
    edges: [],
  },
  config: {
    padding: [20, 50],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: { default: ['drag-canvas', 'drag-node', 'edit-operate'] },
    // fitView: true,
    // animate: true,
    defaultNode: {
      type: 'flow-rect',
      // type: 'rect-xml',
    },
    defaultEdge: {
      // type: 'flow-cubic',
      type: 'cubic-horizontal',
      // type: 'polyline',
      // type: 'single-line',
      style: {
        endArrow: true,
        stroke: '#CED4D9',
        lineWidth: 5
      },
    },
    layout: {
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 300,
      getHeight: () => {
        return 60;
      },
    },
  },
};

// 锚点的位置 [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]]
export const defaultAnchorPoints = [
  [0.5, 0, {type: 'circle', shape: 'in', style: {stroke: 'red', fill: 'white'}}],
  [1, 0.5, {type: 'rect', shape: 'out', style: {stroke: 'blue', fill: 'white'}}],
  [0.5, 1, {type: 'rect', shape: 'out', style: {stroke: 'blue', fill: 'white'}}],
  [0, 0.5, {type: 'rect', shape: 'out', style: {stroke: 'blue', fill: 'white'}}]
];

// 锚点配置 - 展示
export const showLinkPoints = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  size: 12,
  lineWidth: 2,
  fill: '#fff',
  stroke: '#1890FF',
  type: 'rect',
};

// 锚点配置 - 隐藏
export const hideLinkPoints = {
  top: false,
  right: false,
  bottom: false,
  left: false,
};