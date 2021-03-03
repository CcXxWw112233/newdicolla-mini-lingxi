import Taro, { Component } from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import CardList from '../calendar/components/CardList';
import CardTypeSelect from '../calendar/components/CardTypeSelect/index';
import SearchAndMenu from '../board/components/SearchAndMenu';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';
import Topmenu from './components/topmenu'
import NoDataSvg from "../../asset/nodata.svg";

@connect(
    ({
        calendar: {
            no_sche_card_list,
            selected_board_name,
            page_number,
            isReachBottom,
            isOtherPageBack,
            selected_timestamp
        },
        accountInfo,
        im: { sessionlist, unread_all_number }
    }) => ({
        no_sche_card_list,
        selected_board_name,
        page_number,
        isReachBottom,
        isOtherPageBack,
        accountInfo,
        selected_timestamp,
        sessionlist,
        unread_all_number
    })
)


export default class Calendar extends Component {

    config = {
        navigationBarTitleText: "",
        enablePullDownRefresh: true,
        backgroundColor: "#696969",
        onReachBottomDistance: 50 //默认值50
    };

    state = {
        show_card_type_select: '0',
        search_mask_show: '0',
        boardidList: '',
        moldArr: []
    };

    componentWillMount() {
        const { title } = this.$router.params;
        Taro.setNavigationBarTitle({
            title: '全部事项'
        });
    }

    componentDidMount() {
        var that = this;

        Taro.getSystemInfo({
            success(res) {
                that.setState({
                    screenHeight: res.screenHeight - res.statusBarHeight + 'px'
                })
            }
        })
    }

    componentDidShow() {
        this.getOrgBoardList();
        // this.getNoScheCardList();
    }
    componentDidHide() {
        const { dispatch } = this.props;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                isOtherPageBack: false
            }
        });

        dispatch({
            type: "calendar/updateDatas",
            payload: {
                page_number: 1,
                isReachBottom: true
            }
        });
    }
    //获取项目列表
    getOrgBoardList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'calendar/getOrgBoardList',
            payload: {}
        });
    };

    // getNoScheCardList = () => {
    // const { dispatch } = this.props;
    // dispatch({
    // type: 'calendar/getNoScheCardList',
    // payload: {}
    // });
    // };

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        });
    };

    onPullDownRefresh(res) {
        const { isReachBottom } = this.props;
        const { dispatch, selected_timestamp } = this.props;
        // dispatch({
        // type: "calendar/updateDatas",
        // payload: {
        // page_number: 1,
        // isReachBottom: true
        // }
        // });
        console.log(selected_timestamp);
        this.getNoScheCardList();
        this.getOrgBoardList();
        Taro.showNavigationBarLoading();
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading();
        }, 300);
    }

    getNoScheCardList() {
        const { dispatch, } = this.props;
        const { boardidList, moldArr } = this.state;
        var boardidListArr = boardidList.length > 0 ? boardidList.split(",") : []
        dispatch({
            type: "calendar/getNoScheCardList",
            payload: {
                org_id: '0',
                board_ids: boardidListArr && boardidListArr.length > 0 ? (boardidListArr[0] == '0' ? [] :
                    boardidListArr) : [],
                query_milestone: moldArr[0].length > 0 ? (moldArr[0][0] == 'all' ? ['all'] : moldArr[0]) : [],
                query_card: moldArr[1].length > 0 ? (moldArr[1][0] == 'all' ? ['all'] : moldArr[1]) : []
                ,
                query_flow: moldArr[2].length > 0 ? (moldArr[2][0] == 'all' ? ['all'] : moldArr[2]) : []
                ,
                query_meeting: moldArr[3].length > 0 ? (moldArr[3][0] == 'all' ? ['all'] : moldArr[3]) : [],
            }
        });
    }

    onReachBottom() {
        //上拉加载...
        // const { isReachBottom } = this.props;
        // if (isReachBottom === true) {
        // this.pagingGet();
        // }
        const { dispatch } = this.props;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                isReachBottom: false
            }
        });
    }
    pagingGet = () => {
        const { page_number, dispatch } = this.props;
        let new_page_number = page_number;
        new_page_number = new_page_number + 1;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                page_number: new_page_number
            }
        });
        // this.getNoScheCardList({ type: 1 });
    };
    // 获取排期列表
    getScheCardList = (payload = {}) => {
        const { dispatch } = this.props;
        dispatch({
            type: "calendar/getScheCardList",
            payload: {
                ...payload
            }
        });
    };
    onclickTopMenu(index) {
        this.setState({
            TopmenuIndex: index
        })
    }

    isShowCheckMenu(isShow, boardidList, moldArr) {
        this.setState({
            isShowCheckMenu: isShow,
            boardidList: boardidList,
            moldArr: moldArr
        })
    }
    render() {
        const { show_card_type_select, search_mask_show, TopmenuIndex, screenHeight, filterData, filterDropdownValue, isShowCheckMenu } = this.state;
        const { no_sche_card_list = [] } = this.props;
        return (
            <View className={indexStyles.index} style={{ minHeight: screenHeight }}>
                {/* <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} /> */}
                <Topmenu onclickTopMenu={(index) => this.onclickTopMenu(index)} className={indexStyles.topMenu} isShowCheckMenu={(isShow, boardidList, moldArr) => this.isShowCheckMenu(isShow, boardidList, moldArr)}></Topmenu>
                {/* <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'0'} /> */}
                {/* isShowCheckMenu */}

                <ScrollView scrollY className={`${indexStyles.no_sche_card_list} ${isShowCheckMenu ? indexStyles.isShowCheckMenu : ''}`}>
                    {
                        no_sche_card_list && no_sche_card_list.length > 0 ? (
                            <CardList className={indexStyles.cardList} schedule={'0'} />

                        ) : (
                                <View className={indexStyles.noDataView}>
                                    <Image className={indexStyles.noDataImage} src={NoDataSvg}></Image>
                                    <View className={indexStyles.noDataText}>未找到符合条件的待办</View>
                                </View>
                            )
                    }

                    <View style='height: 50px'></View>
                </ScrollView>
            </View >
        );
    }
}
