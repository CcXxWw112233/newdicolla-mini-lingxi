import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux';
import { MultipleSelectionField } from '../../../multipleSelectionField'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {
    state = {
        isMultipleSelectionFieldShow: false
    }

    clickTagCell = () => {

        const { data = [], fieldValue, item_id, } = this.props

        // Taro.navigateTo({
        // // url: `../../pages/multipleSelectionField/index?data=${JSON.stringify(data)}&fieldValue=${fieldValue}&item_id=${item_id}`
        // })
        this.setState({
            isMultipleSelectionFieldShow: true
        })
    }

    deleteCardProperty = () => {

        const { dispatch, item_id } = this.props
        dispatch({
            type: 'tasks/deleteBoardFieldRelation',
            payload: {
                id: item_id,
                callBack: this.deleteBoardFieldRelation(item_id),
            },
        })
    }

    onClickAction() {
        this.setState({
            isMultipleSelectionFieldShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    deleteBoardFieldRelation = (item_id) => {

        const { dispatch, tasksDetailDatas } = this.props
        const { fields = [], } = tasksDetailDatas

        let new_array = []
        fields.forEach(element => {

            if (element.id !== item_id) {
                new_array.push(element)
            }
        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ fields: new_array },
                }
            }
        })
    }

    getArray = (data = [], fieldValue) => {

        //1.1 ?????? fieldValue ????????????????????????
        var array
        if (fieldValue) {
            array = fieldValue.split(",");
        }

        let dataArray = [];

        data.forEach(value => {

            //1.2 ??????????????????
            if (array && array.indexOf(value['id']) != -1) {

                //1.3 ??????????????????????????????
                dataArray.push(value)
            }
        })
        return dataArray;
    }

    render() {
        const { title, data = [], fieldValue, item_id } = this.props
        const { isMultipleSelectionFieldShow } = this.state
        const data_array = this.getArray(data, fieldValue);

        return (
            <View className={indexStyles.list_item} >
                {/* // // url: `../../pages/multipleSelectionField/index?data=${JSON.stringify(data)}&fieldValue=$ */}
                {/* {fieldValue}&item_id=${item_id}` */}
                {
                    isMultipleSelectionFieldShow ? (<MultipleSelectionField onClickAction={this.onClickAction} data={data} fieldValue={fieldValue} item_id={item_id}></MultipleSelectionField>) : (null)
                }
                <View className={indexStyles.list_left} onClick={this.clickTagCell}>

                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7b8;</Text>
                    </View>

                    <View className={indexStyles.list_item_name}>{title}</View>

                    <View className={indexStyles.tagCell_list_item_detail}>
                        {
                            data_array.map((tag, key) => {

                                const { id, field_id, item_value, } = tag

                                return (
                                    <View key={key} className={indexStyles.tagCell_list_item}>
                                        <AtTag type='primary' customStyle={{
                                            color: `rgba(0, 0, 0,1)`,
                                            backgroundColor: `rgba(211, 211, 211,.2)`,
                                            border: `1px solid rgba(169, 169, 169,1)`,
                                        }}>
                                            {item_value}
                                        </AtTag>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>

                <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                </View>

            </View>
        )
    }
}
