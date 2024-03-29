import React from 'react';
import G6 from '@antv/g6';
import './style.css';
import {
  prop,
  colors,
  defaultConfig,
} from './config';

class RegisterX extends React.Component {
  componentDidMount() {
    // 初始化G6的自定义事件
    this.registerFn();
    // G6的graph实例需要DOM容器渲染完成才能使用，放在componentDidMount中
    this.renderGraph();
  }

//自定义节点、边
  registerFn = () => {
    G6.registerNode(
      'flow-rect',
      {
        shapeType: 'flow-rect',
        draw(cfg, group) {
          const {
            name = '',
            variableName,
            variableValue,
            variableUp,
            label,
            collapsed,
            currency,
            status,
            // rate,
          } = cfg;
          const grey = '#CED4D9';
          // 逻辑不应该在这里判断
          const rectConfig = {
            width: 202,
            height: 60,
            lineWidth: 1,
            fontSize: 12,
            fill: '#fff',
            radius: 4,
            stroke: grey,
            opacity: 1,
          };
  
          const nodeOrigin = {
            x: -rectConfig.width / 2,
            y: -rectConfig.height / 2,
          };
  
          const textConfig = {
            textAlign: 'left',
            textBaseline: 'bottom',
          };
  
          const rect = group.addShape('rect', {
            attrs: {
              x: nodeOrigin.x,
              y: nodeOrigin.y,
              ...rectConfig,
            },
          });
  
          const rectBBox = rect.getBBox();
  
          // label title
          group.addShape('text', {
            attrs: {
              ...textConfig,
              x: 12 + nodeOrigin.x,
              y: 20 + nodeOrigin.y,
              text: name.length > 28 ? name.substr(0, 28) + '...' : name,
              fontSize: 12,
              opacity: 0.85,
              fill: '#000',
              cursor: 'pointer',
            },
            name: 'name-shape',
          });
  
          // price
          const price = group.addShape('text', {
            attrs: {
              ...textConfig,
              x: 12 + nodeOrigin.x,
              y: rectBBox.maxY - 12,
              text: label,
              fontSize: 16,
              fill: '#000',
              opacity: 0.85,
            },
          });
  
          // label currency
          group.addShape('text', {
            attrs: {
              ...textConfig,
              x: price.getBBox().maxX + 5,
              y: rectBBox.maxY - 12,
              text: currency,
              fontSize: 12,
              fill: '#000',
              opacity: 0.75,
            },
          });
  
          // percentage
          const percentText = group.addShape('text', {
            attrs: {
              ...textConfig,
              x: rectBBox.maxX - 8,
              y: rectBBox.maxY - 12,
              text: `${((variableValue || 0) * 100).toFixed(2)}%`,
              fontSize: 12,
              textAlign: 'right',
              fill: colors[status],
            },
          });
  
          // percentage triangle
          const symbol = variableUp ? 'triangle' : 'triangle-down';
          const triangle = group.addShape('marker', {
            attrs: {
              ...textConfig,
              x: percentText.getBBox().minX - 10,
              y: rectBBox.maxY - 12 - 6,
              symbol,
              r: 6,
              fill: colors[status],
            },
          });
  
          // variable name
          group.addShape('text', {
            attrs: {
              ...textConfig,
              x: triangle.getBBox().minX - 4,
              y: rectBBox.maxY - 12,
              text: variableName,
              fontSize: 12,
              textAlign: 'right',
              fill: '#000',
              opacity: 0.45,
            },
          });
  
          // bottom line background
          // const bottomBackRect = group.addShape('rect', {
          //   attrs: {
          //     x: nodeOrigin.x,
          //     y: rectBBox.maxY - 4,
          //     width: rectConfig.width,
          //     height: 4,
          //     radius: [0, 0, rectConfig.radius, rectConfig.radius],
          //     fill: '#E0DFE3',
          //   },
          // });
  
          // bottom percent
          // const bottomRect = group.addShape('rect', {
          //   attrs: {
          //     x: nodeOrigin.x,
          //     y: rectBBox.maxY - 4,
          //     width: rate * rectBBox.width,
          //     height: 4,
          //     radius: [0, 0, 0, rectConfig.radius],
          //     fill: colors[status],
          //   },
          // });
  
          // collapse rect
          if (cfg.children && cfg.children.length) {
            group.addShape('rect', {
              attrs: {
                x: rectConfig.width / 2 - 8,
                y: -8,
                width: 16,
                height: 16,
                stroke: 'rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                fill: '#fff',
              },
              name: 'collapse-back',
              modelId: cfg.id,
            });
  
            // collpase text
            group.addShape('text', {
              attrs: {
                x: rectConfig.width / 2,
                y: -1,
                textAlign: 'center',
                textBaseline: 'middle',
                text: collapsed ? '+' : '-',
                fontSize: 16,
                cursor: 'pointer',
                fill: 'rgba(0, 0, 0, 0.25)',
              },
              name: 'collapse-text',
              modelId: cfg.id,
            });
          }
  
          this.drawLinkPoints(cfg, group);
          return rect;
        },
        update(cfg, item) {
          const group = item.getContainer();
          this.updateLinkPoints(cfg, group);
        },
        setState(name, value, item) {
          if (name === 'collapse') {
            const group = item.getContainer();
            const collapseText = group.find((e) => e.get('name') === 'collapse-text');
            if (collapseText) {
              if (!value) {
                collapseText.attr({
                  text: '-',
                });
              } else {
                collapseText.attr({
                  text: '+',
                });
              }
            }
          }
        },
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ];
        },
      },
      'rect',
    );
  
    G6.registerEdge(
      'flow-cubic',
      {
        getControlPoints(cfg) {
          let controlPoints = cfg.controlPoints; // 指定controlPoints
          if (!controlPoints || !controlPoints.length) {
            const { startPoint, endPoint, sourceNode, targetNode } = cfg;
            const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode
              ? sourceNode.getModel()
              : startPoint;
            const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
            let curveStart = (endX - startX) * coefficientX;
            let curveEnd = (endY - startY) * coefficientY;
            curveStart = curveStart > 40 ? 40 : curveStart;
            curveEnd = curveEnd < -30 ? curveEnd : -30;
            controlPoints = [
              { x: startPoint.x + curveStart, y: startPoint.y },
              { x: endPoint.x + curveEnd, y: endPoint.y },
            ];
          }
          return controlPoints;
        },
        getPath(points) {
          const path = [];
          path.push(['M', points[0].x, points[0].y]);
          path.push([
            'C',
            points[1].x,
            points[1].y,
            points[2].x,
            points[2].y,
            points[3].x,
            points[3].y,
          ]);
          return path;
        },
      },
      'single-line',
    );
  };

  renderGraph = () => {
    const { data } = prop;
    if (!data) {
      return;
    }
    const container = document.getElementById('container');
    const width = container.scrollWidth;
    const height = container.scrollHeight || 800;
    const { onInit, config } = prop;
    const tooltip = new G6.Tooltip({
      offsetX: 20,
      offsetY: 30,
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node'],
      // 自定义 tooltip 内容
      getContent: (e) => {
        const outDiv = document.createElement('div');
        //outDiv.style.padding = '0px 0px 20px 0px';
        const nodeName = e.item.getModel().name;
        let formatedNodeName = '';
        for (let i = 0; i < nodeName.length; i++) {
          formatedNodeName = `${formatedNodeName}${nodeName[i]}`;
          if (i !== 0 && i % 20 === 0) formatedNodeName = `${formatedNodeName}<br/>`;
        }
        outDiv.innerHTML = `${formatedNodeName}`;
        return outDiv;
      },
      shouldBegin: (e) => {
        if (e.target.get('name') === 'name-shape') return true;
        return false;
      },
    });
    this.graph = new G6.TreeGraph({
      container: 'container',
      ...defaultConfig,
      ...config,
      plugins: [tooltip],
      width,
      height,
    });
    if (typeof onInit === 'function') {
      onInit(this.graph);
    }
    this.graph.data(data);
    this.graph.render();
    this.graph.zoom(config.defaultZoom || 1);
  
    const handleCollapse = (e) => {
      const target = e.target;
      const id = target.get('modelId');
      const item = this.graph.findById(id);
      const nodeModel = item.getModel();
      nodeModel.collapsed = !nodeModel.collapsed;
      this.graph.layout();
      this.graph.setItemState(item, 'collapse', nodeModel.collapsed);
    };
    this.graph.on('collapse-text:click', (e) => {
      handleCollapse(e);
    });
    this.graph.on('collapse-back:click', (e) => {
      handleCollapse(e);
    });
  };

  render() {
    return (
      <div id='container' />
    );
  }
}

export default RegisterX;
