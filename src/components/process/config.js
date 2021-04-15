export const SOURCE_NODE_DATA = [
  {
    id: 'begin',
    type: 'rect',
    shape: 'rect',
    label: '开始',
    style: {
      radius: 15,
    },
    x: 150,
    y: 150,
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
    isSource: true,
    customAttributes: {
      nodeType: 'begin',
    }
  },
  {
    id: 'execute',
    type: 'rect',
    shape: 'rect',
    label: '流程',
    x: 150,
    y: 250,
    isSource: true,
    customAttributes: {
      nodeType: 'process',
    },
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
  },
  {
    id: 'contain',
    type: 'diamond',
    shape: 'diamond',
    label: '条件',
    size: [100, 60],
    x: 150,
    y: 350,
    style: {
      radius: 10,
    },
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
    isSource: true,
    customAttributes: {
      nodeType: 'condition',
    }
  },
  {
    id: 'end',
    type: 'rect',
    shape: 'rect',
    label: '结束',
    style: {
      radius: 15,
    },
    x: 150,
    y: 450,
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
    isSource: true,
    customAttributes: {
      nodeType: 'end',
    }
  },
  {
    id: 'ellipse',
    type: 'ellipse',
    shape: 'ellipse',
    label: 'ellipse',
    style: {
      radius: 15,
    },
    x: 150,
    y: 550,
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
    isSource: true,
    customAttributes: {
      nodeType: 'ellipse',
    }
  },
  {
    id: 'triangle',
    type: 'triangle',
    shape: 'triangle',
    style: {
      radius: 15,
    },
    x: 150,
    y: 650,
    stateStyles: {
      hover: {
        fill: '#d3adf7',
        fontSize: 20,
      },
    },
    isSource: true,
    customAttributes: {
      nodeType: 'triangle',
    }
  },
];

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
  // type: 'rect',
};

// 锚点配置 - 隐藏
export const hideLinkPoints = {
  top: false,
  right: false,
  bottom: false,
  left: false,
};