import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './index.scss';
import AvatarList from './../chatDetail/components/AvatarList.js';
import SearchInput from './components/SearchInput.js';

@connect(({ im: { currentGroup } }) => ({
  currentGroup
}))
class GroupMember extends Component {
  state = {
    searchInput: ''
  };
  handleSearchInput = e => {
    this.setState({
      searchInput: e.currentTarget.value
    });
  };
  render() {
    const { searchInput } = this.state;
    const { currentGroup: { users = [] } = {} } = this.props;
    const avatarList = users
      .map(i => ({
        id: i.id,
        name: i.name,
        avatar: i.avatar
      }))
      .filter(i => i.name.toLowerCase().includes(searchInput.toLowerCase()));

    return (
      <View className={styles.wrapper}>
        <View className={styles.searchWrapper}>
          <SearchInput value={searchInput} onInput={this.handleSearchInput} />
        </View>
        <View className={styles.avartarListWrappr}>
          <AvatarList avatarList={avatarList} shouldShowAvatarMax={999} />
        </View>
      </View>
    );
  }
}

export default GroupMember;
