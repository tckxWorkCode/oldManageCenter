<template>
  <div>
    <div style="text-align: center" v-if="emptytxt">
      <img src="@/assets/nodata1.png" />
      <div style="color: #aaa">暂无数据</div>
    </div>
    <div v-if="emptytxt == false" id="container" ref="container"></div>
  </div>
</template>
 
<script>
import request from "@/utils/request";
import G6 from "@antv/g6";
import isObject from "@antv/util/esm/is-object";
export default {
  name: "Started",
  props: {
    nodeId: {
      type: String,
    },
    ip: {
      type: String,
    },
  },
  data() {
    return {
      emptytxt: "",
      stage1: [],
      stage2: [],
      stage3: [],
      stage4: [],
    };
  },

  mounted() {
    this.initData();
    // this.initGraph();
  },
  methods: {
    initData() {
      var that = this;
      request({
        url: "/sec/lBMeasureRecordListOld",
        method: "post",
        data: { node_id: that.nodeId },
      }).then((response) => {
        var res = response.data;
        console.log(res);
        if (res.total == 0) {
          that.emptytxt = true;
        } else {
          that.emptytxt = false;
        }
        if (Object.keys(res.list).length != 0) {
          res.list.map(function (value, index) {
            if (value.result == 0) {
              value.result = "度量成功";
            } else if (value.result == 1) {
              value.result = "度量失败";
            } else if (value.result == 2) {
              value.result = "未度量";
            }
            if (value.stage >= 0 && value.stage <= 999) {
              value.id = String(index);
              that.stage1.push({ id: value.id, label: value.hash, hash:value.hash, num: "1", name: value.name, result: value.result, stroke:"#1ac492",fill:"rgba(26,196,146,0.1)" });
            } else if (value.stage >= 1000 && value.stage <= 1999) {
              value.id = String(index);
              that.stage2.push({ id: value.id, label: value.hash, hash:value.hash, num: "2", name: value.name, result: value.result, stroke:"#F8AB8A",fill:"rgba(248,104,44,0.1)"  });
            } else if (value.stage >= 2000 && value.stage <= 2999) {
              value.id = String(index);
              that.stage3.push({ id: value.id, label: value.hash, hash:value.hash, num: "3", name: value.name, result: value.result, stroke:"#c24dff",fill:"rgba(194,77,255,0.1)"  });
            } else if (value.stage >=3000) {
              value.id =String(index);
              that.stage4.push({ id: value.id, label: value.hash, hash:value.hash, num: "4", name: value.name, result: value.result, stroke:"#7289f1",fill:"rgba(114,137,241,0.1)"  })
            }
            
          });
          var result = res.list[0].result;
          this.initGraph(that.stage1, that.stage2, that.stage3, that.stage4, result);
        }
      });
    },
    // 初始化关系图，并渲染数据
    initGraph(stage1, stage2, stage3, stage4, result) {
      //数据
      var dataNode = [{ id: "title0", label: this.ip ,name:this.ip,stroke: '#54AFFF',fill: '#E5F8FE'}];
      var nodeDataArr1 = [], nodeDataArr2 = [], nodeDataArr3 = [],nodeDataArr4 = [];
      if (stage1.length != 0) {
        dataNode.push({ id: "node1", label: "TPCM及度量加载器(BIOS,UBOOT)\n及前期固件验证",name:"TPCM及度量加载器(BIOS,UBOOT)及前期固件验证",stroke: '#1ac492',fill:"rgba(26,196,146,0.1)" });
        nodeDataArr1 = dataNode.concat(stage1);
        stage1.map ((value,index) =>{
          nodeDataArr1.push({id: "name1" + value.id, name: value.name, label: value.name,stroke: '#1ac492' ,fill:"rgba(26,196,146,0.1)"})
          nodeDataArr1.push({id: "result001" + value.id, result: value.result, label: value.result,stroke: '#1ac492' ,fill:"rgba(26,196,146,0.1)"})
        })
      } else {
        nodeDataArr1 = dataNode;
      }
      if (stage2.length != 0) {
        nodeDataArr1.push({ id: "node2", label: "加载器加载驱动、配置、操作系统\n或二级加载器(GRUB)",name:"加载器加载驱动、配置、操作系统或二级加载器(GRUB)",stroke: '#F8AB8A',fill:"rgba(248,104,44,0.1)" });
        nodeDataArr2 = nodeDataArr1.concat(stage2);
        stage2.map ((value,index) =>{
          nodeDataArr2.push({id: "name2" + value.id, label: value.name,name: value.name,stroke: '#F8AB8A' ,fill:"rgba(248,104,44,0.1)"})
          nodeDataArr2.push({id: "result002" + value.id, label: value.result,result: value.result,stroke: '#F8AB8A' ,fill:"rgba(248,104,44,0.1)"})
        })
      } else {
        nodeDataArr2 = nodeDataArr1;
      }
      if (stage3.length != 0) {
        nodeDataArr2.push({ id: "node3", label: "二级加载器(GRUB)加载驱动、\n配置、操作系统",name:"二级加载器(GRUB)加载驱动、配置、操作系统",stroke: '#c24dff',fill:"rgba(194,77,255,0.1)" });
        nodeDataArr3 = nodeDataArr2.concat(stage3);
        stage3.map ((value,index) =>{
          nodeDataArr3.push({id: "name3" + value.id, label: value.name,name: value.name,stroke: '#c24dff' ,fill:"rgba(194,77,255,0.1)"})
          nodeDataArr3.push({id: "result003" + value.id, label: value.result,result: value.result,stroke: '#c24dff' ,fill:"rgba(194,77,255,0.1)"})
        })
      } else {
        nodeDataArr3 = nodeDataArr2;
      }
      if (stage4.length != 0) {
        nodeDataArr3.push({ id: "node4", label: "操作系统加载驱动、\n配置、服务程序",name:"操作系统加载驱动、配置、服务程序",stroke: '#7289f1',fill:"rgba(114,137,241,0.1)" });
        nodeDataArr4 = nodeDataArr3.concat(stage4);
        stage4.map ((value,index) =>{
          nodeDataArr4.push({id: "name4" + value.id, label: value.name,name: value.name,stroke: '#7289f1' ,fill:"rgba(114,137,241,0.1)"})
          nodeDataArr4.push({id: "result004" + value.id, label: value.result,result: value.result,stroke: '#7289f1' ,fill:"rgba(114,137,241,0.1)"})
        })
      } else {
        nodeDataArr4 = nodeDataArr3;
      }
      var edgeData = [];
      if (stage1.length != 0) {
        edgeData.push({
          source: "title0",
          target: "node1",
          stroke: '#54AFFF',
          data: {
            type: "B",
            amount: "第一阶段度量",
            date: "（0-999）",
          },
        });
        stage1.map(function (value) {
          edgeData.push(
            { source: "node1", target: "name1" + value.id, stroke: '#1ac492',data: { type: "B" } },
            { source: "name1" + value.id, target: value.id, stroke: '#1ac492',data: { type: "B" } },
            { source: value.id, target: "result001" + value.id, stroke: '#1ac492',data: { type: "B" } },
          );
        });
      }
      if (stage2.length != 0) {
        edgeData.push({
          source: "title0",
          target: "node2",
          stroke: '#54AFFF',
          data: {
            type: "C",
            amount: "第二阶段度量",
            date: "（1000-1999）",
          },
        });
        stage2.map(function (value) {
          edgeData.push(
            { source: "node2", target: "name2" + value.id, stroke: '#F8AB8A', data: { type: "C" } },
            { source: "name2" + value.id, target: value.id,stroke: '#F8AB8A', data: { type: "C" } },
            { source: value.id, target: "result002" + value.id,stroke: '#F8AB8A', data: { type: "C" } }
          );
        });
      }
      if (stage3.length != 0) {
        edgeData.push({
          source: "title0",
          target: "node3",
          stroke: '#54AFFF',
          data: {
            type: "D",
            amount: "第三阶段度量",
            date: "（2000-2999）",
          },
        });
        stage3.map(function (value) {
          edgeData.push(
            { source: "node3", target: "name3" + value.id,stroke: '#D277FF', data: { type: "D" } },
            { source: "name3" + value.id, target: value.id,stroke: '#D277FF', data: { type: "D" } },
            { source: value.id, target: "result003" + value.id,stroke: '#D277FF', data: { type: "D" } }
          );
        });
      }
      if (stage4.length != 0) {
        edgeData.push({
          source: "title0",
          target: "node4",
          stroke: '#54AFFF',
          data: {
            type: "E",
            amount: "第四阶段度量",
            date: "（3000+ ）",
          },
        });
        stage4.map(function (value) {
          edgeData.push(
            { source: "node4", target: "name4" + value.id,stroke: '#7289f1', data: { type: "E" } },
            { source: "name4" + value.id,target: value.id,stroke: '#7289f1', data: { type: "E" } },
            { source: value.id, target: "result004" + value.id,stroke: '#7289f1', data: { type: "E" } }
          );
        });
      }
      const data = {
        nodes: nodeDataArr4,
        edges: edgeData,
      };

      //样式
      const minWidth = 60;
      const colorMap = {
        A: '#54AFFF',
        B: '#1ac492',
        C: '#F8AB8A',
        D: '#C24DFE',
        E: '#7289f1'
      }
      const BaseConfig = {
        nameFontSize: 12,
        childCountWidth: 22,
        countMarginLeft: 0,
        itemPadding: 24,
        nameMarginLeft: 8,
        rootPadding: 18,
      };
       /**
       * 计算字符串的长度
       * @param {string} str 指定的字符串
       */
      var calcStrLen = function calcStrLen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
            len++;
          } else {
            len += 2;
          }
        }
        return len;
      };

      /**
       * 计算显示的字符串
       * @param {string} str 要裁剪的字符串
       * @param {number} maxWidth 最大宽度
       * @param {number} fontSize 字体大小
       */
      var fittingString = function fittingString(str, maxWidth, fontSize) {
        var fontWidth = fontSize * 1.3; //字号+边距
        maxWidth = maxWidth * 2; // 需要根据自己项目调整
        var width = calcStrLen(str) * fontWidth;
        var ellipsis = '…';
        if (width > maxWidth) {
          var actualLen = Math.floor((maxWidth - 10) / fontWidth);
          var result = str.substring(0, actualLen) + ellipsis;
          return result;
        }
        return str;
      };
      G6.registerNode(
        "round-rect",
        {
          drawShape: function drawShape(cfg, group) {
            const { label } = cfg;
            // const stroke = cfg.style.stroke;
            const { itemPadding, nameMarginLeft } = BaseConfig;

            let width = 0;
            const height = 28;
            const x = 0;
            const y = -height / 2;
            // 名称文本
            const text = group.addShape("text", {
              attrs: {
                text: label,
                x: x * 2,
                y,
                textAlign: "left",
                textBaseline: "top",
              },
              cursor: "pointer",
              name: "name-text-shape",
            });
            const textWidth = text.getBBox().width;
            width = textWidth + itemPadding + nameMarginLeft+22;
            width = width < minWidth ? minWidth : width;
            if (cfg.id.indexOf("node") != 0) {
              width = textWidth + itemPadding + nameMarginLeft + 46;
            }
            const rect = group.addShape("rect", {
              attrs: {
                x: -width / 2,
                y: cfg.id.indexOf("node") != -1?-20:-15,
                width,
                height: cfg.id.indexOf("node") != -1?36:30,
                radius: 5,
                fill: cfg.fill,
                stroke: cfg.stroke,
                lineWidth: 1,
                fillOpacity: 1,
              },
              name: "rect-shape",
            });

            group.addShape("circle", {
              attrs: {
                x: -width / 2,
                y: 0,
                r: 3,
                fill: cfg.stroke,
              },
              name: "circle-shape",
            });
            group.addShape("circle", {
              attrs: {
                x: width / 2,
                y: 0,
                r: 3,
                fill:cfg.stroke,
              },
              name: "circle-shape2",
            });
            return rect;
          },
          getAnchorPoints: function getAnchorPoints() {
            return [
              [0, 0.5],
              [1, 0.5],
            ];
          },
        },
        "single-node"
      );

      G6.registerEdge("fund-polyline", {
        itemType: "edge",
        draw: function draw(cfg, group) {
          let startPoint = cfg.startPoint;
          let endPoint = cfg.endPoint;

          const Ydiff = endPoint.y - startPoint.y;

          const slope = Ydiff !== 0 ? Math.min(500 / Math.abs(Ydiff), 20) : 0;

          const cpOffset = slope > 15 ? 0 : 16;
          const offset = Ydiff < 0 ? cpOffset : -cpOffset;

          const line1EndPoint = {
            x: startPoint.x + slope,
            y: endPoint.y + offset,
          };
          const line2StartPoint = {
            x: line1EndPoint.x + cpOffset,
            y: endPoint.y,
          };

          // 控制点坐标
          let controlPoint = {
            x:
              ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
                (line1EndPoint.y - startPoint.y) +
              startPoint.x,
            y: endPoint.y,
          };

          let path = [
            ["M", startPoint.x, startPoint.y],
            ["L", line1EndPoint.x, line1EndPoint.y],
            [
              "Q",
              controlPoint.x,
              controlPoint.y,
              line2StartPoint.x,
              line2StartPoint.y,
            ],
            ["L", endPoint.x, endPoint.y],
          ];

          if (Math.abs(Ydiff) <= 5) {
            path = [
              ["M", startPoint.x, startPoint.y],
              ["L", endPoint.x, endPoint.y],
            ];
          }
          const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
          if (isObject(endArrow)) endArrow.fill = stroke;
          const line = group.addShape("path", {
            attrs: {
              path,
              stroke: colorMap[ cfg.data && cfg.data.type],
            //   stroke: cfg.stroke,
              lineWidth: 1.2,
              endArrow,
            },
            name: "path-shape",
          });

          const labelLeftOffset = 0;
          const labelTopOffset = 8;
          // amount
          const amount = group.addShape("text", {
            attrs: {
              text: cfg.data && cfg.data.amount,
              x: line2StartPoint.x + labelLeftOffset,
              y: endPoint.y - labelTopOffset - 2,
              fontSize: 14,
              textAlign: "left",
              textBaseline: "middle",
              fill: "#000000D9",
            },
            name: "text-shape-amount",
          });
          // type
          group.addShape("text", {
            attrs: {
              text: cfg.data && cfg.data.type,
              x: line2StartPoint.x + labelLeftOffset,
              y: endPoint.y - labelTopOffset - amount.getBBox().height - 2,
              fontSize: 0,
              textAlign: "left",
              textBaseline: "middle",
              fill: "#000000D9",
            },
            name: "text-shape-type",
          });
          // date
          group.addShape("text", {
            attrs: {
              text: cfg.data && cfg.data.date,
              x: line2StartPoint.x + labelLeftOffset,
              y: endPoint.y + labelTopOffset + 4,
              fontSize: 14,
              fontWeight: 300,
              textAlign: "left",
              textBaseline: "middle",
              fill: "#000000D9",
            },
            name: "text-shape-date",
          });
          return line;
        },
      });
      
      const tooltip = new G6.Tooltip({
        offsetX: 20,
        offsetY:20,
        getContent(e) {
          // console.log(e.item)
          const outDiv = document.createElement('div')
          if (e.item.getModel().id.indexOf("result00") != -1) {
            outDiv.innerHTML = e.item.getModel().result
          } else if (e.item.getModel().id.indexOf("node") != -1) {
            outDiv.innerHTML = e.item.getModel().name
          } else if (e.item.getModel().id.indexOf("name") != -1) {
            outDiv.innerHTML = e.item.getModel().name
          } else if (e.item.getModel().id.indexOf("title") != -1) {
            outDiv.innerHTML = e.item.getModel().name
          } else {
            outDiv.innerHTML = e.item.getModel().hash
          }
          return outDiv
        },
        itemTypes: ['node']
      })

      const width = document.getElementById("container").scrollWidth;
      const height = document.getElementById("container").scrollHeight || 500;
      const graph = new G6.Graph({
        container: "container",
        width,
        height,
        plugins: [tooltip],
        layout: {
          type: "dagre",
          rankdir: "LR",
          // getWidth: function getWidth(d) {
          //   const labelWidth = G6.Util.getTextSize(
          //     d.label,
          //     BaseConfig.nameFontSize
          //   )[0];
          //   const width = BaseConfig.itemPadding + BaseConfig.nameMarginLeft + labelWidth + BaseConfig.rootPadding + BaseConfig.childCountWidth;
          //   return width;
          // },
          nodesepFunc: function nodesepFunc(d) {
            if (d.id.indexOf("node") != 0) {
              return 10;
            } else {
              return 10;
            }
          },
          ranksepFunc: function ranksepFunc(d) {
            // console.log(d)
            // console.log(d.id)
            if (d.id.indexOf("result00") != -1) {
              return 30;
            } else if (d.id.indexOf("node") != -1) {
              return 110;
            } else if (d.id.indexOf("name") != -1) {
              return 110;
            } else if (d.id.indexOf("title") != -1) {
              return 110;
            } else {
              return 220;
            }
          },
          nodesep: 1,
          //   ranksep: 110,
        },
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
        defaultNode: {
          type: "round-rect",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 14,
            },
            
          },
          style: {
            stroke: "#72CC4A",
            width: 150,
          },
        },
        defaultEdge: {
          type: "fund-polyline",
        },
      });
      data.nodes.forEach(function(node) {
        return node.label = fittingString(node.label, 280, 12);
      });
      graph.data(data);
      graph.render();
      const edges = graph.getEdges();
      edges.forEach(function (edge) {
        const line = edge.getKeyShape();
        const stroke = line.attr("stroke");
        const targetNode = edge.getTarget();
        targetNode.update({
          style: {
            stroke,
          },
        });
      });
      graph.paint();

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },
  },
};
</script>
 
<style scoped>
#container {
  width: 99%;
  height: calc(100vh - 190px );
  box-sizing: border-box;
  margin-left: 20px;
}
</style>