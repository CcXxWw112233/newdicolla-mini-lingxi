import { connect } from "@tarojs/redux";
import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import styles from "./ChatItem.scss";
import globalStyles from "./../../../gloalSet/styles/globalStyles.scss";
import { parseActivityNewsBody } from "./../../../models/im/utils/activityHandle.js";
import { timestampFormat } from "../../../utils/basicFunction";
import EmojiItem from "./EmojiItem.js";
import {
  isValidEmoji,
  parseEmoji,
  parsePinup
} from "./../../../models/im/utils/parseEmoji.js";
import { onResendMsg } from "./../../../models/im/actions/onResendMsg.js";
import { onDeleteMsg } from "./../../../models/im/actions/onDeleteMsg.js";
import { timestampToTimeNormal } from "../../../utils/util";

@connect(({ im: { currentGroupSessionList, history_newSession } }) => ({
  currentGroupSessionList,
  history_newSession
}))
class ChatItem extends Component {
  state = {
    isAudioPlaying: false, // 是否正在播放音频消息
    createInnerAudioContext: null, // 一个音频实例
    _index: ""
  };
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };

  // 点击消息跳页面的消息类型
  handleClickItem = (e, type, customType, customItemId) => {
    // if (e && e.stopPropagation) e.stopPropagation();
    // // 需要跳页面的消息类型
    // const shouldJumpType = ['card', 'flow'];
    // if (!shouldJumpType.includes(customType)) return;
    // // 这里处理跳转
    // Taro.showToast({
    //   title: 'clicked custom item',
    //   icon: 'none'
    // });
  };

  handlePlayAudio = file => {
    let { createInnerAudioContext } = this.state;
    const { url } = typeof file === "string" ? JSON.parse(file) : file;
    if (!createInnerAudioContext) {
      createInnerAudioContext = Taro.createInnerAudioContext();
      createInnerAudioContext.src = url;

      //监听播放完毕事件
      createInnerAudioContext.onEnded(() => {
        this.setState({
          isAudioPlaying: false
        });
      });
      this.setState(
        {
          createInnerAudioContext
        },
        () => {
          Taro.showToast({
            title: "开始播放",
            icon: "none",
            duration: 2000
          });
          this.setState(
            {
              isAudioPlaying: true
            },
            () => {
              createInnerAudioContext.play();
            }
          );
        }
      );
    } else {
      if (createInnerAudioContext.paused) {
        Taro.showToast({
          title: "开始播放",
          icon: "none",
          duration: 2000
        });
        this.setState(
          {
            isAudioPlaying: true
          },
          () => {
            createInnerAudioContext.play();
          }
        );
      } else {
        Taro.showToast({
          title: "暂停播放",
          icon: "none",
          duration: 2000
        });
        this.setState(
          {
            isAudioPlaying: false
          },
          () => {
            createInnerAudioContext.pause();
          }
        );
      }
    }
  };

  handlePreviewImage = file => {
    file = typeof file === "string" ? JSON.parse(file) : file;
    const { url } = file;
    Taro.previewImage({
      urls: [url],
      current: url
    });
  };
  genImageSize = (pixel, rate, side) => {
    const MaxWidthPixel = 200;
    const numWithUnit = num => `${num}px`;
    if (side === "w") {
      if (pixel <= MaxWidthPixel) {
        return numWithUnit(pixel);
      }
      return numWithUnit(MaxWidthPixel);
    }
    if (side === "h") {
      const widthReal = pixel * rate;
      if (widthReal <= MaxWidthPixel) {
        return numWithUnit(pixel);
      }
      return numWithUnit(MaxWidthPixel / rate);
    }
  };
  genAudioNewsWidth = ms => {
    const maxWidth = 160;
    const minWidth = 20;
    const second = ms / 1000;
    const step = 15;
    const ret =
      second * step >= maxWidth
        ? maxWidth
        : second * step <= minWidth
        ? minWidth
        : second * step;
    return `${ret}px`;
  };
  timestampToTime = timestamp => {
    if (timestamp.length === 10) {
      timestamp = timestamp + "000";
    }
    timestamp = +timestamp;
    // console.log(timestamp)
    const nowTimestamp = Date.now();
    const oneDayTimestamp = 1000 * 60 * 60 * 24;
    const todayZeroClockTimestamp = new Date(
      new Date(nowTimestamp).toDateString()
    ).getTime();
    const todayTimeOffset = nowTimestamp - todayZeroClockTimestamp;
    const nowAndInputTimestampOffset = nowTimestamp - timestamp;

    let timeStr = "";
    let dateStr = "";

    try {
      const dateCondMap = new Map([
        [[0, todayTimeOffset], "今天"],
        [[todayTimeOffset, todayTimeOffset + oneDayTimestamp], "昨天"],
        [
          [
            todayTimeOffset + oneDayTimestamp,
            todayTimeOffset + oneDayTimestamp * 2
          ],
          "前天"
        ],
        [
          [todayTimeOffset + oneDayTimestamp * 2, Infinity],
          new Date(timestamp).toLocaleDateString("zh")
        ]
      ]);
      const findDateCond = [...dateCondMap].find(
        ([[key0, key1]]) =>
          nowAndInputTimestampOffset >= key0 &&
          nowAndInputTimestampOffset < key1
      );
      // console.log(timestamp);
      dateStr = findDateCond ? findDateCond[1] : "";
      if (
        dateStr === "今天" ||
        dateStr === "昨天" ||
        dateStr === "前天" ||
        dateStr === ""
      ) {
        timeStr = timestampFormat(timestamp, "hh:mm");
        let hour = parseInt(timeStr.split(":")[0]);
        timeStr = hour > 12 ? "下午 " + timeStr : "上午 " + timeStr;
      } else {
        timeStr = timestampFormat(timestamp, "MM月dd日 hh:mm");
      }

      // console.log("dateStr",dateStr);
      // console.log("timeStr",timeStr);
    } catch (error) {
      // console.log("ERROR",error);
      return timestamp;
    }
    return `${dateStr === "今天" ? "" : dateStr} ${timeStr}`;
  };

  onResendMessage = someMsg => {
    const { history_newSession, dispatch } = this.props;
    // 1.1 遍历出失败的那条在本地渲染列表数组中删掉
    Array.prototype.removeByValue = function(val) {
      for (var i = 0; i < this.length; i++) {
        if (JSON.stringify(this[i]).indexOf(JSON.stringify(val)) != -1) {
          this.splice(i, 1);
          break;
        }
      }
      return this;
    };
    Taro.showActionSheet({
      itemList: ["重新发送", "删除"]
    })
      .then(res => {
        let { tapIndex } = res;
        if (tapIndex === 0) {
          // 删除这条失败的数据
          let arr = [...history_newSession].removeByValue(someMsg);
          dispatch({
            type: "im/updateStateFieldByCover",
            payload: {
              history_newSession: arr
            }
          });
        } else if (tapIndex === 1) {
          // 删除
          let arr = [...history_newSession].removeByValue(someMsg);
          dispatch({
            type: "im/updateStateFieldByCover",
            payload: {
              history_newSession: arr
            }
          });
        }
      })
      .catch(err => console.log(err.errMsg));

    /**
     * 重新发送
     */

    let contentStr =
      someMsg && someMsg.content ? JSON.stringify(someMsg.content) : "";
    someMsg.content = contentStr;
    // 1.2 把需要重新发送的那条消息重新发送
    onResendMsg(someMsg);
  };

  bindpause = e => {};
  startPlay = e => {
    var _index = e.currentTarget.dataset.id;
    this.setState({
      _index: _index
    });
    //停止正在播放的视频
    var videoContextPrev = Taro.createVideoContext(_index + "");

    videoContextPrev.stop();
    setTimeout(function() {
      //将点击视频进行播放
      var videoContext = Taro.createVideoContext(_index + "");
      videoContext.play();
    }, 500);
  };

  getSubStr(str) {
    str = str && str.replace(/<\/?.+?>/g, "");
    if (!str.match(/^[ ]*$/) && str.length > 20) {
      var subStr1 = str.substr(0, 8);
      var subStr2 = str.substr(str.length - 8);
      var subStr = subStr1 + "..." + subStr2;
      return subStr;
    }
    return str;
  }

  longPressRecallAction = someMsg => {
    const { time, flow } = someMsg;

    var currentTime = new Date().getTime(); //当前时间(毫秒)
    const subtractTime = currentTime - time; // 时间差的毫秒数
    //自己发送并且2分钟之内才可以撤回
    if (flow === "out" && subtractTime / 1000 < 120) {
      Taro.showActionSheet({
        itemList: ["撤回"]
      })
        .then(res => {
          let { tapIndex } = res;
          if (tapIndex === 0) {
            onDeleteMsg(someMsg);
          }
        })
        .catch(err => console.log(err.errMsg));
    }
  };

  // 转换type的值
  getCustomType = type => {
    if (!type) {
      return "";
    }
    let ActionTypes = {
      "board.card.*": "card",
      "board.file.*": "file",
      "board.folder.*": "folder",
      "board.flow.*": "flow",
      "board.milestone.*": "milestone"
    };
    let t = "board";
    for (let o in ActionTypes) {
      let reg = new RegExp("(" + o + ")");
      if (reg.test(type)) {
        t = ActionTypes[o];
      }
    }
    return t;
  };
  // 动态通知点击
  activityClick = val => {
    let { dispatch, fromType } = this.props;
    if (fromType && fromType == "file") {
      return;
    }
    let type = this.getCustomType(val.action);
    let { content = {} } = val;
    let { board_file = {}, board = {} } = content;
    if (type == "file") {
      dispatch({
        type: "file/updateDatas",
        payload: {
          current_custom_message: {
            id: board_file.id,
            actionType: type,
            board_id: board.id
          }
        }
      });
      Taro.navigateTo({
        url: "/pages/filesChat/index"
      });
    }
  };

  // 点击复制链接参会
  handleSetClipboardData = ({ start_url }) => {
    wx.setClipboardData({
      data: start_url,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data); // data
          }
        });
      }
    });
  };

  render() {
    const {
      flow,
      fromNick,
      avatar,
      type,
      text,
      time,
      file,
      content,
      pushContent,
      groupNotification,
      status,
      someMsg
    } = this.props;
    // const isPinupEmoji = pushContent && pushContent === '[贴图表情]';
    const isPinupEmoji = content && content.type == 3;
    const { isAudioPlaying } = this.state;

    const someMsgContent = someMsg && someMsg.content;
    const someMsgContentData = someMsgContent && someMsgContent.data;
    const someMsgContentDataD = someMsgContentData && someMsgContentData.d;
    const someMsgContentDataDToJSON =
      someMsgContentDataD && JSON.parse(someMsgContentDataD);
    const someMsgContentDataDAction =
      someMsgContentDataDToJSON && someMsgContentDataDToJSON.action;
    // console.log(someMsgContentDataDToJSON, "sssssss_someMsgContentData");
    let iconAvatar;
    let from_nick;
    if (
      someMsgContentDataDAction &&
      someMsgContentDataDAction.indexOf("board.file") != -1
    ) {
      iconAvatar = (
        <Text
          className={`${globalStyles.global_iconfont} ${styles.icon_avatar_style}`}
        >
          &#xe690;
        </Text>
      );
      from_nick = "文件助手";
    } else if (
      someMsgContentDataDAction &&
      someMsgContentDataDAction.indexOf("board.card") != -1
    ) {
      iconAvatar = (
        <Text
          className={`${globalStyles.global_iconfont} ${styles.icon_avatar_style}`}
        >
          &#xe66a;
        </Text>
      );
      from_nick = "任务助手";
    } else if (
      someMsgContentDataDAction &&
      someMsgContentDataDAction.indexOf("board.update") != -1
    ) {
      iconAvatar = (
        <Text
          className={`${globalStyles.global_iconfont} ${styles.icon_avatar_style}`}
        >
          &#xe63c;
        </Text>
      );
      from_nick = "项目助手";
    } else {
      iconAvatar = (
        <Text
          className={`${globalStyles.global_iconfont} ${styles.icon_default_avatar_style}`}
        >
          &#xe647;
        </Text>
      );
      from_nick = fromNick ? fromNick : "聆悉助手";
    }
    return (
      <View className={styles.wrapper}>
        {(type === "text" ||
          type === "audio" ||
          type === "custom" ||
          type === "image" ||
          type === "video") && (
          <View
            className={`${styles.contentWrapper} ${
              flow === "in" ? styles.contentWrapperIn : styles.contentWrapperOut
            }`}
          >
            <View className={styles.avatarWrapper}>
              {this.isValidImgUrl(avatar) ? (
                <Image src={avatar} className={`${styles.avatar}`} />
              ) : avatar === "dynamicAssistant" ? (
                <View
                  className={`${globalStyles.global_iconfont} ${styles.avatarAssistant}`}
                  style={{
                    fontSize: "36px",
                    borderRadius: "50%",
                    color: "#fff"
                  }}
                >
                  &#xe645;
                </View>
              ) : (
                <View
                  className={`${globalStyles.global_iconfont} ${styles.avatar}`}
                  style={{
                    fontSize: "36px",
                    borderRadius: "50%"
                  }}
                >
                  {iconAvatar}
                </View>
              )}
            </View>

            <View
              className={styles.messageConcentWrapper}
              onLongPress={this.longPressRecallAction.bind(this, someMsg)}
            >
              {status === "fail" ? (
                <View onClick={this.onResendMessage.bind(this, someMsg)}>
                  <Text
                    className={`${globalStyles.global_iconfont} ${styles.failWrapper}`}
                  >
                    &#xe848;
                  </Text>
                </View>
              ) : (
                ""
              )}
              <View className={styles.newsWrapper}>
                {flow === "in" && (
                  <View className={styles.newsName}>{from_nick}</View>
                )}
                <View
                  className={`${styles.newsContentWrapper} ${
                    type === "custom" && !isPinupEmoji
                      ? styles.newContentAssistantWrapper
                      : ""
                  }`}
                >
                  {type === "text" && (
                    <View className={styles.newContent}>
                      {parseEmoji(text).map(i => {
                        const { categ, cont } = i;
                        return (
                          <EmojiItem
                            key={categ + cont}
                            categ={isValidEmoji(cont) ? "emoji" : "text"}
                            cont={
                              isValidEmoji(cont) ? isValidEmoji(cont) : cont
                            }
                          />
                        );
                      })}
                    </View>
                  )}
                  {type === "image" && (
                    <Image
                      onClick={() => this.handlePreviewImage(file)}
                      src={
                        typeof file === "string"
                          ? JSON.parse(file).url
                          : file.url
                      }
                      style={{
                        width: this.genImageSize(
                          file.w,
                          Number(file.w / file.h),
                          "w"
                        ),
                        height: this.genImageSize(
                          file.h,
                          Number(file.w / file.h),
                          "h"
                        )
                      }}
                      mode="aspectFill"
                    />
                  )}
                  {type === "video" && (
                    <Video
                      poster-for-crawler={file.url + "&vframe"}
                      src={
                        typeof file === "string"
                          ? JSON.parse(file).url
                          : file.url
                      }
                      duration={parseInt(
                        `${Math.ceil(
                          ((typeof file === "string"
                            ? JSON.parse(file).dur
                            : file.dur) || 0) / 1000
                        )}" `
                      )}
                      loop={true}
                      onPlay={this.startPlay}
                      onPause={this.bindpause}
                      bindplause
                      style={{
                        width: this.genImageSize(
                          file.w,
                          Number(file.w / file.h),
                          "w"
                        ),
                        height: this.genImageSize(
                          file.h,
                          Number(file.w / file.h),
                          "h"
                        )
                      }}
                    ></Video>
                  )}
                  {type === "custom" && isPinupEmoji && (
                    <View className={styles.pinupWrapper}>
                      <Image
                        src={parsePinup(content)}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </View>
                  )}
                  {type === "custom" && !isPinupEmoji && (
                    <View className={styles.customNewsWrapper}>
                      {content && content.data && content.data.d ? (
                        <View className={styles.customNewsContentWrapper}>
                          {[JSON.parse(content.data.d)].map((data, index) => {
                            const {
                              activityType,
                              creator,
                              action,
                              activityContent,
                              range
                            } = parseActivityNewsBody(data);

                            return (
                              <View
                                key={data.creatorId}
                                className={styles.customNewsContent}
                                onClick={this.activityClick.bind(this, data)}
                              >
                                <Text className={styles.creator}>
                                  {creator && creator.name
                                    ? `${creator.name}`
                                    : ""}
                                  <Text
                                    style={{
                                      display: "inline-block",
                                      width: "6px"
                                    }}
                                  >
                                    &nbsp;
                                  </Text>
                                </Text>
                                <Text className={styles.action}>
                                  {/* {action ? `${action}` : ''} */}
                                  {action === "项目成员角色发生变更"
                                    ? `${"将" +
                                        (activityContent &&
                                          activityContent.rela_users[0]) +
                                        "在" +
                                        (activityContent &&
                                          activityContent.board.name) +
                                        "项目中的角色设置为" +
                                        (activityContent &&
                                          activityContent.rela_data)}`
                                    : `${action}`}

                                  <Text
                                    style={{
                                      display: "inline-block",
                                      width: "6px"
                                    }}
                                  >
                                    &nbsp;
                                  </Text>
                                </Text>
                                {range && range["rangeText"] && (
                                  <Text
                                    className={`${styles.range} ${
                                      range && range["isNavigate"]
                                        ? styles.customNewsNav
                                        : ""
                                    }`}
                                  >
                                    {range["rangeText"] && range["rangeObj"]
                                      ? range["rangeText"].replace(
                                          "{placeholder}",
                                          range["rangeObj"]["name"]
                                        )
                                      : "sssss"}
                                  </Text>
                                )}
                                <Text
                                  className={`${styles.thing} ${
                                    activityType === "card" ||
                                    activityContent["isNavigate"] ||
                                    activityType == "meeting"
                                      ? styles.customNewsNav
                                      : ""
                                  }`}
                                  onClick={e =>
                                    this.handleClickItem(
                                      e,
                                      "custom",
                                      activityType,
                                      activityContent &&
                                        activityContent[activityType] &&
                                        activityContent[activityType]["id"]
                                        ? activityContent[activityType]["id"]
                                        : null
                                    )
                                  }
                                >
                                  {this.getSubStr(
                                    activityContent["contentText"]
                                      ? `“${activityContent["contentText"]}”`
                                      : activityContent[activityType]
                                      ? `“${
                                          activityContent[activityType]["name"]
                                            ? activityContent[activityType][
                                                "name"
                                              ]
                                            : activityContent[activityType][
                                                "meeting_name"
                                              ]
                                        }”`
                                      : ""
                                  )}
                                </Text>
                                {activityType == "meeting" && (
                                  <View>
                                    {activityContent[activityType][
                                      "start_time"
                                    ] && (
                                      <Text
                                        style={{ color: "rgba(0,0,0,0.35)" }}
                                      >
                                        {timestampToTimeNormal(
                                          activityContent[activityType][
                                            "start_time"
                                          ],
                                          "/",
                                          true
                                        )}
                                        开始
                                      </Text>
                                    )}
                                    <View
                                      onClick={() => {
                                        this.handleSetClipboardData({
                                          start_url:
                                            activityContent[activityType][
                                              "start_url"
                                            ]
                                        });
                                      }}
                                      className={styles.meeting_btn}
                                    >
                                      复制链接参会
                                    </View>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      ) : (
                        <Text>未知消息内容</Text>
                      )}
                    </View>
                  )}
                  {type === "audio" && (
                    <View
                      className={styles.audioContent}
                      onClick={() => this.handlePlayAudio(file)}
                    >
                      <Text
                        style={{
                          width: this.genAudioNewsWidth(
                            typeof file === "string"
                              ? JSON.parse(file).dur
                              : file.dur
                          )
                        }}
                        className={styles.audioDur}
                      >{`${Math.ceil(
                        ((typeof file === "string"
                          ? JSON.parse(file).dur
                          : file.dur) || 0) / 1000
                      )}" `}</Text>
                      <View
                        className={`${globalStyles.global_iconfont} ${
                          styles.audioIcon
                        } ${
                          isAudioPlaying
                            ? flow === "in"
                              ? styles.audioIconPlayingIn
                              : styles.audioIconPlayingOut
                            : ""
                        }`}
                        style={{
                          fontSize: "18px",
                          color: flow === "in" ? "#313D40" : "#FFFBFE"
                        }}
                      >
                        {/* &#xe656; */}
                      </View>
                    </View>
                  )}
                  <View className={styles.newsContentBubble} />
                </View>
              </View>
            </View>
          </View>
        )}
        {type === "timestamp" && (
          <View
            className={`${styles.notificationWrapper} ${styles.notificationTime}`}
          >{`—— ${this.timestampToTime(time)} ——`}</View>
        )}
        {type === "tip" && (
          <View
            className={`${styles.notificationWrapperTip} ${styles.notificationTip}`}
          >
            <View className={styles.notificationTipText}>{`${
              text ? text : '"' + fromNick + '"' + " 撤回了一条消息"
            }`}</View>
          </View>
        )}
        {/* {type === 'notification' && (  //此种类型暂时不处理
          <View
            className={`${styles.notificationWrapper} ${
              styles.notificationGroup
              }`}
          >
            {groupNotification}
          </View>
        )} */}
      </View>
    );
  }
}

ChatItem.defaultProps = {
  flow: "", // 消息的来源： 收到别人的消息：in | 自己发出的消息 out
  fromNick: "", // 发消息人的 nick name
  avatar: "", // 消息人头像
  status: "success", // 是否发送成功
  time: 0, // 时间
  type: "text", // 消息类型
  text: "", // 文本消息内容
  file: {}, // 文件类型的文件
  content: {
    //自定义类型的消息体
    data: {
      d: "",
      e: ""
    }
  },
  pushContent: "", //如果是 pinup 类型的表情就会有该字段
  groupNotification: "", //如果是 notification 类型，那么会有该字段
  someMsg: {} //消息内容
};

export default ChatItem;
