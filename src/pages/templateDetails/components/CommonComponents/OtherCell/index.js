
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { validateFixedTel, validatePassword, validateEmail, validateTel, validateIdCard, validateChineseName, validatePostalCode, validateWebsite, validateQQ, validatePositiveInt, validateNegative, validateTwoDecimal, } from '../../../../../utils/verify'

export default class index extends Component {

    constructor() {
        super(...arguments)
    }



    verifyAction(e) {
        const { item } = this.props;
        var valiResult = false;
        const verification_rule = item['verification_rule']
        if (e.detail.value.length > 0) {
            valiResult = this.verifyContent(e.detail.value);
        } else {
            if (item.is_required == '0') {
                valiResult = true;
            } else {
                valiResult = false;
                Taro.showToast({
                    title: '该项目是必填项目',
                    icon: 'none',
                    duration: 1000
                })
            }
        }

        if (!valiResult) {
            Taro.showToast({
                title: this.showToastText(e.detail.value),
                icon: 'none',
                duration: 1000
            })
        }

        console.log(valiResult);
    }

    showToastText(value) {
        const { item } = this.props;
        const verification_rule = item['verification_rule'];
        const val_min_length = item['val_min_length'];
        const val_max_length = item['val_max_length'];
        var toastText = '';
        switch (verification_rule) {
            case '':
                if (value) {
                    if (val_min_length && val_max_length) {
                        // 表示限制了最小长度以及最大长度
                        toastText = '字符长度在' + val_min_length + '-' + val_max_length + '之间';
                    } else if (val_min_length && !val_max_length) {
                        // 表示只限制了最小长度
                        toastText = '至少输入' + val_min_length + '个字符';
                    } else if (val_max_length && !val_max_length) {
                        // 表示只限制了最大长度
                        toastText = '最多输入' + val_max_length + '个字符';

                    } else if (!val_min_length && !val_max_length) {
                        // 表示什么都没有限制的时候
                        toastText = '不能为空';
                    }
                } else if (!value) {
                    toastText = '请输入相应的字符串';
                }
                return toastText;
            case 'mobile':
                return '手机号格式不正确'
            case 'tel':
                return '固话格式不正确'
            case 'ID_card':
                return '身份证号码格式不正确'
            case 'chinese_name':
                return '中文字符格式不正确'
            case 'url':
                return '网址格式不正确'
            case 'qq':
                return 'QQ格式不正确'
            case 'postal_code':
                return '邮政编码格式不正确'
            case 'positive_integer':
                return '正整数格式不正确'
            case 'negative':
                return '负数格式不正确'
            case 'two_decimal_places':
                return '请精确到两位小数'
            default:
                // if (!!value) {
                //   valiResult = true
                // } else {
                //   valiResult = false
                // }
                return '输入格式不正确'
        }
    }

    verifyContent(value) {
        const { item } = this.props;
        const verification_rule = item['verification_rule']
        // const value = item['value']
        const files = item['files']
        const field_type = item['field_type']
        const limit_file_num = item['limit_file_num']
        const limit_file_size = item['limit_file_size']
        const val_min_length = item['val_min_length']
        const val_max_length = item['val_max_length']
        var valiResult = true
        switch (verification_rule) {
            case '':
                if (value) {
                    if (val_min_length && val_max_length) {
                        // 表示限制了最小长度以及最大长度
                        if (
                            value.length >= val_min_length &&
                            value.length <= val_max_length
                        ) {
                            valiResult = true
                        } else {
                            valiResult = false
                        }
                    } else if (val_min_length && !val_max_length) {
                        // 表示只限制了最小长度
                        if (value.length >= val_min_length) {
                            valiResult = true
                        } else {
                            valiResult = false
                        }
                    } else if (val_max_length && !val_min_length) {
                        // 表示只限制了最大长度
                        if (value.length <= val_max_length) {
                            valiResult = true
                        } else {
                            valiResult = false
                        }
                    } else if (!val_min_length && !val_max_length) {
                        // 表示什么都没有限制的时候
                        valiResult = true
                    }
                } else if (!value) {
                    valiResult = false
                }
                return valiResult;
            case 'mobile':
                valiResult = validateTel(value)
                return validateTel(value)
            case 'tel':
                return validateFixedTel(value)
            case 'ID_card':
                return validateIdCard(value)
            case 'chinese_name':
                return validateChineseName(value)
            case 'url':
                return validateWebsite(value)
            case 'qq':
                return validateQQ(value)
            case 'postal_code':
                return validatePostalCode(value)
            case 'positive_integer':
                return validatePositiveInt(value)
            case 'negative':
                return validateNegative(value)
            case 'two_decimal_places':
                return validateTwoDecimal(value)
            default:
                // if (!!value) {
                //   valiResult = true
                // } else {
                //   valiResult = false
                // }
                if (field_type == '5') {
                    if (
                        !!(files && files.length) ||
                        (limit_file_num != 0 &&
                            files &&
                            files.length != '0' &&
                            files.length < limit_file_num)
                    ) {
                        valiResult = true
                    } else {
                        valiResult = false
                    }
                } else {
                    if (!!value) {
                        valiResult = true
                    } else {
                        valiResult = false
                    }
                }
                return valiResult;
        }
    }

    render() {

        const { title, status, item } = this.props
        console.log(item)

        console.log(status);
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>
                        <View className={indexStyles.titleView}>
                            <View className={indexStyles.title}>{title}</View>
                            {item.is_required && item.is_required == '1' ? (<Text className={indexStyles.isrequired}>*</Text>) : (null)}
                        </View>
                        {/* { options ? ( */}
                        {/* <View className={indexStyles.options}> */}
                        {/* {options && options.map((value, key) => { */}
                        {/* const { id, label_name, prompt_content } = value */}
                        {/* return ( */}
                        {/* <View key={id} className={indexStyles.content}> */}
                        {/* {prompt_content}</View> */}
                        {/* ) */}
                        {/* })} */}
                        {/* </View> */}
                        {/* ) : (<View className={indexStyles.content}>{description}</View>)} */}

                        <Input className={indexStyles.content} placeholder={item.prompt_content} onBlur={this.verifyAction} disabled='false' value={item.value}></Input>
                        {/* disabled={status == 1}  */}
                    </View>
                </View>

            </View>
        )
    }
}

index.defaultProps = {
    title: '', //标题
    description: '', //内容
    options: '', //选择
};