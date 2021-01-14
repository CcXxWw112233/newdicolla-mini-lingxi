import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'
import indexStyles from './index.scss'

@connect(({ tasks: { tasksDetailDatas = {}, field_selection_list = [], field_selection_group_list = [], }, }) => ({
    tasksDetailDatas, field_selection_list, field_selection_group_list,
}))
export default class fieldSelection extends Component {
    // config = {
    //     navigationBarTitleText: '字段分组'
    // }

    constructor() {
        super(...arguments)
        this.state = {
            checkedList: [],  //已选中数组
            checkboxOption: [],  //全部数组
            card_id: '', //card_id, relation_id
        }
    }

    componentDidMount() {

        const { fields, card_id, } = this.props
        const fieldsData = fields;

        const { field_selection_list = [], field_selection_group_list = [], } = this.props

        //重组字段分组的数据
        let new_group_array = []
        field_selection_group_list && field_selection_group_list.forEach(objData => {
            if (objData.fields) {
                objData.fields.forEach(item => {
                    item.desc = objData.name   //把分组名称作为描述
                })
                new_group_array.push(objData.fields)
            }
        })

        var combinationArray = [];
        if (new_group_array && new_group_array.length > 0) {
            combinationArray = new_group_array && new_group_array.length > 0 && new_group_array.reduce(function (a, b) { return a.concat(b) });
        }
        var finalArray = [];
        if (field_selection_list && field_selection_list.length > 0) {
            finalArray = field_selection_list && field_selection_list.length > 0 && combinationArray.concat(field_selection_list)
        } else {
            finalArray = combinationArray;
        }

        finalArray && finalArray.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
            item['desc'] = item.desc
        })

        //取出已经是执行人的id, 组成新数组(已选中)
        let new_arr = fieldsData.map(obj => { return obj.field_id });

        this.setState({
            checkboxOption: finalArray,
            checkedList: new_arr,
            card_id: card_id,
        })
        console.log(finalArray)
        console.log(fieldsData)


        // console.log(finalArray
        // .filter(x => fieldsData.indexOf(x) == -1)
        // .concat(fieldsData.filter(x => finalArray.indexOf(x) == -1))
        // )
        var newArr = [];
        for (var i = 0; i < finalArray.length; i++) {
            //我们将arr2中的元素依次放入函数中进行比较，然后接收函数的返回值
            if (this.noExist(finalArray[i]['id'], fieldsData)) { //如果返回的值是true，我们将元素放入新的数组中
                newArr[newArr.length] = finalArray[i];
            }
        }
        this.setState({
            checkboxOption: newArr,
            checkedList: []
        })

        // if (!newArr.length) {
        //     Taro.showToast({
        //         title: '没有字段可选',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     typeof this.props.onClickAction == "function" &&
        //         this.props.onClickAction();
        // }
    }

    noExist(num, arr1) {
        for (var j = 0; j < arr1.length; j++) {
            if (num === arr1[j]['field_id']) {
                return false; //如果传过来的元素在arr1中能找到相匹配的元素，我们返回fasle
            }
        }
        return true; //如果不能找到相匹配的元素，返回true
    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);

        const { dispatch } = this.props
        const { card_id } = this.state

        this.setState({
            checkedList: value
        })

        if (this.state.checkedList.length > value.length) {  //删减

        }
        else if (this.state.checkedList.length < value.length) {  //增加

            //补集
            let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
            let executor_id = complement[0];

            dispatch({
                type: 'tasks/postBoardFieldRelation',
                payload: {
                    fields: [executor_id],
                    relation_id: card_id,
                    source_type: '2',
                },
            })
        }
    }
    onClickAction() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }

    render() {

        const { checkboxOption = [] } = this.state

        return (
            <View className={indexStyles.fieldSelectionView}>

                <View className={indexStyles.index}>
                    <View className={indexStyles.titleView}>请选择</View>
                    {
                        checkboxOption && checkboxOption.length ? (<ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                            <AtCheckbox
                                options={checkboxOption}
                                selectedList={this.state.checkedList}
                                onChange={this.handleChange.bind(this)}
                            />
                        </ScrollView>) : (<View className={indexStyles.contentView}>暂时没有字段可选,如需更多请前往PC端修改</View>)
                    }

                    <View className={indexStyles.bootomBtnView}>
                        <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
                    </View>
                </View>
            </View>
        )
    }
}

fieldSelection.defaultProps = {

};