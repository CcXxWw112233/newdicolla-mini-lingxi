/**
   * 深度克隆friendCata
   */
  function deepClone(data) {
    let des = {}
    for (let cataKey in data) {
      let desArr = data[cataKey]

      des[cataKey] = []
      desArr.map(item => {
        let temp = {}
        for (let key in item) {
          temp[key] = item[key]
        }
        des[cataKey].push(temp)
      })
    }
    return des
  }

/**
 * 计算在线 状态
 * [account,clientType,custom:{1:{net_state:1,online_state:0}},idClient,idServer,serverConfig,time,type,value]
 */
function updateMultiPortStatus(data) {
  if (data.account) {
    let account = data.account
    let multiPortStatus = ''
    function getMultiPortStatus(customType, custom) {
      // 服务器下推多端事件标记的特定序号对应值
      var netState = {
        0: '',
        1: 'Wifi',
        2: 'WWAN',
        3: '2G',
        4: '3G',
        5: '4G'
      }
      var onlineState = {
        0: '在线',
        1: '忙碌',
        2: '离开'
      }

      var custom = custom || {}
      if (customType !== 0) {
        // 有serverConfig.online属性，已被赋值端名称
        custom = custom[customType]
      } else if (custom[4]) {
        custom = custom[4]
        multiPortStatus = '电脑'
      } else if (custom[2]) {
        custom = custom[2]
        multiPortStatus = 'iOS'
      } else if (custom[1]) {
        custom = custom[1]
        multiPortStatus = 'Android'
      } else if (custom[16]) {
        custom = custom[16]
        multiPortStatus = 'Web'
      } else if (custom[64]) {
        custom = custom[64]
        multiPortStatus = 'Mac'
      }
      if (custom) {
        custom = JSON.parse(custom)
        if (typeof custom['net_state'] === 'number') {
          var tempNetState = netState[custom['net_state']]
          if (tempNetState) {
            multiPortStatus += ('[' + tempNetState + ']')
          }
        }
        if (typeof custom['online_state'] === 'number') {
          multiPortStatus += onlineState[custom['online_state']]
        } else {
          multiPortStatus += '在线'
        }
      }
      return multiPortStatus
    }
    // demo自定义多端登录同步事件
    if (+data.type === 1) {
      if (+data.value === 1 || +data.value === 2 || +data.value === 3 || +data.value === 10001) {
        var serverConfig = JSON.parse(data.serverConfig)
        var customType = 0
        multiPortStatus = ''
        // 优先判断serverConfig字段
        if (serverConfig.online) {
          if (serverConfig.online.indexOf(4) >= 0) {
            multiPortStatus = '电脑'
            customType = 4
          } else if (serverConfig.online.indexOf(2) >= 0) {
            multiPortStatus = 'iOS'
            customType = 2
          } else if (serverConfig.online.indexOf(1) >= 0) {
            multiPortStatus = 'Android'
            customType = 1
          } else if (serverConfig.online.indexOf(16) >= 0) {
            multiPortStatus = 'Web'
            customType = 16
          } else if (serverConfig.online.indexOf(64) >= 0) {
            multiPortStatus = 'Mac'
            customType = 64
          }
        }
        if (data.custom && (Object.keys(data.custom).length > 0)) {
          var portStatus = getMultiPortStatus(customType, data.custom)
          // 如果serverConfig里有属性而custom里没有对应属性值
          if ((multiPortStatus !== '') && (portStatus === '')) {
            multiPortStatus += '在线'
          } else {
            multiPortStatus = portStatus
            // multiPortStatus += portStatus
          }
        } else if (customType !== 0) {
          multiPortStatus += '在线'
        } else {
          multiPortStatus = '离线'
        }
        return multiPortStatus
      }
    }
  }
  return '离线'
}

export {
  deepClone,
  updateMultiPortStatus,
}
