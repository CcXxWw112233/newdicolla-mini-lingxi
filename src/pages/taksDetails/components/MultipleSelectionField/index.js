import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux';
import { MultipleSelectionView } from '../../../multipleSelectionView'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {
    state = {
        isMultipleSelectionFieldShow: false
    }

    clickTagCell = () => {

        const { data = [], fieldValue, item_id, editAuth } = this.props
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })
            return;
        }
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
        //1.1 先把 fieldValue 字符串转化为数组
        var array
        if (fieldValue) {
            array = fieldValue.split(",");
        }
        let dataArray = [];
        data.forEach(value => {
            //1.2 过滤出包含的
            if (array && array.indexOf(value['id']) != -1) {
                //1.3 包含的就加入新的数组
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

                {
                    isMultipleSelectionFieldShow ? (<MultipleSelectionView title={title} onClickAction={this.onClickAction} data={data} fieldValue={fieldValue} data_array={data_array} item_id={item_id}></MultipleSelectionView>) : (null)
                }
                <View className={indexStyles.list_left} onClick={this.clickTagCell}>

                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe8b1;</Text>
                    </View>

                    <View className={indexStyles.list_item_name}>{title}</View>

                    <View className={indexStyles.tagCell_list_item_detail}>
                   
                   {
                       data_array && data_array.length > 0 ? (                        
                            data_array.map((tag, key) => {
                                const { id, field_id, item_value, } = tag
                                return (
                                    <View key={key} className={indexStyles.tagCell_list_item}>
                                        <AtTag type='primary' customStyle={{
                                            color: `#FFFFFF`,
                                            backgroundColor: `#7C83A1`,
                                        }}>
                                            {item_value}
                                        </AtTag>
                                    </View>
                                )
                            })
                       ):(
                         <View className={indexStyles.placeText}>未选择</View>  
                       )
                   }    
                    </View>
                </View>

                <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe8b2;</Text>
                </View>

            </View>
        )
    }
}
