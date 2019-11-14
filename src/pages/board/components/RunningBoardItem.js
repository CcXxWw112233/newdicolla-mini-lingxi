import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import indexStyles from './index.scss';
import globalStyles from '../../../gloalSet/styles/globalStyles.scss';
import Avatar from '../../../components/avatar';
import { RESPONSE_DATA_CODE_DATA } from '../../../gloalSet/js/constant';
import { getOrgName } from '../../../utils/basicFunction';
import { connect } from '@tarojs/redux';
// import BoardDetail from '../../boardDetail/index'

@connect(({ my: { org_list } }) => ({
  org_list,
}))
class RuningBoardItem extends Component {
  componentWillReceiveProps(nextProps) { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  gotoBoardDetail = board_id => {
    Taro.navigateTo({
      url: `/pages/boardDetail/index?boardId=${board_id}`
    });
  };

  render() {
    const starlist = [];
    const tagList = [];
    const { board_item = {}, org_list } = this.props;
    const {
      board_id,
      board_name,
      realize_quantity,
      residue_quantity,
      org_id
    } = board_item;
    const users = board_item[RESPONSE_DATA_CODE_DATA] || [];
    return (
      <View>

        {/* <BoardDetail boardId={board_id} /> */}

        <View
          className={`${globalStyles.global_card_out} ${
            indexStyles.card_content
            }`}
          onClick={this.gotoBoardDetail.bind(this, board_id)}
        >
          <View className={`${indexStyles.card_content_top}`}>
            <Text className={`${indexStyles.card_title}`}>{board_name}</Text>
            <Text className={`${indexStyles.organize}`}>
              {getOrgName({ org_id, org_list })}
            </Text>
            <Text className={`${indexStyles.star_list}`}>
              {starlist.map((value, key) => {
                return (
                  <Text
                    key={key}
                    className={`${globalStyles.global_iconfont} ${
                      indexStyles.star
                      }`}
                  >
                    &#xe64b;
                  </Text>
                );
              })}
            </Text>
          </View>
          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_left}`}>
              <View className={`${indexStyles.avata_area}`}>
                <Avatar avartarTotal={'multiple'} userList={users} />
              </View>
            </View>
            <View className={`${indexStyles.card_content_middle_right}`}>
              <View className={`${indexStyles.task_1}`}>
                剩余任务 <Text>{residue_quantity}</Text>
              </View>
              <View className={`${indexStyles.task_2}`}>
                已完成 <Text>{realize_quantity || 0}</Text>
              </View>
            </View>
          </View>
          <View className={`${indexStyles.card_content_bott}`}>
            <View className={`${indexStyles.taglist}`}>
              {tagList.map((value, key) => {
                const rgb = '123,104,238';
                return (
                  <Text
                    className="tag"
                    className={`${indexStyles.tag}`}
                    key={key}
                    style={{
                      color: `rgba(${rgb},1)`,
                      backgroundColor: `rgba(${rgb},.4)`,
                      border: `1px solid rgba(${rgb},1)`
                    }}
                  >
                    {'标签名'}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default RuningBoardItem;
