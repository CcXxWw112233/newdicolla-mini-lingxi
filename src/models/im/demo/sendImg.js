 /**
   * 发送图片到nos
   */
  function sendImageToNOS(res) {
    wx.showLoading({
      title: '发送中...',
    })
    let self = this
    let tempFilePaths = res.tempFilePaths
    for (let i = 0; i < tempFilePaths.length; i++) {
      // 上传文件到nos
      app.globalData.nim.sendFile({
        // app.globalData.nim.previewFile({
        type: 'image',
        scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
        to: self.data.chatTo,
        wxFilePath: tempFilePaths[i],
        done: function (err, msg) {
          wx.hideLoading()
          // 判断错误类型，并做相应处理
          if (self.handleErrorAfterSend(err)) {
            return
          }
          // 存储数据到store
          self.saveChatMessageListToStore(msg)

          // 滚动到底部
          self.scrollToBottom()
        }
      })
    }
  }

 /**
   * 选择相册图片
   */
function  chooseImageToSend(e) {
    let type = e.currentTarget.dataset.type
    let self = this
    self.setData({
      moreFlag: false
    })
    wx.chooseImage({
      sourceType: ['album'],
      success: function (res) {
        self.sendImageToNOS(res)
      },
    })
  }

/**
   * 选择拍摄视频或者照片
   */
  function chooseImageOrVideo() {
    let self = this
    self.setData({
      moreFlag: false
    })
    wx.showActionSheet({
      itemList: ['照相', '视频'],
      success: function (res) {
        if (res.tapIndex === 0) { // 相片
          wx.chooseImage({
            sourceType: ['camera'],
            success: function (res) {
              self.sendImageToNOS(res)
            },
          })
        } else if (res.tapIndex === 1) { // 视频
          wx.chooseVideo({
            sourceType: ['camera', 'album'],
            success: function (res) {
              if (res.duration > 60) {
                showToast('text', '视频时长超过60s，请重新选择')
                return
              }
              console.log(res);
              // {duration,errMsg,height,size,tempFilePath,width}
              self.sendVideoToNos(res)
            }
          })
        }
      }
    })
  }
