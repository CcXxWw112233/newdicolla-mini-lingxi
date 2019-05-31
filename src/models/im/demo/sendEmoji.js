this.$store.dispatch('sendMsg', {
  type: 'custom',
  scene: this.scene,
  to: this.to,
  pushContent: '[贴图表情]',
  content: {
    type: 3,
    data: {
      catalog: this.currAlbum,
      chartlet: emoji.key
    }
  }
})

// 发送普通消息
export function sendMsg ({state, commit}, obj) {
  const nim = state.nim
  obj = obj || {}
  let type = obj.type || ''
  store.dispatch('showLoading')
  switch (type) {
    case 'text':
      nim.sendText({
        scene: obj.scene,
        to: obj.to,
        text: obj.text,
        done: onSendMsgDone,
        needMsgReceipt: obj.needMsgReceipt || false
      })
      break
    case 'custom':
      nim.sendCustomMsg({
        scene: obj.scene,
        to: obj.to,
        pushContent: obj.pushContent,
        content: JSON.stringify(obj.content),
        done: onSendMsgDone
      })
  }
}
