<template>
  <transition name="fade" @after-leave="handleAfterLeave">
    <div v-show="visible" class="message">
      <div class="dialog">
        <div v-if="title" class="title">{{ title }}</div>
        <div class="content">{{ content || "请填写提示内容！" }}</div>
        <div class="button-ground">
          <button v-if="showCancel" class="button" :style="{color:cancelColor}" @click="cancel">
            <p class="ellipsis">{{ cancelText || "取消" }}</p>
          </button>
          <button class="button" :style="{color:confirmColor}" @click="confirm">
            <p class="ellipsis">{{ confirmText || "确定" }}</p>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      visible: false, // 显示与隐藏
      showCancel: true, // 是否显示取消按钮
      title: null, // 提示的标题
      content: null, // 提示的内容
      cancelText: null, // 取消按钮的文字
      cancelColor: null, // 取消按钮的文字颜色
      confirmText: null, // 确认按钮的文字
      confirmColor: null// 确认按钮的文字颜色
    }
  },
  methods: {
    confirm() {
      this.close('confirm')
    },
    cancel() {
      this.close('cancel')
    },
    close(action) {
      this.visible = false
      if (typeof this.callback === 'function') {
        // 使用callback接收
        this.callback(action)
        this.resolve(action)// 改promise的pending状态
      } else {
        // 使用then和catch接收
        if (action === 'confirm') {
          this.resolve(action)
        } else if (action === 'cancel') {
          this.reject(action)
        }
      }
    },
    handleAfterLeave() {
      document.body.removeChild(this.$el) // 从body中移除dom,将v-show换成v-if也能移除dom
      this.$destroy(true)// 销毁组件
    }
  }
}
</script>
<style scoped lang="scss">
.fade-enter-active,.fade-leave-active{
  opacity: 1;
  transition: opacity .3s;
}
.fade-enter,.fade-leave-to{
  opacity: 0;
}
.ellipsis{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.message{
  user-select: none;
  -webkit-user-select: none;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999999;
  background: rgba($color: #000, $alpha: 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  .dialog{
    width: 100%;
    max-width: 320px;
    background: #fff;
    overflow: hidden;
    border-radius: 6px;
    padding-top:25px;
    margin-bottom: 60px;
    .title{
      font-size: 16px;
      font-weight: bold;
      color: #000;
      text-align: center;
      padding: 0px 20px;
      margin-bottom: 18px;
    }
    .content{
      font-size: 16px;
      color: #333;
      text-align: center;
      padding: 0px 20px;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    .button-ground{
      position: relative;
      display: flex;
      &::before{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        border-top: 1px solid #f5f5f5;
        transform: scaleY(0.5);
      }
      .button{
        position: relative;
        cursor: pointer;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        outline: none;
        //padding: 10px 10px;
        font-size: 16px;
        min-width: 50%;
        &:active{
          background: rgba($color: #f5f5f5, $alpha: 1);
          opacity: 0.8;
        }
        &:nth-of-type(n+2){
          &::before{
            content: '';
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            border-left: 1px solid #f5f5f5;
            transform: scaleX(0.5);
          }
        }
      }
    }
  }
}
</style>
