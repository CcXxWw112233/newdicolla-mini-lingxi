import Taro, { Component } from '@tarojs/taro';
import { View, Image, ScrollView } from '@tarojs/components';
import CardList from '../calendar/components/CardList';
import CardTypeSelect from '../calendar/components/CardTypeSelect/index';
import SearchAndMenu from '../board/components/SearchAndMenu';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';
import Topmenu from './components/topmenu'
import NoDataSvg from "../../asset/nodata.svg";
import CustomNavigation from "../acceptInvitation/components/CustomNavigation.js";


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
        navigationStyle: 'custom',
        enablePullDownRefresh: true,
      }
    // config = {
        // navigationBarTitleText: "",
        // enablePullDownRefresh: true,
        // backgroundColor: "#696969",
        // onReachBottomDistance: 50 //默认值50
    // };

    state = {
        show_card_type_select: '0',
        search_mask_show: '0',
        boardidList: '',
        moldArr: [],
        searchKey:''
    };


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
        this.getNoScheCardList();
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
        this.getNoScheCardList();
        this.getOrgBoardList();
        Taro.showNavigationBarLoading();
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading();
        }, 300);
    }
// 获取数据
    getNoScheCardList(search_content) {
        const { dispatch, } = this.props;
        const { boardidList, moldArr,searchKey } = this.state;
        var boardidListArr = boardidList.length > 0 ? boardidList.split(",") : [];
        var arr = moldArr;
        var newArr = arr.filter(function (item, index) {
            return item.length > 0;
        })
        var isall = newArr.length > 0 ? [] : ['all'];
        var currentParams = {
            org_id: '0',
            search_content:searchKey ? searchKey : '',
            board_ids: boardidListArr && boardidListArr.length > 0 ? (boardidListArr[0] == '0' ? [] :
                boardidListArr) : [],
            query_milestone: moldArr[0] && moldArr[0].length > 0 ? (moldArr[0][0] == 'all' ? ['all'] : moldArr[0]) : isall,
            query_card: moldArr[1] && moldArr[1].length > 0 ? (moldArr[1][0] == 'all' ? ['all'] : moldArr[1]) : isall
            ,
            query_flow: moldArr[2] && moldArr[2].length > 0 ? (moldArr[2][0] == 'all' ? ['all'] : moldArr[2]) : isall
            ,
            query_meeting: moldArr[3] && moldArr[3].length > 0 ? (moldArr[3][0] == 'all' ? ['all'] : moldArr[3]) : isall,
        }
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                noSchedulesCurrentParams: currentParams
            }
        });
        dispatch({
            type: "calendar/getNoScheCardList",
            payload: currentParams
        })
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
    // 是否展示搜索条件
    isShowCheckMenu(isShow, boardidList, moldArr) {
        this.setState({
            isShowCheckMenu: isShow,
            boardidList: boardidList,
            moldArr: moldArr
        })
    }
    // 点击搜索
    searchMenuClick  = value =>{
       
       this.setState({
           searchKey:value
       },()=>{
        this.getNoScheCardList()
       })
    }
    cancelSearchMenuClick = value => {
        this.setState({
            searchKey:value
        },()=>{
         this.getNoScheCardList()
        })
    }
    render() {
        const { show_card_type_select, search_mask_show, TopmenuIndex, screenHeight, filterData, filterDropdownValue, isShowCheckMenu } = this.state;
        const { no_sche_card_list = [] } = this.props;
        const SystemInfo = Taro.getSystemInfoSync()
        const {searchKey} = this.state;
        const statusBar_Height = SystemInfo.statusBarHeight 
        const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48;

        return (
            <View className={indexStyles.index} style={{ minHeight: screenHeight }}>
                <CustomNavigation
                    isSearch={true}
                    backIcon='arrow_icon'
                    searchMenuClick={(value) => this.searchMenuClick(value)}
                    cancelSearchMenuClick = {(value) => this.cancelSearchMenuClick(value)}
                />
                <View style={{ height: navBar_Height + statusBar_Height +  'px' }} ></View>
                {/* <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} /> */}
                <Topmenu searchKey = {searchKey} onclickTopMenu={(index) => this.onclickTopMenu(index)}  isShowCheckMenu={(isShow, boardidList, moldArr) => this.isShowCheckMenu(isShow, boardidList, moldArr)}></Topmenu>
                {/* <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'0'} /> */}
                {/* isShowCheckMenu */}

                <ScrollView scrollY className={`${indexStyles.no_sche_card_list}`}>
                    <View className={`${indexStyles.placeTopMenuView} ${isShowCheckMenu ? indexStyles.isShowCheckMenu : ''}`}></View>

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
