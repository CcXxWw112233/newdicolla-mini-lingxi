
import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'


export default class Calendar extends Component {


    state = {
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { conditionArr } = this.props;
        this.setState({
            newArr: conditionArr
        })
    }
    selectCondition(e) {
        var { newArr } = this.state;
        const index = e.currentTarget.id;
        if (index == 0) {
            var arr = newArr.filter(function (item) {
                return item.isSelect
            })
            if (arr.length < newArr.length) {
                newArr = newArr.map(function (item) {
                    return {
                        value: item.value,
                        id: item.id,
                        isSelect: true,
                        org_name: item.org_name
                    }
                })
            } else {
                newArr = newArr.map(function (item) {
                    return {
                        value: item.value,
                        id: item.id,
                        isSelect: false,
                        org_name: item.org_name
                    }
                })
            }
        } else {
            if (newArr[index].isSelect) {
                newArr[0].isSelect = false
            }
            newArr[index].isSelect = !newArr[index].isSelect;
        }
        this.setState({
            newArr: newArr
        })
    }
    clearCondition() {
        var { newArr } = this.state;
        newArr = newArr.map(function (item) {
            return {
                value: item.value,
                id: item.id,
                isSelect: false,
                org_name: item.org_name
            }
        })
        this.setState({
            newArr: newArr
        })
    }
    finishAction() {
        const { newArr } = this.state;
        typeof this.props.finishAction == "function" &&
            this.props.finishAction(newArr);
    }
    render() {
        const { newArr } = this.state;
        const { type } = this.props;
        return (
            <View className={indexStyles.index}>
                {
                    type == 2 ? (<View className={indexStyles.conditionRowList}>
                        {newArr.map((value, index) => {
                            return (
                                <View key={index} className={`${indexStyles.conditionRowItem} ${value.isSelect ? indexStyles.conditionRowCheckItem : ''}`} id={index} onClick={this.selectCondition}>
                                    {value.value}
                                </View>
                            );
                        })}
                    </View>) : (<ScrollView className={indexStyles.conditionList} scrollY>
                        {newArr.map((value, index) => {
                            return (
                                <View key={index} className={`${indexStyles.conditionItem}`} id={index} onClick={this.selectCondition}>
                                    <View className={indexStyles.conditionItemInfo}>
                                        <View className={indexStyles.conditionItem_title}>{value.value}</View>
                                        <View className={indexStyles.conditionItem_subtitle}>{value.org_name}</View>

                                    </View>

                                    {
                                        value.isSelect ? (<Text className={`${globalStyle.
                                            global_iconfont} ${indexStyles.checkedIcon}`}>&#xe641;</Text>) : (null)
                                    }
                                </View>
                            );
                        })}
                    </ScrollView>)
                }
                <View className={indexStyles.buttonView}>
                    <View className={`${indexStyles.button} ${indexStyles.clear}`} onClick={this.clearCondition}>清除筛选</View>
                    <View className={`${indexStyles.button}`} onClick={this.finishAction}>完成</View>
                </View>
            </View >
        );
    }
}
