<template>
  <div>
    <div :class="dynamicSetIpBoxStyle">
      <el-input v-model.number="ip1"
                maxlength='3' ref='ip1'
                :class="dynamicSetIpInputStyle"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                @keyup.native="keyupEvent(1,$event)"
                @blur="submitIp"
                @input="(val) => handleInpIp(val,'ip1')"
                :size="inputSize"></el-input>
      <span class="dot">.</span>
      <el-input v-model.number="ip2"
                maxlength='3' ref='ip2'
                :class="dynamicSetIpInputStyle"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                @keyup.native="keyupEvent(2,$event)"
                @blur="submitIp"
                @input="(val) => handleInpIp(val,'ip2')"
                :size="inputSize"></el-input>
      <span class="dot">.</span>
      <el-input v-model.number="ip3"
                maxlength='3' ref='ip3'
                :class="dynamicSetIpInputStyle"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                @keyup.native="keyupEvent(3,$event)"
                @blur="submitIp"
                @input="(val) => handleInpIp(val,'ip3')"
                :size="inputSize"></el-input>
      <span class="dot">.</span>
      <el-input v-model.number="ip4"
                maxlength='3' ref='ip4'
                :class="dynamicSetIpInputStyle"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                @keyup.native="keyupEvent(4,$event)"
                @blur="submitIp"
                @input="(val) => handleInpIp(val,'ip4')"
                :size="inputSize"></el-input>
      <i class="el-icon-circle-close" :class="dynamicSetCircleCloseStyle" @click="clearValue"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "IpModel",
  model:{
    prop:"value",
    event:"change",
  },
  props:{
    //inputSize  根element是size一样  有三种选择  mini small medium
    inputSize:{
      type:String,
      default:""
    },
    //boxWidth 三种选择  miniWidth  smallWidth  mediumWidth  不满足样式请自定义样   如下style
    boxWidth:String,
    value:String,
    echoIp:String,
  },
  data() {
    return {
      ip1: null,
      ip2: null,
      ip3: null,
      ip4: null,
      //默认样式
      dynamicSetIpBoxStyle:'ipBoxSmall',
      dynamicSetIpInputStyle:'ipinputSmall',
      dynamicSetCircleCloseStyle:'closeSmall'
    };
  },
  created() {
    if(this.echoIp) {
      let ipList = this.echoIp.split('.');
      this.ip1 = ipList[0];
      this.ip2 = ipList[1];
      this.ip3 = ipList[2];
      this.ip4 = ipList[3];
    }
         
    if(this.boxWidth === 'miniWidth'){
      this.dynamicSetIpBoxStyle = 'ipBoxMini';
      this.dynamicSetIpInputStyle = 'ipinputMini';
      this.dynamicSetCircleCloseStyle = 'closeMini';
    }
    if(this.boxWidth === 'mediumWidth'){
      this.dynamicSetIpBoxStyle = 'ipBoxMedium';
      this.dynamicSetIpInputStyle = 'ipinputMedium';
      this.dynamicSetCircleCloseStyle = 'closeMedium';
    }
    //自定义样式在这里配置
    if(this.boxWidth === 'scanWidth'){
      this.dynamicSetIpBoxStyle = 'ipBoxScan';
      this.dynamicSetIpInputStyle = 'ipinputScan';
      this.dynamicSetCircleCloseStyle = 'closeScan';
    }
  },
  watch:{
    echoIp:{
      handler(val){
        if(val){
          let ipList = val.split('.');
          this.ip1 = ipList[0];
          this.ip2 = ipList[1];
          this.ip3 = ipList[2];
          this.ip4 = ipList[3];
          this.$emit("change",val)
        }
      }
    },
    value:{
      handler(val){
        if(val !== null && val !== undefined){
          let ipList = val.split('.');
          this.ip1 = ipList[0];
          this.ip2 = ipList[1];
          this.ip3 = ipList[2];
          this.ip4 = ipList[3];
        }else {
          this.ip1 = null;
          this.ip2 = null;
          this.ip3 = null;
          this.ip4 = null;
        }
        if(this.ip1 != null && this.ip2 != null && this.ip3 != null && this.ip4 != null) {
          let echo =  this.ip1+'.'+this.ip2+'.'+this.ip3+'.'+this.ip4
          this.$emit("change",echo)
        }
      },
    },

  },
  methods: {
    //监听键盘
    keyupEvent (index,e) {
      //按下.键跳到下一个输入框（同理可做出其他按键的跳转输入框）
      if (e.keyCode === 110 || e.keyCode === 190) {//不同键盘键位对应 . 的值 87键->190  104键->110
        //这里尝试过用this.focusInput发现没有效果（具体原因暂未知....）,待你们完善
        if (index == 1) {
          this.$nextTick(() => {
            this.$refs.ip2.focus();
          });
        } else if (index == 2) {
          this.$nextTick(() => {
            this.$refs.ip3.focus();
          });
        } else {
          this.$nextTick(() => {
            this.$refs.ip4.focus();
          });
        }
      }
    },
    //到失去输入框焦点时
    submitIp () {
      //失去焦点判断值是否输入完整，并向父组件传整个ip值
      if(this.ip1 !=null && this.ip2 != null && this.ip3 != null && this.ip4 != null) {
        let ipVal = this.ip1 + '.' + this.ip2 + '.' + this.ip3 + '.' + this.ip4;
        if (this.ip4 == 0 || this.ip4 == 255 || this.ip1 == 0 || this.ip1 == 255) {
          this.$message.error(ipVal + "格式错误，请输入正确IP")
          return;
        }
        this.$emit('change', ipVal);
        this.$parent.$emit("el.form.change"); //这是防止elementui的form表单验证必填项时显示文字的也就是required,用不到可不写
      }else {
        return;
      }
    },
    //输入的值
    handleInpIp(val, key) {
      //输入数据时  就显示图标
      //当一个表单   多次使用该组件   会使getElementsByClassName获取多个class   暂时不知道怎么去判断    你们可以去完善
     // document.getElementsByClassName(this.dynamicSetCircleCloseStyle).item(0).style.display = 'inline-block';
      //判断输入的ip值  0和255位保留ip  不使用
      if(parseInt(val) > 254) {
        //这里使用 this.focusInput()  发现没有效果，不能跳到下一个输入框（具体原因暂未知....）   留给你们去研究  研究清楚了  记得补充..............
        //补充：
        //输入值超过255，则显示为254，并且跳到下一个输入框
        switch(key) {
          case "ip1":
            this.ip1 = 254;
            this.$refs.ip2.focus();
            break;
          case "ip2":
            this.ip2 = 254;
            this.$refs.ip3.focus();
            break;
          case "ip3":
            this.ip3 = 254;
            this.$refs.ip4.focus();
            break;
          case "ip4":
            this.ip4 = 254;
            break;
          default:
            break;
        }
      }else if(parseInt(val) <= 254 && parseInt(val) >= 100){
        //输入三位数自动跳到下一个输入值
        switch(key) {
          case "ip1":
            this.$refs.ip2.focus();
            break;
          case "ip2":
            this.$refs.ip3.focus();
            break;
          case "ip3":
            this.$refs.ip4.focus();
            break;
          default:
            break;
        }
      }
    },

    clearValue () {
      //重置ip输入框
      this.ip1 = null;
      this.ip2 = null;
      this.ip3 = null;
      this.ip4 = null;
      this.$emit('getIpVal',''); //清除输入框传空值
      //清空输入框时，隐藏图标  当多次使用该组件时    会有多个class不能指定对应点击的class，未达到效果，待你们完善
      // document.getElementsByClassName(this.dynamicSetCircleCloseStyle).item(0).style.display = 'none';
    },
  },


}
</script>

<style scoped>
.dot {
  display: inline-block;
  width: 4px;
  height: 100%;
  line-height: 50%;
}
/***********   medium样式 为默认样式   **********/
.ipBoxMedium{
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 5px;
  line-height: 0px;
  position: relative;
  top: 0;
  left: 0;
}
.ipinputMedium{
  display: inline-block;
  width: 65px;
  font-size: 16px;
}
.ipinputMedium >>> .el-input__inner {
  border: 0;
}
.closeMedium{
  display: none;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right:0px;
  top: 12px;
}
.closeMedium:hover {
  display: inline-block;
}
/***********   small样式    **********/
.ipBoxSmall{
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 5px;
  line-height: 0px;
  width: 216px;
  position: relative;
  top: 0;
  left: 0;
}
.ipinputSmall{
  display: inline-block;
  width: 50px;
  font-size: 14px;
}
.ipinputSmall>>>.el-input__inner {
  padding: 0 10px;
  text-align: center;
  border: 0;
}
.closeSmall{
  display: none;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right:0px;
  top: 13px;
}
.closeSmall:hover {
  display: inline-block;
}
/***********   mini样式    **********/
.ipBoxMini{
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 5px;
  line-height: 0px;
  width: 192px;
  position: relative;
  top: 0;
  left: 0;
}
.ipinputMini{
  display: inline-block;
  width: 44px;
  
  font-size: 14px;

}
.ipinputMini >>> .el-input__inner {
  padding:2px;
  text-align: center;
  border: 0;
}
.closeMini{
  display: none;
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  right:0px;
  top: 12px;
}
.closeMini:hover {
    display: inline-block;
}
/***********   IP扫描样式    **********/
.ipBoxScan{
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 6px;
  line-height: 0px;
  width: 190px;
  position: relative;
  top: 0;
  left: 0;
}
.ipinputScan{
  display: inline-block;
  width: 44px;
  
  font-size: 14px;

}
.ipinputScan>>> .el-input__inner {
  padding:2px;
  /* text-align: center; */
  border: 0;
}
.closeScan{
  display: none;
  font-size: 8px;
  cursor: pointer;
  position: absolute;
  right:0px;
  top: 8px;
}
/* //页面显示时就显示 */
.closeScan:hover {
  display: inline-block;
}
</style>
