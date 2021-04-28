import { connect } from '@tarojs/redux'
import Taro, { Component, } from '@tarojs/taro'
import { View, CoverView, ScrollView } from '@tarojs/components'
import indexStyles from './index.scss'
import { AtCheckbox, } from 'taro-ui'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'


@connect(({ tasks: { label_list = [], tasksDetailDatas = {}, }, }) => ({
    label_list, tasksDetailDatas,
}))
export default class LabelSelection extends Component {
    config = {
        navigationBarTitleText: '',
    }

    state = {
        card_id: '',
        checkedList: [],  //已选中数组
        checkboxOption: [],  //全部数组
    }

    componentDidMount() {
        const { contentId, data, } = this.props
        this.setState({
            card_id: contentId,
        })
        const { label_list = [], tasksDetailDatas = {}, } = this.props
        console.log(label_list);
        label_list.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
        })

        let new_arr = data.map(obj => { return obj.label_id });
        let newCheckedList = data.map(obj => { return obj.label_id });

        this.setState({
            checkboxOption: label_list,
            checkedList: new_arr,
            newCheckedList:newCheckedList,
        })
    }

    // handleChange(value) {

    //     var sa = new Set(this.state.checkedList);
    //     var sb = new Set(value);

    //     this.setState({
    //         checkedList: value
    //     })

    //     const { dispatch } = this.props
    //     const { card_id } = this.state

    //     if (this.state.checkedList.length > value.length) {  //删减
    //         // 差集
    //         let minus = this.state.checkedList.filter(x => !sb.has(x));
    //         let labelId = minus[0];

    //         dispatch({
    //             type: 'tasks/deleteCardLabel',
    //             payload: {
    //                 label_id: labelId,
    //                 card_id: card_id,
    //                 callBack: this.putCardLabel(value),
    //             },
    //         })
    //     }
    //     else if (this.state.checkedList.length < value.length) {  //增加
    //         //补集
    //         let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
    //         let labelId = complement[0];

    //         dispatch({
    //             type: 'tasks/postCardLabel',
    //             payload: {
    //                 label_id: labelId,
    //                 card_id: card_id,
    //                 callBack: this.putCardLabel(value),
    //             },
    //         })
    //     }
    // }
    /**
     * 取消选择
     */
    cancelSelect() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
 /**
     * 选择
     * @param {*} item 
     */
  selectItem = item => {
    var {newCheckedList = []} = this.state;
    if(newCheckedList.indexOf(item.id) != -1) {
        newCheckedList = newCheckedList.filter((value)=> {
            return item.id != value;
        });  
    } else {
        newCheckedList.push(item.id)
    }
    this.setState({
        newCheckedList:  newCheckedList,
    })
    }
    /**
     * 确定选择
     * @returns 
     */
    confirmSelect () {
        const {newCheckedList = [],card_id,checkedList=[]} = this.state;
        const {dispatch ,title} = this.props
        if(newCheckedList.length == 0 || !newCheckedList) {
            Taro.showToast({
                title: '请选择标签',
                icon: 'none',
                duration: 2000
              })
              return
        }
        // 现在选择的和已选择的差集
        const handelarr = newCheckedList.concat(checkedList).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);     
        });
        handelarr.forEach(item => {
            // 删除
            if(checkedList.indexOf(item) != -1) {
                  dispatch({
                    type: 'tasks/deleteCardLabel',
                    payload: {
                        label_id: item,
                        card_id: card_id,
                        // callBack: this.putCardLabel(newCheckedList),
                    },
                  })
            } else {
                // 增加
                   dispatch({
                        type: 'tasks/postCardLabel',
                        payload: {
                            label_id: item,
                            card_id: card_id,
                            // callBack: this.putCardLabel(newCheckedList),
                        },
                    })
            }
        })
        this.putCardLabel(newCheckedList)
        this.cancelSelect()
    }
    putCardLabel = (value) => {
        const { dispatch, tasksDetailDatas, label_list = [], } = this.props
        const { properties = [] } = tasksDetailDatas
        let array = [];
        for (let i = 0; i < value.length; i++) {

            label_list.forEach(obj => {

                if (obj.id === value[i]) {

                    obj.label_id = obj.id
                    obj.label_name = obj.name
                    obj.label_color = obj.color

                    array.push(obj);
                }
            })
        }

        properties.forEach(item => {
            if (item['code'] === 'LABEL') {
                item.data = array
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties,
                }
            }
        })
    }


    render() {
        const { checkboxOption = [],newCheckedList=[] } = this.state
        return (
            // <View className={indexStyles.labelSelectionView}>
            //     <View className={indexStyles.index}>
            //         <View className={indexStyles.titleView}>请选择</View>
            //         <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>

            //             <AtCheckbox
            //                 options={checkboxOption}
            //                 selectedList={this.state.checkedList}
            //                 onChange={this.handleChange.bind(this)}
            //             />
            //         </ScrollView>
            //         <View className={indexStyles.bootomBtnView}>
            //             <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
            //         </View>
            //     </View>
            // </View>
            <View className={indexStyles.index}>
            <View className={indexStyles.content_view}>
             <View className={indexStyles.content_topline_view}></View>
             <View className={indexStyles.content_title_view}>
                <View className={indexStyles.content_title_left}>
                   <View className={indexStyles.content_title_text}>{title}</View>
                </View>
                <View className={indexStyles.content_confirm} onClick={this.confirmSelect}>确定</View>
             </View>
             <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                {
                    checkboxOption && checkboxOption.map((item,key)=>{
                        const  isSelected = newCheckedList.indexOf(item.id) != -1;
                        const rgb = item.color;

                        return (
                         
                            <View className={`${indexStyles.content_item}`} onClick={this.selectItem.bind(this,item)} key={key}>
                                <View className={indexStyles.content_title_left}>
                                    <View className={indexStyles.content_item_identifier} style={{
                                            backgroundColor: `rgba(${rgb},.2)`,
                                            border: `2px solid rgba(${rgb},1)`,
                                        }}></View>

                                     <View className={`${indexStyles.content_item_name} ${isSelected ? indexStyles.content_item_selected : ''}`}>{item.label}</View>
                                </View>
                                {
                                    isSelected ? (
                                     <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont} ${isSelected ? indexStyles.content_item_selected : ''}`}>&#xe66a;</View>
                                    ):(
                                     <View className={`${globalStyle.global_iconfont} ${indexStyles.item_iconfont}`}>&#xe661;</View>
                                    )
                                }
                            </View>
                        )
                    })
                }
             </ScrollView>
             <View className={indexStyles.cencel_View} onClick={this.cancelSelect}>取消</View>
            </View>
        </View>
        )
    }
}

