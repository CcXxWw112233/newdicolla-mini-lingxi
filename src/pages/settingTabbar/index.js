import { Block, View, Text, Slider, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";

import styles from "./index.scss";

export default class DragPage extends Taro.Component {
  state = {
    curZ: -1,
    cur: -1,
    tranX: 0,
    tranY: 0,
    overOnePage: false,
    listData: [
      {
        name: "日历",
        key: "calendar"
      },
      {
        name: "项目圈",
        key: "board_topics"
      },
      {
        name: "文件",
        key: "file"
      },
      {
        name: "会协宝",
        key: "huixiebao"
      }
    ]
  };

  componentDidMount() {
    this.init();
  }

  longPress(e) {
    this.setState({
      touch: true
    });

    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

    let index = e.currentTarget.dataset.index;

    if (this.state.columns === 1) {
      // 单列时候X轴初始不做位移
      this.tranX = 0;
    } else {
      // 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
      this.tranX = this.startX - this.item.width / 2 - this.itemWrap.left;
    }

    // 计算Y轴初始位移, 使 item 垂直中心移动到点击处
    this.tranY = this.startY - this.item.height / 2 - this.itemWrap.top;

    this.setState({
      cur: index,
      curZ: index,
      tranX: this.tranX,
      tranY: this.tranY
    });

    Taro.vibrateShort();
  }
  touchMove(e) {
    if (!this.state.touch) return;
    let tranX = e.touches[0].pageX - this.startX + this.tranX,
      tranY = e.touches[0].pageY - this.startY + this.tranY;

    let overOnePage = this.state.overOnePage;

    // 判断是否超过一屏幕, 超过则需要判断当前位置动态滚动page的位置
    if (overOnePage) {
      if (e.touches[0].clientY > this.windowHeight - this.item.height) {
        Taro.pageScrollTo({
          scrollTop: e.touches[0].pageY + this.item.height - this.windowHeight,
          duration: 300
        });
      } else if (e.touches[0].clientY < this.item.height) {
        Taro.pageScrollTo({
          scrollTop: e.touches[0].pageY - this.item.height,
          duration: 300
        });
      }
    }

    this.setState({ tranX: tranX, tranY: tranY });

    let originKey = e.currentTarget.dataset.key;

    let endKey = this.calculateMoving(tranX, tranY);

    // 防止拖拽过程中发生乱序问题
    if (originKey == endKey || this.originKey == originKey) return;

    this.originKey = originKey;

    this.insert(originKey, endKey);
  }
  calculateMoving(tranX, tranY) {
    let rows = Math.ceil(this.state.list.length / this.state.columns) - 1,
      i = Math.round(tranX / this.item.width),
      j = Math.round(tranY / this.item.height);

    i = i > this.state.columns - 1 ? this.state.columns - 1 : i;
    i = i < 0 ? 0 : i;

    j = j < 0 ? 0 : j;
    j = j > rows ? rows : j;

    let endKey = i + this.state.columns * j;

    endKey =
      endKey >= this.state.list.length ? this.state.list.length - 1 : endKey;

    return endKey;
  }
  insert(origin, end) {
    let list;

    if (origin < end) {
      list = this.state.list.map(item => {
        if (item.key > origin && item.key <= end) {
          item.key = item.key - 1;
        } else if (item.key == origin) {
          item.key = end;
        }
        return item;
      });
      this.getPosition(list);
    } else if (origin > end) {
      list = this.state.list.map(item => {
        if (item.key >= end && item.key < origin) {
          item.key = item.key + 1;
        } else if (item.key == origin) {
          item.key = end;
        }
        return item;
      });
      this.getPosition(list);
    }
  }
  getPosition(data, vibrate = true) {
    let list = data.map((item, index) => {
      item.tranX = this.item.width * (item.key % this.state.columns);
      item.tranY = Math.floor(item.key / this.state.columns) * this.item.height;
      return item;
    });

    this.setState({
      list: list
    });

    if (!vibrate) return;

    this.setState({
      itemTransition: true
    });

    Taro.vibrateShort();

    let listData = [];

    list.forEach(item => {
      listData[item.key] = item.data;
    });

    this.triggerEvent("change", { listData: listData });
  }
  touchEnd() {
    if (!this.state.touch) return;

    this.clearData();
  }
  /**
   * 清除参数
   */
  clearData() {
    this.originKey = -1;

    this.setState({
      touch: false,
      cur: -1,
      tranX: 0,
      tranY: 0
    });

    // 延迟清空
    setTimeout(() => {
      this.setState({
        curZ: -1
      });
    }, 300);
  }
  init() {
    // 遍历数据源增加扩展项, 以用作排序使用
    let list = this.state.listData.map((item, index) => {
      let data = {
        key: index,
        tranX: 0,
        tranY: 0,
        data: item
      };
      return data;
    });

    this.setState({
      list: list,
      itemTransition: false
    });

    this.windowHeight = Taro.getSystemInfoSync().windowHeight;

    // 获取每一项的宽高等属性
    // this.createSelectorQuery()
    //   .select(".item")
    //   .boundingClientRect(res => {
    //     let rows = Math.ceil(this.state.list.length / this.state.columns);

    //     this.item = res;

    //     this.getPosition(this.state.list, false);

    //     let itemWrapHeight = rows * res.height;

    //     this.setState({
    //       itemWrapHeight: itemWrapHeight
    //     });

    //     this.createSelectorQuery()
    //       .select(".item_wrap")
    //       .boundingClientRect(res => {
    //         this.itemWrap = res;

    //         let overOnePage = itemWrapHeight + res.top > this.windowHeight;

    //         this.setState({
    //           overOnePage: overOnePage
    //         });
    //       })
    //       .exec();
    //   })
    //   .exec();
  }
  render() {
    const {
      overOnePage,
      cur,
      itemWrapHeight,
      curZ,
      itemTransition,
      listData,
      columns,
      tranX,
      tranY
    } = this.state;
    return (
      <View>
        <View style={{ overflowX: overOnePage ? "hidden" : "initial" }}>
          <View className={styles.item_wrap} style={{ height: itemWrapHeight }}>
            {listData.map((item, index) => {
              const { name, key } = item;
              return (
                <View
                  className={`${styles.item} ${cur == index &&
                    styles.cur} ${curZ == index &&
                    styles.zIndex} ${itemTransition && styles.itemTransition}`}
                  key={index}
                  id={key}
                  data-key={key}
                  data-index={index}
                  // style="transform: translate3d({{index === cur ? tranX : item.tranX}}px, {{index === cur ? tranY: item.tranY}}px, 0px);width: {{100 / columns}}%"
                  style={
                    "transform: translate3d(" +
                    (index === cur ? tranX : item.tranX) +
                    "px, " +
                    (index === cur ? tranY : item.tranY) +
                    "px, 0px);width: " +
                    100 / columns +
                    "%"
                  }
                  onLongPress={this.longPress}
                  onTouchMove={this.touchMove}
                  onTouchEnd={this.touchEnd}
                >
                  <View class={styles.info}>
                    <View>{name}</View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        {/* <View wx:if="{{overOnePage}}" class="indicator">
          <View>滑动此区域滚动页面</View>
        </View> */}
      </View>
    );
  }
}
