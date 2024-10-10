<template>
  <div class="test">

  </div>
</template>

<script>
  export default {
    name : 'test',
    data() {
      return {
        websock: null,
        num: 0
      }
    },
    created() {
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
    },
    methods: {
      initWebSocket(){ //初始化weosocket
        this.num =0
        var url = "";
        var tempUrl = window.document.location.href;
        if(url === ""){
          var url1 = tempUrl.split("//")[1]
          url = url1.split("#")[0];
        }
        var mode = tempUrl.split("://")[0]
        var wsuri = ""
        if (mode == "http") {
          wsuri = "ws://"+ url +"webSocket/admin";
        } if (mode == "https") {
          wsuri = "wss://"+ url +"webSocket/admin";
        }
        // console.log(wsuri)
        // const wsuri = "ws://192.168.1.10:8081/webSocket/admin";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        console.log("123连接成功")
      },
      websocketonerror(){//连接建立失败重连
        this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
        var obj = eval('(' + e.data + ')');
        if ( obj.status == 101 ) {
          var sockobj = {
            title: '警告',
            type: 'warning',
            offset: 60,
            message: obj.message,
            showClose: true,
            duration: '8000',
            onClose:()=> {
              // console.log("关闭事件");
              this.num ++
            }
          }
          if (this.num < 1) {
            console.log(this.num)
            this.$notify(sockobj)
          }
        }
      },
      websocketsend(Data){//数据发送
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
  }
</script>