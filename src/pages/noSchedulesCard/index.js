import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import CardList from '../calendar/components/CardList';
import CardTypeSelect from '../calendar/components/CardTypeSelect/index';
import SearchAndMenu from '../board/components/SearchAndMenu';
import indexStyles from './index.scss';
import { connect } from '@tarojs/redux';


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
        search_mask_show: '0'
    };

    componentWillMount() {
        const { title } = this.$router.params;
        Taro.setNavigationBarTitle({
            title
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

    getNoScheCardList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'calendar/getNoScheCardList',
            payload: {}
        });
    };

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        });
    };

    onPullDownRefresh(res) {
        const { isReachBottom } = this.props;
        const { dispatch, selected_timestamp } = this.props;
        dispatch({
            type: "calendar/updateDatas",
            payload: {
                page_number: 1,
                isReachBottom: true
            }
        });
        console.log(selected_timestamp);
        this.getNoScheCardList();
        this.getOrgBoardList();
        Taro.showNavigationBarLoading();
        setTimeout(function () {
            Taro.stopPullDownRefresh();
            Taro.hideNavigationBarLoading();
        }, 300);
    }


    onReachBottom() {
        //上拉加载...
        const { isReachBottom } = this.props;
        if (isReachBottom === true) {
            this.pagingGet();
        }
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
        this.getNoScheCardList({ type: 1 });
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
    render() {
        const { show_card_type_select, search_mask_show, screenHeight } = this.state;
        return (
            <View className={indexStyles.index} style={{ height: screenHeight }
            }>
                <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
                <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'0'} />
                <CardList schedule={'0'} />
                <View style='height: 50px'></View>
            </View >
        );
    }
}
