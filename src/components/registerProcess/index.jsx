import React, { Fragment } from 'react';
import { Col, Row, Space, Button, Modal, Input } from 'antd';
import G6 from '@antv/g6';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import {
  graphConfig,
  colors,
  defaultNodeConfig,
  defaultAnchorPoints,
  showLinkPoints,
  hideLinkPoints,
  anchorList,
} from './config';
import { NodeTooltips, NodeMenu, CanvasMenu } from './component';
import { registerFn } from './register';

class RegisterProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdgeTooltip: false,
      showNodeTooltip: false,
      showNodeMenu: false,
      showCanvasMenu: false,
      nodeMenuX: 0,
      nodeMenuY: 0,
      canvasMenuX: 100,
      canvasMenuY: 100,

      nodeDetailVisible: false,
      currentNodeInfo: {},
      currentEdgeInfo: {},

      isModalVisible: false,
    };
  }
  componentDidMount() {
    // 初始化G6的自定义事件
    registerFn(G6);
    this.registerBehavior();
    // G6的graph实例需要DOM容器渲染完成才能使用，放在componentDidMount中
    this.renderGraph();
  }

  registerBehavior = () => {
    const _this = this;
    G6.registerBehavior('edit-operate', {
      // 设定编辑模式下的节点操作
      getEvents() {
        return {
          'node:mouseenter': 'mouseEnterNode',
          'node:mouseleave': 'mouseLeaveNode',
          'points-right:click': 'clickNodeEdit',
          'points-top:click': 'clickNodeEdit',
          'points-left:click': 'clickNodeEdit',
          'points-bottom:click': 'clickNodeEdit',
          'node:dblclick': 'editNodeDetails',
          'mousemove': 'connectEdge',
          'edge:click': 'onEdgeClick',
          'edge:dblclick': 'removeItem',
          'points-del:click': 'removeItem',
        };
      },

      mouseEnterNode(e) {
        const { item } = e;
        const model = item.getModel();
        model.status = 'show';
        _this.graph.setMode(item, model);
      },

      mouseLeaveNode(e) {
        const { item } = e;
        const model = item.getModel();
        model.status = 'hide';
        _this.graph.setMode(item, model);
      },

      // 编辑模式下点击节点：不是源节点且是锚点，则可以拉出连线，否则无效
      clickNodeEdit(e) {
        _this.clickAnchorPoint(e);
      },

      // 编辑模式下双击节点：显示内容编辑框
      editNodeDetails(e) {
        const { item = {} } = e;
        const model = item.getModel();
        _this.setState({
          operateInfo: model,
          operationModalVisible: true,
        });
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

      removeItem(e) {
        const { item } = e;
        _this.graph.removeItem(item);
      },

    });
  }
  // 点击了锚点，开启一条连线
  clickAnchorPoint = (e) => {
    const { item = {}, canvasX, canvasY } = e;
    // 获取点击位置最近的锚点作为起始点
    const point = { x: e.x, y: e.y };
    const model = item.getModel();
    console.log('e==>>', e, model);
    if (this.addingEdge && this.edge) {
      // 校验source和target之间是否已有一条边或者自身
      const isOk = true;
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
      console.log('item.getLinkPoint({ x: canvasX, y: canvasY })=>', item.getLinkPoint({ x: canvasX, y: canvasY }));
      const startPointIndex = item.getLinkPoint({ x: canvasX, y: canvasY }).anchorIndex;
      this.edge = this.graph.addItem('edge', {
        type: 'polyline',
        // type: 'cubic-horizontal',
        source: model.id,
        target: point,
        sourceAnchor: startPointIndex,
        style: {
          endArrow: true,
          lineWidth: 5,
          // stroke: '#CED4D9',
          stroke: '#634bca',
        },
      });
      this.addingEdge = true;
      // this.currentNode = model.id;
    }
  };

  bindEvents = () => {
    const _this = this;
    const getModelInfo = (e) => {
      const { item } = e;
      const model = item.getModel();
      const { x, y } = model;
      const point = _this.graph.getCanvasByPoint(x, y);
      return { model, point };
    }
    
    // 监听edge上面mouse事件
    _this.graph.on('edge:mouseenter', e => {
      const { item, target } = e
      const type = target.get('type')
      if(type !== 'text') {
        return
      }
    })

    _this.graph.on('edge:mouseleave', () => {
      
    })

    // 监听node上面mouse事件
    _this.graph.on('node:mouseenter', e => {
      const { model } = getModelInfo(e);
      console.log(model);
      model.anchorPoints = defaultAnchorPoints;
      model.linkPoints = showLinkPoints;
      this.graph.updateItem(model.id, model);
      _this.setState({
        showNodeTooltip: true,
        currentNodeInfo: model,
      });
    })
  
    // 节点上面触发mouseleave事件后隐藏tooltip和ContextMenu
    _this.graph.on('node:mouseleave', (e) => {
      const { model } = getModelInfo(e);
      model.linkPoints = hideLinkPoints;
      this.graph.updateItem(model.id, model);
      _this.setState({
        showNodeTooltip: false,
        showNodeMenu: false,
      });
    })

    // 双击节点
    _this.graph.on('node:dblclick', (e) => {
      const { model } = getModelInfo(e);
      console.log(model);
      _this.setState({
        isModalVisible: true,
        currentNodeInfo: model,
      });
    })
    

    // 监听节点上面右键菜单事件
    _this.graph.on('node:contextmenu', (e) => {
      const { model, point } = getModelInfo(e);
      _this.setState({
        showNodeMenu: true,
        nodeMenuX: point.x,
        nodeMenuY: point.y + 120,
        currentNodeInfo: model,
      });
    })

    // 监听画布右键菜单事件
    _this.graph.on('canvas:contextmenu', (e) => {
      const { x, y } = e;
      const point = _this.graph.getCanvasByPoint(x, y);
      _this.setState({
        showCanvasMenu: true,
        canvasMenuX: point.x,
        canvasMenuY: point.y + 120,
      });
    })

    _this.graph.on('canvas:click', () => {
      _this.setState({
        showCanvasMenu: false,
        showNodeMenu: false,
        showNodeTooltip: false,
        showEdgeTooltip: false,
      });
    })
  }

  renderGraph = () => {
    const { data } = graphConfig;
    const container = document.getElementById('container');
     // 取消默认事件
     container.oncontextmenu = (e) => {
         e.preventDefault()
     }
    const width = container.scrollWidth;
    const height = container.scrollHeight || 800;
    const tooltip = new G6.Tooltip({
      offsetX: 0,
      offsetY: 150,
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node'],
      // 自定义 tooltip 内容
      getContent: (e) => {
        const { item } = e;
        const div = document.createElement('div');
        div.style.padding = '5px';
        const nodeName = item.getModel().name;
        div.innerHTML = `${nodeName}`;
        return div;
      },
      shouldBegin: (e) => {
        if (e.target.get('name') === 'name-shape') return true;
        return false;
      },
    });
    const { config } = graphConfig;
    this.graph = new G6.Graph({
      container: 'container',
      ...config,
      plugins: [tooltip],
      width,
      height,
    });
    this.graph.data(data);
    this.graph.render();
    this.graph.zoom(config.defaultZoom || 1);
  
    this.bindEvents();
  };

  addNode = (nodeConfig = defaultNodeConfig) => {
    this.graph.addItem('node', {
      ...nodeConfig,
      id: uuidv4(),
    });
  }

  delNode = () => {
    const { currentNodeInfo } = this.state;
    const { id } = currentNodeInfo;
    console.log('id==>>>>>', id);
    this.graph.removeItem(id);
    this.setState({ showNodeMenu: false });
  }

  showNodeDetail = () => {
    this.setState({ nodeDetailVisible: true });
  }

  save = () => {
    const allDatas = this.graph.save();
    console.log('查看数据===>>>>>>>>>>', allDatas, this.graph);
  }

  canvasMenuChange = (nodeConfig) => {
    this.addNode(nodeConfig);
    this.setState({ showCanvasMenu: false });
  }

  nodeNameChange = (e) => {
    const { currentNodeInfo } = this.state;
    const value = e.target.value;
    currentNodeInfo.name = value;
    console.log('currentNodeInfo==》》', currentNodeInfo)
    this.graph.updateItem(currentNodeInfo.id, currentNodeInfo);
    // this.graph.paint();
    // this.graph.refresh();
    // this.graph.render();
    this.setState({ currentNodeInfo });
  }

  render() {
    const {
      showNodeTooltip,
      showNodeMenu,
      showCanvasMenu,
      nodeMenuX,
      nodeMenuY,
      canvasMenuX,
      canvasMenuY,
      nodeDetailVisible,
      currentNodeInfo,
      isModalVisible,
    } = this.state;
    return (
      <Fragment>
        <Row justify='center' style={{ marginBottom: 20 }}>
            <Col>
              <Space size={10}>
                  <Button type="primary" onClick={() => { this.addNode(defaultNodeConfig); }}>添加节点</Button>
                  <Button onClick={this.save}>查看数据</Button>
                  {/* <Button type="dashed">Dashed</Button>
                  <Button type="link">Link</Button> */}
              </Space>
            </Col>
        </Row>
        <div id='container' />
        <Modal title="编辑节点" visible={isModalVisible} footer={null} onCancel={() => { this.setState({ isModalVisible: false }); }}>
          <div style={{ display: 'flex' }}>
            <Space align="center" size={10}>
              <div>节点ID:</div>
              <div>{currentNodeInfo.id}</div>
            </Space>
          </div>
          <div style={{ display: 'flex' }}>
            <Space align="center" size={10}>
              <div>节点名称:</div>
              <Input defaultValue={currentNodeInfo.name} onChange={this.nodeNameChange} />
            </Space>
          </div>
        </Modal>
        { showNodeTooltip && <NodeTooltips nodeInfo={currentNodeInfo} /> }
        { showNodeMenu && <NodeMenu x={nodeMenuX} y={nodeMenuY} delNode={this.delNode} showNodeDetail= {this.showNodeDetail} /> }
        { showCanvasMenu && <CanvasMenu x={canvasMenuX} y={canvasMenuY} onChange={this.canvasMenuChange} /> }
      </Fragment>
    );
  }
}

export default RegisterProcess;
