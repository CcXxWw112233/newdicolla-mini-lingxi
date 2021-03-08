/* eslint-disable react/jsx-key */
import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import Multiplechoice from '../../components/multiplechoice'
import Moldchioce from '../moldchioce'


@connect(({ calendar: { board_list, selected_board } }) => ({
    board_list, selected_board
}))
export default class Calendar extends Component {
    state = {
        menuList: ['项目', '类型'],
        secletIndex: null,
        checkedBoardId: '',
        moldArr: [[], [], [], []],
        selectedMenuValueList: [[], [], [], []],
        boardidListArr: []
    }

    componentWillMount() {
        const { board_list } = this.props;
        var boardlist = board_list.map(function (item) {
            return {
                value: item.board_name,
                id: item.board_id,
                isSelect: false,
                org_name: item.org_name
            }
        })
        boardlist.splice(0, 0, { value: '全部', id: '0', isSelect: false, org_name: '' });
        this.setState({
            boardlist: boardlist
        })
    }

    componentDidMount() {

    }
    selectMenu(e) {
        const { secletIndex } = this.state;
        this.setState({
            secletIndex: e.currentTarget.id == secletIndex ? null : e.currentTarget.id
        })

    }
    finishAction(newArr, selectedMenuValueList) {
        const { secletIndex, moldArr, boardidList, boardidListArr } = this.state;
        const { dispatch } = this.props;

        if (secletIndex == 0) {
            const { selectedMenuValueList } = this.state;

            var arr = newArr.filter(function (item) {
                return item.isSelect
            })
            var boardidList1 = arr.map(function (item) {
                return item.id
            })
            var boardValueList = arr.map(function (item, idnex) {
                return {
                    value: item.value,
                }
            })
            this.setState({
                boardlist: newArr,
                boardidListArr: boardidList1,
                boardidList: boardidList1.toString()
            })
            this.getAllCard(moldArr, boardidList1)

        } else if (secletIndex == 1) {
            this.setState({
                moldArr: newArr,
                selectedMenuValueList: selectedMenuValueList
            })
            this.getAllCard(newArr, boardidListArr)
        }
        this.setState({
            secletIndex: null
        })

    }


    getAllCard(newArr, boardidListArr) {
        const { dispatch } = this.props;
        var arr = newArr;
        var newArr1 = arr.filter(function (item, index) {
            return item.length > 0;
        })
        var isall = newArr1.length > 0 ? [] : ['all'];
        dispatch({
            type: "calendar/getNoScheCardList",
            payload: {
                org_id: '0',
                board_ids: boardidListArr && boardidListArr.length > 0 ? (boardidListArr[0] == '0' ? [] : boardidListArr) : [],
                query_milestone: newArr[0] && newArr[0].length > 0 ? (newArr[0][0] == 'all' ? ['all'] : newArr[0]) : isall,
                query_card: newArr[1] && newArr[1].length > 0 ? (newArr[1][0] == 'all' ? ['all'] : newArr[1]) : isall,
                query_flow: newArr[2] && newArr[2].length > 0 ? (newArr[2][0] == 'all' ? ['all'] : newArr[2]) : isall,
                query_meeting: newArr[3] && newArr[3].length > 0 ? (newArr[3][0] == 'all' ? ['all'] : newArr[3]) : isall,
            }
        });
        this.isShowCheckMenu(boardidListArr.toString(), newArr)

    }



    // 删除所选择的项目过滤条件
    deleteSelectedBorad(e) {
        const { dispatch } = this.props;
        const { boardlist = [], boardidListArr = [], moldArr = [], selectedMenuValueList } = this.state;
        const index = e.currentTarget.id;
        boardlist[index].isSelect = false;
        boardidListArr.splice(boardidListArr.indexOf(boardlist[index].id), 1);
        this.setState({
            boardidListArr: boardidListArr,
            boardidList: boardidListArr.toString(),
            boardlist: boardlist
        })
        this.getAllCard(moldArr, boardidListArr);

    }

    deleteAllSelectedBorad(msg) {
        const { dispatch } = this.props;
        const { boardlist = [], boardidListArr = [], selectedMenuValueList, moldArr } = this.state;
        var newArr = boardlist && boardlist.map(function (item) {
            return {
                value: item.value,
                id: item.id,
                isSelect: false,
                org_name: item.org_name
            }
        })
        this.setState({
            boardlist: newArr,
            boardidList: '',
            boardidListArr: []
        })
        if (msg == 'clearAll') {
            return;
        }
        this.getAllCard(moldArr, []);

    }

    // 删除选择的类型
    deleteSelectedMenu(e) {
        const { dispatch } = this.props;

        var arr = e.currentTarget.id.split('_');
        var { selectedMenuValueList, moldArr, boardidList, boardidListArr } = this.state;
        selectedMenuValueList[arr[0]].splice(arr[1], 1);
        moldArr[arr[0]].splice(arr[1], 1);
        this.setState({
            selectedMenuValueList: selectedMenuValueList,
            moldArr: moldArr
        })
        this.getAllCard(moldArr, boardidListArr);

    }
    deleteAllSelectedMenu(e) {
        const index = e.currentTarget.id;
        const { dispatch } = this.props;
        var { selectedMenuValueList, moldArr, boardidList, boardidListArr } = this.state;
        selectedMenuValueList[index] = [];
        moldArr[index] = '';
        this.setState({
            selectedMenuValueList: selectedMenuValueList,
            moldArr: moldArr
        })
        this.getAllCard(moldArr, boardidListArr);
    }

    // 是否显示选择项(传回父节点)
    isShowCheckMenu(boardidList, moldArr) {
        var newArr = moldArr.filter(function (item, index) {
            return item.length > 0;
        })
        console.log('...................');
        console.log(moldArr)
        var isCheckedBorard = boardidList && boardidList.length > 0;
        const isShowClear = isCheckedBorard || newArr.length > 0;
        typeof this.props.isShowCheckMenu == "function" &&
            this.props.isShowCheckMenu(isShowClear, boardidList, moldArr);

    }

    // 清除所有的过滤选项
    clearAllChecked() {
        const { dispatch } = this.props;

        var boardidList = [];
        var moldArr = [[], [], [], []];
        this.deleteAllSelectedBorad('clearAll')
        this.setState({
            moldArr: [[], [], [], []],
            selectedMenuValueList: [[], [], [], []],
        })
        dispatch({
            type: "calendar/getNoScheCardList",
            payload: {
                org_id: '0',
                board_ids: [],
                query_milestone: ['all'],
                query_card: ['all'],
                query_flow: ['all'],
                query_meeting: ['all'],
            }
        });
        typeof this.props.isShowCheckMenu == "function" &&
            this.props.isShowCheckMenu(false, boardidList, moldArr);

    }

    render() {
        const { menuList, secletIndex, moldArr, boardidList, boardlist, checkedBoardId, selectedMenuValueList } = this.state;
        const isAllBoard = boardlist && boardlist[0].isSelect;
        var newArr = selectedMenuValueList.filter(function (item, index) {
            return item.length > 0;
        })
        var isCheckedBorard = boardidList && boardidList.length > 0;
        const isShowClear = isCheckedBorard || newArr.length > 0
        return (
            <View className={indexStyles.index}>
                <View className={indexStyles.menuList}>
                    {menuList.map((value, index) => {
                        return (
                            <View className={`${indexStyles.menuItem} ${secletIndex == index ? indexStyles.selectmenuItem : null}`} id={index} onClick={this.selectMenu}>
                                {value}
                                {
                                    secletIndex == index ? (<Text className={`${globalStyle.global_iconfont}`}>&#xe675;</Text>) : (<Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>)
                                }
                            </View>
                        );
                    })}
                </View>
                <View className={indexStyles.checkedMenuView}>
                    <ScrollView className={indexStyles.checkedMenu} scrollX>
                        <View className={indexStyles.checkedMenuList}>

                            {
                                isAllBoard ? (<View className={indexStyles.checkedMenuItem} onClick={this.deleteAllSelectedBorad}>
                                    项目/全部
                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.delete_iconfont}`}>&#xe639;</Text>
                                </View>) : (
                                    boardlist && boardlist.map((value, index) => {
                                        return (
                                            <View key={'1'}>
                                                {
                                                    value.isSelect ? (
                                                        <View className={indexStyles.checkedMenuItem} id={index} onClick={this.deleteSelectedBorad}>
                                                            {value.value}
                                                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.
                                                                delete_iconfont}`}>&#xe639;</Text>
                                                        </View>
                                                    ) : (null)
                                                }
                                            </View>
                                        )
                                    })
                                )
                            }
                            {selectedMenuValueList.map((item, index) => {
                                const isAll = moldArr[index][0] == 'all';
                                return (
                                    <View className={indexStyles.checkedMenuList}>
                                        {

                                            item && item.length > 0 ? (
                                                isAll ? (
                                                    <View className={indexStyles.checkedMenuItem} id={index} onClick={this.deleteAllSelectedMenu} key={'1'}>
                                                        {item[0]}
                                                        <Text className={`${globalStyle.global_iconfont} ${indexStyles.delete_iconfont}`}> &#xe639;</Text>
                                                    </View>

                                                ) : (
                                                    item.map((value, index1) => {

                                                        return (
                                                            <View className={indexStyles.checkedMenuItem} id={index + '_' + index1} onClick={this.deleteSelectedMenu} key={index1}>
                                                                {value}
                                                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.
                                                                    delete_iconfont}`}> &#xe639;</Text>
                                                            </View>
                                                        )
                                                    })
                                                )
                                            ) : (null)
                                        }
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>

                    {
                        isShowClear ? (<View className={indexStyles.clearAllChecked} onClick={this.clearAllChecked}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.delete_iconfont}`}>&#xe845;</Text>
            清除
                        </View>) : (null)
                    }


                </View>
                {
                    secletIndex == 0 ? (<Multiplechoice type='0' conditionArr={boardlist} checkedBoardId={checkedBoardId} finishAction={(newArr1) => this.finishAction(newArr1)}></Multiplechoice>) : (null)
                }
                {
                    secletIndex == 1 ? (<Moldchioce type='1' selectedMenuValueList={selectedMenuValueList} moldArr={moldArr} finishAction={(newArr1, selectedMenuValueList1) => this.finishAction(newArr1, selectedMenuValueList1)}></Moldchioce>) : (null)
                }

            </View >
        );
    }
}
