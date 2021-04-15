export const nodeList = [
    // 内置节点-配置手册：https://www.yuque.com/antv/g6/internal-node
    {
        id: 'start', // 节点的唯一标识
        x: 300, // 节点横坐标
        y: 200, // 节点的纵坐标
        shape: "ellipse", // 节点的形状【rect：矩形， ellipse: 椭圆形，diamond：菱形，circle：圆形。。。】
        size: [80,50], // 节点的大小，不同形状的节点值不同，number||[]
        label: 'START',
        // anchorPoints: [[1, 0.5], [0.5, 1]],
        anchorPoints: [
            [1, 0.5, {type: 'circle', style: {stroke: 'red', fill: 'white'}}],
            [0.5, 1, {type: 'rect', style: {stroke: 'blue', fill: 'white'}}]
        ],
        style: { // 包裹样式属性的字段，style与其他属性在数据结构上并行
            // fill: 'red', // 样式属性，元素的填充色
            stroke: "green", // 样式属性，元素的描边色
            fontSize: 5
        },
        labelCfg: {
            style: {
                fontSize: 15,
                // shadowOffsetX: 5, // 阴影
                // shadowOffsetY: 5,
                // shadowColor: 'blue',
                // shadowBlur: 5
            }
        }
    },
    {
        id: 'end',
        x: 500,
        y: 500,
        shape: "ellipse",
        size: [80,50],
        // anchorPoints: [[0, 0.5], [0.5, 0]],
        anchorPoints: [
            [0, 0.5, {type: 'circle', style: {stroke: 'red', fill: 'white'}}],
            [0.5, 0, {type: 'rect', style: {stroke: 'blue', fill: 'white'}}]
        ],
        label: 'END',
        style: { // 包裹样式属性的字段，style与其他属性在数据结构上并行
            // fill: 'red', // 样式属性，元素的填充色
            stroke: "green", // 样式属性，元素的描边色
            fontSize: 5
        },
        labelCfg: {
            style: {
                fontSize: 15,
            }
        }
    }
],