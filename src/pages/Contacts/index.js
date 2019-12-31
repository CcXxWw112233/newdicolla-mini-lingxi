import Taro, { Component } from '@tarojs/taro';
import { View,Text ,ScrollView,Image} from '@tarojs/components';
import styles from './index.scss';

export default class Contacts extends Component {
  constructor(props){
    super(props)
    this.state = {
      animateName:'slideUp'
    }
  }
  onClose = ()=>{
    let { onClose ,users} = this.props;
    // console.log(users)
    this.setState({
      animateName:"slideDown"
    })
    onClose && onClose();
  }
  handleTap = (val)=>{
    // console.log(val);
    let { onSelect } = this.props;
    this.onClose();
    onSelect && onSelect(val);
  }
  render(){
    let { animateName } = this.state;
    let { users } = this.props;
    return (
      <View className={styles.contactsContent + ' ' + (animateName === 'slideDown' && styles.closeContactsContent)}>
        <View className={styles.contactsTitle}>
          <Text className={styles.contactsCancel} onClick={this.onClose}>取消</Text>
          <Text className={styles.contactsTitleName}> 选择需要提醒的人 </Text>
        </View>
        <ScrollView scrollY className={styles.contentScrollView}>
          <View className={styles.contactsList}>
            {users.map(item => {
              return (
                <View key={item.user_id} className={styles.userItem+' '+styles.jzhover} onClick={this.handleTap.bind(this, item)} >
                  <View className={styles.userAvatar}>
                    {item.avatar ? (<Image src={item.avatar} className={styles.userAvatarImage}/>) :(<Text> {item.name[0]} </Text>)}
                  </View>
                  <Text>{item.name}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}
