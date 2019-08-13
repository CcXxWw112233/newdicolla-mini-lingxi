// 发送文件消息
export function sendFileMsg ({state, commit}, obj) {
  const nim = state.nim
  let {scene, to, fileInput} = obj
  let type = 'file'
  if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
    type = 'image'
  } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
    type = 'video'
  }
  store.dispatch('showLoading')
  nim.sendFile({
    scene,
    to,
    type,
    fileInput,
    uploadprogress: function (data) {
      // console.log(data.percentageText)
    },
    uploaderror: function () {
      fileInput.value = ''
      // console && console.log('上传失败')
    },
    uploaddone: function(error, file) {
      fileInput.value = ''
      // console.log(error);
      // console.log(file);
    },
    beforesend: function (msg) {
      // console && console.log('正在发送消息, id=', msg);
    },
    done: function (error, msg) {
      onSendMsgDone (error, msg)
    }
  })
}
