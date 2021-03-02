
import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import molddata from './molddata'

export default class Calendar extends Component {

    state = {
        menuList: molddata,
        selectedMenuList: [[], [], [], []],
    }

    componentWillMount() {
    }

    componentDidMount() {
        const systemInfo = Taro.getSystemInfoSync();
        const { moldArr, selectedMenuValueList } = this.props;
        const { windowWidth } = systemInfo;
        this.setState({
            windowWidth,
            selectedMenuList: moldArr,
            selectedMenuValueList: selectedMenuValueList
        });
    }
    // 选择类型
    selectAction(e) {
        const { selectedMenuList, menuList, selectedMenuValueList } = this.state;
        var arr = e.currentTarget.id.split(","), arr1 = [], arr2 = [];
        var type = menuList[arr[0]].type;
        console.log("******")
        console.log(arr)
        if (selectedMenuList[arr[0]] && selectedMenuList[arr[0]].length > 0) {
            arr1 = selectedMenuList[arr[0]];
            arr2 = selectedMenuValueList[arr[0]];
        }
        if (arr[2] == 0) {
            if (arr1.length < menuList[arr[0]].submenu.length) {
                arr1 = menuList[arr[0]].submenu.map(function (item) {
                    return item.id
                })
                arr2 = menuList[arr[0]].submenu.map(function (item) {
                    return type + '/' + item.value
                })
            } else {
                arr1 = [];
                arr2 = [];
            }
        } else {
            if (arr1.length == menuList[arr[0]].submenu.length) {
                arr1.splice(0, 1);
                arr2.splice(0, 1);
            }
            var index = arr1.indexOf(arr[1]);
            if (arr1 && arr1.length > 0) {
                if (index > -1) {
                    arr1.splice(index, 1);
                    arr2.splice(arr2.indexOf(menuList[arr[0]].submenu[arr[2]].value), 1);
                } else {
                    arr1.push(arr[1])
                    arr2.push(type + '/' + menuList[arr[0]].submenu[arr[2]].value)
                }
            } else {
                arr1.push(arr[1])
                arr2.push(type + '/' + menuList[arr[0]].submenu[arr[2]].value)
            }
        }
        selectedMenuList[arr[0]] = arr1;
        selectedMenuValueList[arr[0]] = arr2;
        this.setState({
            selectedMenuList: selectedMenuList,
            selectedMenuValueList: selectedMenuValueList
        })
    }
    // 完成
    finishAction() {
        const { selectedMenuList, selectedMenuValueList } = this.state;
        typeof this.props.finishAction == "function" &&
            this.props.finishAction(selectedMenuList, selectedMenuValueList);
    }
    // 清除筛选
    clearCondition() {
        this.setState({
            selectedMenuList: [[], [], [], []],
            selectedMenuValueList: [[], [], [], []],
        })
    }
    render() {
        const { menuList, windowWidth, selectedMenuList } = this.state;
        return (
            <View className={indexStyles.index}>
                <View className={`${indexStyles.menuList}`}>
                    {menuList.map((item, index) => {
                        return (
                            <View key={index} className={`${indexStyles.menuItem}`} id={index}>
                                <View className={`${indexStyles.menuItem}`} >{item.type}</View>
                                <View className={`${indexStyles.submenuList}`}>
                                    {item.submenu.map((value, index1) => {
                                        const isChecked = selectedMenuList[index].indexOf(value.id) != -1;
                                        return (
                                            <View key={index1} className={`${indexStyles.submenuItem} ${isChecked ? indexStyles.submenuItemChecked : ''}`} id={index + ',' + value.id + ',' + index1} style={`width: ${(windowWidth - 80) / 4}px`} onClick={this.selectAction}>
                                                {value.value}
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}

                </View>

                <View className={indexStyles.buttonView}>
                    <View className={`${indexStyles.button} ${indexStyles.clear}`} onClick={this.clearCondition}>清除筛选</View>
                    <View className={`${indexStyles.button}`} onClick={this.finishAction}>完成</View>
                </View>
            </View >
        );
    }
}
