import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import styles from './ChatItem.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import { parseActivityNewsBody } from './../../../models/im/utils/activityHandle.js';
import EmojiItem from './EmojiItem.js';
import {
  isValidEmoji,
  parseEmoji,
  parsePinup
} from './../../../models/im/utils/parseEmoji.js';

class ChatItem extends Component {
  state = {
    isAudioPlaying: false, // 是否正在播放音频消息
    createInnerAudioContext: null // 一个音频实例
  };
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  handleClickItem = (e, type, customType, customItemId) => {
    if (e && e.stopPropagation) e.stopPropagation();

    // 需要跳页面的消息类型
    const shouldJumpType = ['card', 'flow'];
    if (!shouldJumpType.includes(customType)) return;

    // 这里处理跳转
    Taro.showToast({
      title: 'clicked custom item',
      icon: 'none'
    });
  };
  handlePlayAudio = file => {
    let { createInnerAudioContext } = this.state;
    const { url } = file;
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
            title: '开始播放',
            icon: 'none'
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
          title: '开始播放',
          icon: 'none'
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
          title: '暂停播放',
          icon: 'none'
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
    const { url } = file;
    Taro.previewImage({
      urls: [url],
      current: url
    });
  };
  genImageSize = (pixel, rate, side) => {
    const MaxWidthPixel = 200;
    const numWithUnit = num => `${num}px`;
    if (side === 'w') {
      if (pixel <= MaxWidthPixel) {
        return numWithUnit(pixel);
      }
      return numWithUnit(MaxWidthPixel);
    }
    if (side === 'h') {
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
    const nowTimestamp = Date.now();
    const oneDayTimestamp = 1000 * 60 * 60 * 24;
    const todayZeroClockTimestamp = new Date(
      new Date(nowTimestamp).toDateString()
    ).getTime();
    const todayTimeOffset = nowTimestamp - todayZeroClockTimestamp;
    const nowAndInputTimestampOffset = nowTimestamp - timestamp;

    let timeStr = '';
    let dateStr = '';

    try {
      const dateCondMap = new Map([
        [[0, todayTimeOffset], '今天'],
        [[todayTimeOffset, todayTimeOffset + oneDayTimestamp], '昨天'],
        [
          [
            todayTimeOffset + oneDayTimestamp,
            todayTimeOffset + oneDayTimestamp * 2
          ],
          '前天'
        ],
        [
          [todayTimeOffset + oneDayTimestamp * 2, Infinity],
          new Date(timestamp).toLocaleDateString('zh')
        ]
      ]);
      const findDateCond = [...dateCondMap].find(
        ([[key0, key1]]) =>
          nowAndInputTimestampOffset >= key0 &&
          nowAndInputTimestampOffset < key1
      );
      dateStr = findDateCond ? findDateCond[1] : '';
      timeStr = new Date(timestamp).toLocaleTimeString('zh', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
    return `${dateStr === '今天' ? '' : dateStr} ${timeStr}`;
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
      groupNotification
    } = this.props;
    const isPinupEmoji = pushContent && pushContent === '[贴图表情]';
    const { isAudioPlaying } = this.state;

    return (
      <View className={styles.wrapper}>
        {(type === 'text' ||
          type === 'audio' ||
          type === 'custom' ||
          type === 'image') && (
          <View
            className={`${styles.contentWrapper} ${
              flow === 'in' ? styles.contentWrapperIn : styles.contentWrapperOut
            }`}
          >
            <View className={styles.avatarWrapper}>
              {this.isValidImgUrl(avatar) ? (
                <Image src={avatar} className={`${styles.avatar}`} />
              ) : avatar === 'dynamicAssistant' ? (
                <View
                  className={`${globalStyles.global_iconfont} ${
                    styles.avatarAssistant
                  }`}
                  style={{
                    fontSize: '36px',
                    borderRadius: '50%',
                    color: '#fff'
                  }}
                >
                  &#xe645;
                </View>
              ) : (
                <View
                  className={`${globalStyles.global_iconfont} ${styles.avatar}`}
                  style={{
                    fontSize: '36px',
                    borderRadius: '50%'
                  }}
                >
                  &#xe647;
                </View>
              )}
            </View>
            <View className={styles.newsWrapper}>
              {flow === 'in' && (
                <View className={styles.newsName}>{fromNick}</View>
              )}
              <View
                className={`${styles.newsContentWrapper} ${
                  type === 'custom' && !isPinupEmoji
                    ? styles.newContentAssistantWrapper
                    : ''
                }`}
              >
                {type === 'text' && (
                  <View className={styles.newContent}>
                    {parseEmoji(text).map(i => {
                      const { categ, cont } = i;
                      return (
                        <EmojiItem
                          key={categ + cont}
                          categ={isValidEmoji(cont) ? 'emoji' : 'text'}
                          cont={isValidEmoji(cont) ? isValidEmoji(cont) : cont}
                        />
                      );
                    })}
                  </View>
                )}
                {type === 'image' && (
                  <Image
                    onClick={() => this.handlePreviewImage(file)}
                    src={file.url}
                    style={{
                      width: this.genImageSize(
                        file.w,
                        Number(file.w / file.h),
                        'w'
                      ),
                      height: this.genImageSize(
                        file.h,
                        Number(file.w / file.h),
                        'h'
                      )
                    }}
                    mode='aspectFill'
                  />
                )}
                {type === 'custom' && isPinupEmoji && (
                  <View className={styles.pinupWrapper}>
                    <Image
                      src={parsePinup(content)}
                      style={{ width: '100px', height: '100px' }}
                    />
                  </View>
                )}
                {type === 'custom' && !isPinupEmoji && (
                  <View className={styles.customNewsWrapper}>
                    {content && content.data && content.data.d ? (
                      <View className={styles.customNewsContentWrapper}>
                        {[JSON.parse(content.data.d)].map(data => {
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
                            >
                              <Text className={styles.creator}>
                                {creator && creator.name
                                  ? `${creator.name}`
                                  : ''}
                                <Text
                                  style={{
                                    display: 'inline-block',
                                    width: '6px'
                                  }}
                                >
                                  &nbsp;
                                </Text>
                              </Text>
                              {range && range['rangeText'] && (
                                <Text
                                  className={`${styles.range} ${
                                    range && range['isNavigate']
                                      ? styles.customNewsNav
                                      : ''
                                  }`}
                                >
                                  {range['rangeText'] && range['rangeObj']
                                    ? range['rangeText'].replace(
                                        '{placeholder}',
                                        range['rangeObj']['name']
                                      )
                                    : ''}
                                </Text>
                              )}
                              <Text className={styles.action}>
                                {action ? `${action}` : ''}
                                <Text
                                  style={{
                                    display: 'inline-block',
                                    width: '6px'
                                  }}
                                >
                                  &nbsp;
                                </Text>
                              </Text>
                              <Text
                                className={`${styles.thing} ${
                                  activityType === 'card' ||
                                  activityContent['isNavigate']
                                    ? styles.customNewsNav
                                    : ''
                                }`}
                                onClick={e =>
                                  this.handleClickItem(
                                    e,
                                    'custom',
                                    activityType,
                                    activityContent &&
                                      activityContent[activityType] &&
                                      activityContent[activityType]['id']
                                      ? activityContent[activityType]['id']
                                      : null
                                  )
                                }
                              >
                                {activityContent['contentText']
                                  ? `“${activityContent['contentText']}”`
                                  : activityContent[activityType]
                                  ? `“${activityContent[activityType]['name']}”`
                                  : ''}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <Text>未知消息内容</Text>
                    )}
                  </View>
                )}
                {type === 'audio' && (
                  <View
                    className={styles.audioContent}
                    onClick={() => this.handlePlayAudio(file)}
                  >
                    <Text
                      style={{ width: this.genAudioNewsWidth(file.dur) }}
                      className={styles.audioDur}
                    >{`${Math.ceil(file.dur / 1000)}" `}</Text>
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.audioIcon
                      } ${
                        isAudioPlaying
                          ? flow === 'in'
                            ? styles.audioIconPlayingIn
                            : styles.audioIconPlayingOut
                          : ''
                      }`}
                      style={{
                        fontSize: '18px',
                        color: flow === 'in' ? '#313D40' : '#FFFBFE'
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
        )}
        {type === 'timestamp' && (
          <View
            className={`${styles.notificationWrapper} ${
              styles.notificationTime
            }`}
          >{`—— ${this.timestampToTime(time)} ——`}</View>
        )}
        {type === 'notification' && (
          <View
            className={`${styles.notificationWrapper} ${
              styles.notificationGroup
            }`}
          >
            {groupNotification}
          </View>
        )}
      </View>
    );
  }
}

ChatItem.defaultProps = {
  flow: '', // 消息的来源： 收到别人的消息：in | 自己发出的消息 out
  fromNick: '', // 发消息人的 nick name
  avatar: '', // 消息人头像
  status: 'success', // 是否发送成功
  time: 0, // 时间
  type: 'text', // 消息类型
  text: '', // 文本消息内容
  file: {}, // 文件类型的文件
  content: {
    //自定义类型的消息体
    data: {
      d: JSON.stringify({}),
      e: ''
    }
  },
  pushContent: '', //如果是 pinup 类型的表情就会有该字段
  groupNotification: '' //如果是 notification 类型，那么会有该字段
};

export default ChatItem;
