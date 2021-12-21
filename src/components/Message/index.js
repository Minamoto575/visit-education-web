import Message from './Message.vue'
const MESSAGE = {
  install(Vue) {
    function dialog(options = {}) {
      return new Promise((resolve, reject) => {
        const MessageConstructor = Vue.extend(Message)
        // instance相当于Message.vue的this
        const instance = new MessageConstructor({
          data: options
        })
        instance.resolve = resolve // 绑定在Message.vue实例上
        instance.reject = reject
        instance.$mount()
        document.body.appendChild(instance.$el)
        Vue.nextTick(() => {
          instance.visible = true
        })
      })
    }
    Vue.prototype.$customMessage = dialog // 挂载到vue原型上，暴露一个方法
  }
}
export default MESSAGE
