import React from 'react';
import { Col, Row, Space, Button, Modal, Input, Select, Card } from 'antd';

import { CloseOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import G6 from '@antv/g6';
import { v4 as uuidv4 } from 'uuid';
import styles from './style.css';
import {
  SOURCE_NODE_DATA,
  defaultAnchorPoints,
  showLinkPoints,
  hideLinkPoints,
} from './config';

const Option = Select.Option;

class Process extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      operateMode: 'default',
      data: {
        nodes: SOURCE_NODE_DATA,
        edges: {},
      },
      operationModalVisible: false,
      operateInfo: {},
      graphWidth: 1000,
      graphHeight: 800,
      detailNodeModal: false,
      detailEdgeModal: false,
      details: {},
    };
  }
  componentDidMount() {
    // 初始化G6的自定义事件
    this.initBehavior();
    // G6的graph实例需要DOM容器渲染完成才能使用，放在componentDidMount中
    this.renderGraph();
  }

  changeMode = (operateMode = 'default') => {
    this.setState({
      operateMode,
      detailNodeModal: false,
      detailEdgeModal: false,
      details: {},
    });
    this.graph.setMode(operateMode);
  };

  initBehavior = () => {
    const _this = this;
    G6.registerBehavior('detail-operate', {
      getEvents() {
        return {
          'node:click': 'nodeDetails',
          'edge:click': 'edgeDetails',
          'node:mouseenter': 'highLightNode',
          'node:mouseleave': 'showDefaultNode',
          'edge:mouseenter': 'highLightEdge',
          'edge:mouseleave': 'showDefaultEdge',
        };
      },

      // 详情模式下单击节点：查看此节点详细信息
      nodeDetails(e) {
        const { item = {} } = e;
        const model = item.getModel();
        console.info('model==>>', model);
        console.info('item==>>', item);
        _this.setState({
          detailEdgeModal: false,
          detailNodeModal: true,
          details: item._cfg,
        });
      },

      // 详情模式下单击边：查看此边详细信息
      edgeDetails(e) {
        const { item = {} } = e;
        const model = item.getModel();
        _this.setState({
          detailNodeModal: false,
          detailEdgeModal: true,
          details: model,
        });
      },

      // 详情模式下移入节点：高亮
      highLightNode(e) {
        const { item = {} } = e;
        const isSourceNode = _this.isSourceNode(item);
        if (!isSourceNode) {
          _this.graph.updateItem(item, {
            style: {
              fill: '#d3adf7',
            },
          });
        }
      },

      // 详情模式下移出节点：默认
      showDefaultNode(e) {
        const { item = {} } = e;
        const isSourceNode = _this.isSourceNode(item);
        if (!isSourceNode) {
          _this.graph.updateItem(item, {
            style: {
              fill: '#C6E5FF',
            },
          });
        }
      },

      // 边高亮
      highLightEdge(e) {
        const { item = {} } = e;
        this.graph.updateItem(item, {
          style: {
            lineWidth: 3,
            stroke: '#d3adf7',
          },
        });
      },

      showDefaultEdge(e) {
        const { item = {} } = e;
        this.graph.updateItem(item, {
          style: {
            lineWidth: 2,
            stroke: '#aaa',
          },
        });
      },
    });

    G6.registerBehavior('edit-operate', {
      // 设定编辑模式下的节点操作
      getEvents() {
        return {
          'node:dragstart': 'moveNode',
          'node:drag': 'dragNode',
          'node:dragend': 'canNodeHere',
          'node:mouseenter': 'mouseEnterNode',
          'node:mouseleave': 'mouseLeaveNode',
          'edge:mouseenter': 'mouseEnterEdge',
          'edge:mouseleave': 'mouseLeaveEdge',
          'node:click': 'clickNodeEdit',
          'node:dblclick': 'editNodeDetails',
          'mousemove': 'connectEdge',
          'edge:click': 'onEdgeClick',
          'edge:dblclick': 'removeEdge',
        };
      },

      // 编辑模式下开始拖拽节点：判断是否为源节点，如果是源节点则拖出一个新节点，否则仅移动
      moveNode(e) {
        const { item = {} } = e;
        const isSourceNode = _this.isSourceNode(item);
        if (isSourceNode) {
          // 记住源节点的位置
          const { x, y } = item.getModel();
          _this.setState({ x, y });
        }
      },

      // 编辑模式下拖拽节点
      dragNode() {},

      // 编辑模式下放开节点：判断是否在画布中，如果不是则扩大画布
      // 如果拖拽的是源节点，则新增一个节点
      canNodeHere(e) {
        const { canvasX, canvasY, item = {} } = e;
        const graphWidth = _this.graph.cfg && _this.graph.cfg.width;
        const graphHeight = _this.graph.cfg && _this.graph.cfg.height;
        if (canvasX + 100 > graphWidth || canvasY + 100 > graphHeight) {
          _this.graph.changeSize(canvasX > graphWidth ? canvasX + 100 : graphWidth, canvasY > graphHeight ? canvasY + 100 : graphHeight);
          // console.log(canvasX, canvasY, graphWidth, graphHeight);
          _this.setState({
            graphHeight: _this.graph.cfg.height,
            graphWidth: _this.graph.cfg.width,
          });
        }
        const isSourceNode = _this.isSourceNode(item);
        if (isSourceNode) {
          const { x, y } = _this.state;
          const model = item.getModel();
          const { id, ...newNode } = model;
          const nodeType = model.customAttributes.nodeType;
          newNode.id = uuidv4();
          newNode.isSource = false;
          _this.graph.updateItem(id, { x, y });

          // 开始节点 只能有一个
          if (nodeType === 'begin') {
            const allNodes = _this.graph.getNodes()
            const modelList = allNodes.map((node) => {
              return node.getModel();
            });
            const hasBeginNode = modelList.find(model => !model.isSource && model.customAttributes.nodeType === 'begin');
            if (hasBeginNode) return null;
          }
          // 结束节点 只能有一个
          if (nodeType === 'end') {
            const allNodes = _this.graph.getNodes()
            const modelList = allNodes.map((node) => {
              return node.getModel();
            });
            const hasEndnNode = modelList.find(model => !model.isSource && model.customAttributes.nodeType === 'end');
            if (hasEndnNode) return null;
          }
          // x轴方向大于 300 可添加节点
          if (canvasX > 300) {
            _this.graph.addItem('node', newNode);
            _this.graph.setItemState(newNode.id, 'isSource', false);
          }
        }
      },

      // 编辑模式下鼠标移过节点：判断是否为源节点，如果不是源节点则显示锚点位置和操作指引
      mouseEnterNode(e) {
        const { item = {} } = e;
        _this.graph.setItemState(item, 'hover', true);
        const isSourceNode = _this.isSourceNode(item);
        if (!isSourceNode) {
          _this.showNodeOperation(item);
        }
      },

      // 编辑模式下鼠标移出节点：隐藏锚点和操作指引
      mouseLeaveNode(e) {
        const { item = {} } = e;
        _this.hideLinkPoints(item);
        _this.graph.setItemState(item, 'hover', false);
      },

      // 编辑模式下鼠标移过边
      mouseEnterEdge(e) {
        const { item = {} } = e;
        _this.graph.setItemState(item, 'hover', true);
      },

      // 编辑模式下鼠标移出边
      mouseLeaveEdge(e) {
        const { item = {} } = e;
        _this.graph.setItemState(item, 'hover', false);
      },

      // 编辑模式下点击节点：不是源节点且是锚点，则可以拉出连线，否则无效
      clickNodeEdit(e) {
        console.log('e==>>', e);
        const { item = {} } = e;
        const isSourceNode = _this.isSourceNode(item);
        const isClickAnchorPoint = _this.isClickAnchorPoint(e);
        if (!isSourceNode && isClickAnchorPoint) {
          // 开启一条连线
          _this.clickAnchorPoint(e);
        }
      },

      // 编辑模式下双击节点：显示内容编辑框
      editNodeDetails(e) {
        const { item = {} } = e;
        const isSourceNode = _this.isSourceNode(item);
        const model = item.getModel();

        if (!isSourceNode) {
          _this.setState({
            operateInfo: model,
            operationModalVisible: true,
          });
        }
      },

      connectEdge(e) {
        // 当前鼠标移过的位置
        const point = { x: e.x, y: e.y };
        if (_this.addingEdge && _this.edge) {
          if (_this.addingEdge && _this.edge) {
            _this.graph.updateItem(_this.edge, {
              target: point
            });
          }
        }
      },

      onEdgeClick(e) {
        const currentEdge = e.item;
        if (_this.addingEdge && _this.edge === currentEdge) {
          _this.graph.removeItem(_this.edge);
          _this.edge = null;
          _this.addingEdge = false;
        }
      },

      removeEdge(e) {
        const { item } = e;
        _this.graph.removeItem(item);
      },

    });
  };

  // 判断是否为源节点
  isSourceNode = (item) => {
    const model = item.getModel();
    if (model.isSource) {
      return true;
    } else {
      return false;
    }
  };

  isClickAnchorPoint = (e) => {
    // 判断是否点击锚点
    const { item = {}, canvasX, canvasY } = e;
    const anchorPointSize = 8;
    const anchorPoints = item.getLinkPoint({ x: canvasX, y: canvasY });
    if (canvasX < anchorPoints.x + anchorPointSize && canvasX > anchorPoints.x - anchorPointSize && canvasY < anchorPoints.y + anchorPointSize && canvasY > anchorPoints.y - anchorPointSize) {
      return true;
    } else {
      return false;
    }
  };

  // 是否两个锚点间已有一条边或者自身
  checkEdge = (targetModel) => {
    // 起始点和目标点id
    const sourceId = this.edge.getModel().source;
    const targetId = targetModel.id;
    if (sourceId === targetId) {
      return false;
    }
    const edges = this.graph.getEdges();
    let flag = true;
    edges.forEach((item) => { // eslint-disable-line
      // 已有的起始点和目标点
      if (item._cfg.targetNode) {
        const { source } = item.getModel();
        const { target } = item.getModel();
        if ((source === sourceId && target === targetId) || (source === targetId && target === sourceId)) {
          // 两个节点之间已有连线
          flag = false;
        }
      }
    });
    return flag;
  };

  showNodeOperation = (item) => {
    const { _cfg = {} } = item;
    const { id, ...updateNode } = _cfg.model;
    updateNode.id = id;
    // 增加连线锚点
    updateNode.anchorPoints = defaultAnchorPoints;
    updateNode.linkPoints = showLinkPoints;
    // 增加移动光标
    updateNode.style = {
      ...updateNode.style,
      cursor: 'move',
    };
    this.graph.updateItem(id, updateNode);
  };

  hideLinkPoints = (item) => {
    const { _cfg = {} } = item;
    const { id, linkPoints, ...updateNode } = _cfg.model;
    updateNode.linkPoints = hideLinkPoints;
    this.graph.updateItem(id, updateNode);
  };

  // 点击了锚点，开启一条连线
  clickAnchorPoint = (e) => {
    const { item = {}, canvasX, canvasY } = e;
    // 获取点击位置最近的锚点作为起始点
    const point = { x: e.x, y: e.y };
    const model = item.getModel();
    if (this.addingEdge && this.edge) {
      // 校验source和target之间是否已有一条边或者自身
      const isOk = this.checkEdge(model);
      if (isOk) {
        const endPointIndex = item.getLinkPoint({ x: canvasX, y: canvasY }).anchorIndex; // 结束点的锚点序号
        this.graph.updateItem(this.edge, {
          target: model.id,
          targetAnchor: endPointIndex,
        });
        // 已经正在连线
        this.addingEdge = false;
      } else {
        // 这两个之间已有一条边或者自身，无法重复连接
        const removeEdgeId = this.edge._cfg.id;
        this.graph.removeItem(removeEdgeId);
        this.addingEdge = false;
      }
    } else {
      // 新增一条连线
      const startPointIndex = item.getLinkPoint({ x: canvasX, y: canvasY }).anchorIndex;
      this.edge = this.graph.addItem('edge', {
        // type: 'polyline', // 折线
        type: 'cubic-vertical', // 贝塞尔曲线（垂直的）
        source: model.id,
        target: point,
        sourceAnchor: startPointIndex,
        lineAppendWidth: 18,
        style: {
          endArrow: true,
          lineWidth: 2,
          stroke: '#aaa',
        },
        // label: '这是label',
        // 控制键
        stateStyles: {
          hover: {
            stroke: '#d3adf7',
            lineWidth: 4,
            shadowColor: 'yellow',
          },
        },
      });
      this.addingEdge = true;
      // this.currentNode = model.id;
    }
  };

  quitNodeDetails = () => {
    this.setState({
      operateInfo: {},
      operationModalVisible: false,
    });
  };

  save = () => {
    console.log('查看数据=====>>>>>>');
    console.log('this.graph=======>>>>>>', this.graph);
    console.log('当前数据==========>>>>>>', this.graph.save());
  };

  handleChange = (e) => {
    const { operateInfo } = this.state;
    const result = operateInfo;
    const id = operateInfo.id;
    result.label = e.target.value;
    this.graph.updateItem(id, result);
    this.setState({
      operateInfo: result,
    });
  };

  conditionChange = (e, type) => {
    const { operateInfo } = this.state;
    const result = operateInfo;
    const id = operateInfo.id;
    result[type] = e.target.value;
    this.graph.updateItem(id, result);
    this.setState({
      operateInfo: result,
    });
  };

  removeNode = () => {
    const { operateInfo } = this.state;
    const id = operateInfo.id;
    this.graph.removeItem(id);
    this.quitNodeDetails();
  };

  renderGraph = () => {
    // 渲染整个画布
    const { data } = this.state;
    const graph = new G6.Graph({
      container: 'mountNode',
      width: 1500,
      height: 1000,
      modes: {
        // 默认模式
        default: ['drag-node', 'edit-operate'],
        detail: ['detail-operate', 'drag-node'],
      },
    });

    graph.data(data);
    graph.render();
    this.graph = graph;
  };

  render() {
    const { operateMode = 'default', operateInfo = {}, operationModalVisible, graphHeight, graphWidth, detailNodeModal, detailEdgeModal, details } = this.state;
    return (
      <div>
        <div className={styles['operation-mode']}>
          <span>操作模式：</span>
          <Select
            value={operateMode}
            style={{ width: 200 }}
            onChange={this.changeMode}
          >
            <Option key="default" value="default">编辑模式</Option>
            <Option key="detail" value="detail">查看模式</Option>
          </Select>
          <Button type="primary" onClick={this.save} style={{ marginLeft: 80 }}>保存</Button>
        </div>
        <div className={styles['operation-area']}>
          <div className={styles['main-div']} style={{ height: graphHeight, width: graphWidth }}>
            <div id="mountNode">
              <div />
            </div>
          </div>
          <Modal title="编辑节点" visible={operationModalVisible} footer={null} onCancel={() => { this.setState({ operationModalVisible: false }); }}>
            <div style={{ display: 'flex' }}>
              <Space align="center" size={10}>
                <div className="label">节点ID:</div>
                <div>{operateInfo.id}</div>
              </Space>
            </div>
            <div style={{ display: 'flex', margin: '10px auto' }}>
              <Space align="center" size={10}>
                <div className="label">节点名称:</div>
                <Input defaultValue={operateInfo.label} onChange={this.handleChange} />
              </Space>
            </div>
            {
                operateInfo.type === 'diamond' &&
                <div>
                  <div style={{ display: 'flex' }}>
                    <Space align="center" size={10}>
                      <div className="label">YES条件:</div>
                      <Input onChange={(e) => { this.conditionChange(e, "max"); }} />
                    </Space>
                  </div>
                  <div style={{ display: 'flex', margin: '10px auto' }}>
                    <Space align="center" size={10}>
                      <div className="label">NO条件:</div>
                      <Input onChange={(e) => { this.conditionChange(e, 'min'); }} />
                    </Space>
                  </div>
                </div>
              }
              <Col span={4} offset={20}><Button type="primary" danger onClick={this.removeNode}>删除节点</Button></Col>
          </Modal>
          {
            detailNodeModal &&
            <Card title="详细信息" className={styles['operation-card']}>
              <p>id：{details.id}</p>
              <p>文字内容：{details.model.label}</p>
              <p>坐标：{`(${details.model.x}, ${details.model.y})`}</p>
              <p>是否为源节点：{details.states.length > 0 ? '是' : '否'}</p>
              <p>连线数量：{details.edges.length}</p>
              <div className={styles['button-style']}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      detailNodeModal: false,
                      details: {},
                    });
                  }}
                >关闭</Button>
              </div>
            </Card>
          }
          {
            detailEdgeModal &&
            <Card title="详细信息" className={styles['operation-card']}>
              <p>id：{details.id}</p>
              <p>起始坐标：{`(${details.startPoint.x}, ${details.startPoint.y})`}</p>
              <p>终点坐标：{`(${details.endPoint.x}, ${details.endPoint.y})`}</p>
              <p>label：{details.label}</p>
              <p>线条颜色：{details.style.stroke}</p>
              <div className={styles['button-style']}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      detailEdgeModal: false,
                      details: {},
                    });
                  }}
                >关闭</Button>
              </div>
            </Card>
          }
        </div>
      </div>
    );
  }
}

export default Process;
