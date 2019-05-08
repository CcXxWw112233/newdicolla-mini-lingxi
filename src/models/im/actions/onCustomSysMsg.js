function onCustomSysMsg(sysMsg) {
    console.log('onCustomSysMsg :', sysMsg)

    //多端同步 正在输入自定义消息类型需要过滤
    // let content = JSON.parse(sysMsg.content);
    // let id = content.id;
    // if (id == 1) {
    //   return;
    // }
    // /** 群视频通知 */
    // if (id == 3) {
    //   // {apnsText,content:{id,members,teamId,room,type},from,to}
    //   let pages = getCurrentPages()
    //   let currentPage = pages[pages.length - 1]
    //   if (currentPage.route.includes('videoCallMeeting') === false) { // 不在多人通话中，才提示
    //     sysMsg.content = content
    //     store.dispatch({
    //       type: 'Netcall_Set_GroupCall',
    //       payload: sysMsg
    //     })
    //     wx.navigateTo({
    //       url: `/partials/videoCallMeeting/videoCallMeeting?beCalling=true`,
    //     })
    //   }
    //   return;
    // }
}

export default onCustomSysMsg
