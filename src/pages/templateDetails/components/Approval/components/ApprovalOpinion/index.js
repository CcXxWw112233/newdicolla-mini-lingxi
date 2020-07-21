
import Taro, { Component } from '@tarojs/taro'
import { View, Textarea } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    render() {

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content}>
                    <View className={indexStyles.content_padding}>
                        <Textarea className={indexStyles.textarea}
                            placeholder='填写审批意见'
                        // onInput={this.handleInput}
                        // value={commentValue}
                        // auto-height={false}
                        // show-confirm-bar={false}
                        // adjust-position={true}
                        // onFocus={this.handleBindfocus}
                        // onblur={this.handBindblur}
                        />

                        <View className={indexStyles.operation}>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.reject}`}>驳回</View>
                            <View className={`${indexStyles.opinion_button} ${indexStyles.adopt}`}>通过</View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}
