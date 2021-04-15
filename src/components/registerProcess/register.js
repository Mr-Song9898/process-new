import {
  colors,
} from './config';

export const registerFn = (G6) => {
  G6.registerNode(
    'flow-rect',
    {
      shapeType: 'flow-rect',
      options: {
        style: {},
        stateStyles: {
          hover: {
            fill: '#000'
          }
        }
      },
      draw(cfg, group) {
        const {
          name = '',
          label,
          nodetype,
          status,
          style = {},
          src,
        } = cfg;
        const grey = '#CED4D9';
        // 逻辑不应该在这里判断
        const rectConfig = {
          width: 200,
          height: 60,
          lineWidth: 1,
          fontSize: 14,
          radius: 4,
          stroke: grey,
          opacity: 1,
          fill: colors[nodetype] || '#fff',
          ...style,
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
            fontSize: 16,
            opacity: 0.85,
            fill: '#000',
            cursor: 'pointer',
          },
          name: 'name-shape',
        });

        // label
        const state = group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 12 + nodeOrigin.x,
            y: rectBBox.maxY - 12,
            text: label,
            fontSize: 12,
            fill: '#000',
            opacity: 0.85,
          },
        });

        group.addShape('image', {
          attrs: {
            x: nodeOrigin.x + rectConfig.width - 25,
            y: nodeOrigin.y + rectConfig.height / 2,
            text: '111',
            width: 20,
            height: 20,
            img: src,
          },
          name: 'image-shape'
        });

        // // bottom line background
        // group.addShape('rect', {
        //   attrs: {
        //     x: nodeOrigin.x,
        //     y: rectBBox.maxY - 4,
        //     width: rectConfig.width,
        //     height: 4,
        //     radius: [0, 0, rectConfig.radius, rectConfig.radius],
        //     fill: '#E0DFE3',
        //   },
        // });
        // https://oss.tool.lu/cache/202103/18/143435a72frwbjcb7f7jb2.jpg.icon.ico

         if (status && status === 'show') {
           // right
            group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x + rectConfig.width - 9,
                y: nodeOrigin.y + rectConfig.height / 2 - 9,
                cursor: 'pointer',
                text: '',
                fill: '#fff',
                stroke: 'green',
                lineWidth: 2,
                radius: 10,
                width: 18,
                height: 18,
              },
              name: 'points-right',
              modelId: 'right',
            });

            // top
            group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x + rectConfig.width / 2 - 9,
                y: nodeOrigin.y - 9,
                cursor: 'pointer',
                text: '',
                fill: '#fff',
                stroke: 'green',
                radius: 10,
                width: 18,
                height: 18,
              },
              name: 'points-top',
              modelId: 'top',
            });

            // bottom
            group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x + rectConfig.width / 2 - 9,
                y: nodeOrigin.y + rectConfig.height - 9,
                cursor: 'pointer',
                text: '',
                fill: '#fff',
                stroke: 'green',
                radius: 10,
                width: 18,
                height: 18,
              },
              name: 'points-bottom',
              modelId: 'bottom',
            });

            // left
            group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x - 9,
                y: nodeOrigin.y + rectConfig.height / 2 - 9,
                cursor: 'pointer',
                text: '',
                fill: '#fff',
                stroke: 'green',
                radius: 10,
                width: 18,
                height: 18,
              },
              name: 'points-left',
              modelId: 'left',
            });

            // X
            group.addShape('text', {
              attrs: {
                x: nodeOrigin.x + rectConfig.width - 9,
                y: nodeOrigin.y + 12,
                cursor: 'pointer',
                text: "X",
                fontSize: 24,
                fill: 'red',
                stroke: 'red',
                width: 18,
                height: 18,
              },
              name: 'points-del',
              modelId: 'del',
            });
         }

        // this.drawLinkPoints(cfg, group);
        return rect;
      },
      // update(cfg, item) {
      //   const group = item.getContainer();
      //   this.updateLinkPoints(cfg, group);
      // },
      // group.addShape('image', {
      //   attrs: {
      //     x: nodeOrigin.x + rectConfig.width - 9,
      //     y: nodeOrigin.y + rectConfig.height / 2 - 9,
      //     width: 18,
      //     height: 18,
      //     img: 'https://oss.tool.lu/cache/202103/18/143435a72frwbjcb7f7jb2.jpg.icon.ico',
      //   },
      //   name: 'image',
      // });
      // afterDraw(cfg, group) {
      //   const size = cfg.size;
      //   const width = size[0] - 14;
      //   const height = size[1] - 14;
      //   // 添加图片
        
      // },
      update: undefined,
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
          [0.5, 0],
          [0, 0.5],
          [1, 0.5],
          [0.5, 1],
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