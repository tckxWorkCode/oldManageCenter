<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>
<script>
export default{
  name: 'SIdentify',
  props: {
    identifyCode: {
      type: String,
      default: '1234'
    },
    fontSizeMin: {
      type: Number,
      default: 40
    },
    fontSizeMax: {
      type: Number,
      default: 40
    },
    backgroundColorMin: {
      type: Number,
      default: 240
    },
    backgroundColorMax: {
      type: Number,
      default: 240
    },
    colorMin: {
      type: Number,
      default: 50
    },
    colorMax: {
      type: Number,
      default: 160
    },
    lineColorMin: {
      type: Number,
      default: 150
    },
    lineColorMax: {
      type: Number,
      default: 150
    },
    dotColorMin: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 0
    },
    contentWidth: {
      type: Number,
      default: 100
    },
    contentHeight: {
      type: Number,
      default: 40
    }
  },
  methods: {
    // 生成一个随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(255,255,255)'
      //return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic () {
      let canvas = document.getElementById('s-canvas')
      let ctx = canvas.getContext('2d')
      // ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillStyle = 'rgb(17,53,67)'
      // ctx.fillStyle = 'rgba(255,255,255,0)'
      // ctx.clearRect(0,0,140,40)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      // console.log(this.identifyCode)
       this.drawLine(ctx)
    //  this.drawDot(ctx)
    },
    drawText (ctx, txt, i) {
      ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
      ctx.fillStyle = 'rgb(109,133,140)'
      //ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
      ctx.font = '28px SimHei'
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-45, 45)
      //var deg = this.randomNum(-45, 45)
      // 修改坐标原点和旋转角度
      // ctx.translate(x, y)
      // ctx.rotate(deg * Math.PI / 180)
      //ctx.translate(70, 70)
      if (i === 0) {
        ctx.translate(0, 0)
        ctx.fillText(txt, 10, 30)
      }else if (i === 1) {
        // ctx.translate(0, -10)
        ctx.fillText(txt, 30, 35)
      } else if (i === 2) {
        ctx.fillText(txt, 50, 30)
      } else if (i === 3) {
        ctx.fillText(txt, 70, 34)
      }
      // ctx.translate(-50, 0)
      // ctx.rotate(0)
      // 恢复坐标原点和旋转角度
      // ctx.rotate(-deg * Math.PI / 180)
      // ctx.translate(-x, -y)
    },
    drawLine (ctx) {
      // 绘制干扰线
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
        ctx.strokeStyle = 'rgb(109,133,140)'
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot (ctx) {
      // 绘制干扰点
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  },
  watch: {
    identifyCode () {
      this.drawPic()
    }
  },
  mounted () {
    this.drawPic()
  }
}
</script>
<style scoped>
.s-canvas {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 40px;
  background: transparent;
}
</style>

