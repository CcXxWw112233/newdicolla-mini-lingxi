import Taro, { Component, getApp } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTextarea } from 'taro-ui'
import TopOption from '../../components/tasksRelevant/TopOption/index'


export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidMount() {
        const { describeInfo } = this.$router.params
        this.setState({
            value: describeInfo
        })
    }

    componentDidShow() { }

    componentDidHide() { }

    topCurrencyDetermineChoice = () => {
        const { value } = this.state
        var pages = Taro.getCurrentPages()
        var prevPage = null
        if (pages.length >= 2) {
            prevPage = pages[pages.length - 2]
        }
        if (prevPage) {
            prevPage.setData({
                describeInfo: value,
                source: 'fillDescribe',
            }, function () {
                Taro.navigateBack({})
            })
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
    }
    render() {

        return (
            <View className={indexStyles.viewStyle}>
                <TopOption topCurrencyDetermineChoice={() => this.topCurrencyDetermineChoice()} />
                {/* <AtTextarea value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    placeholder='项目描述...'
                    count={false}
                    minHeight={200}>
                </AtTextarea> */}

                {/* <View><RichText className='text' nodes={name} /></View> */}

                <Editor
                    placeholder='请输入'
                >

                </Editor>


                <View class='toolbar' bindtap="format">
                    <i class="iconfont icon-zitijiacu {{formats.bold ? 'ql-active' : ''}}" data-name="bold"></i>
                    <i class="iconfont icon-zitixieti {{formats.italic ? 'ql-active' : ''}}" data-name="italic"></i>
                    <i class="iconfont icon-zitixiahuaxian {{formats.underline ? 'ql-active' : ''}}" data-name="underline"></i>
                    <i class="iconfont icon-zitishanchuxian {{formats.strike ? 'ql-active' : ''}}" data-name="strike"></i>
                    <i class="iconfont icon-zuoduiqi {{formats.align === 'left' ? 'ql-active' : ''}}" data-name="align" data-value="left"></i>
                    <i class="iconfont icon-juzhongduiqi {{formats.align === 'center' ? 'ql-active' : ''}}" data-name="align" data-value="center"></i>
                    <i class="iconfont icon-youduiqi {{formats.align === 'right' ? 'ql-active' : ''}}" data-name="align" data-value="right"></i>
                    <i class="iconfont icon-zuoyouduiqi {{formats.align === 'justify' ? 'ql-active' : ''}}" data-name="align" data-value="justify"></i>
                    <i class="iconfont icon-line-height {{formats.lineHeight ? 'ql-active' : ''}}" data-name="lineHeight" data-value="2"></i>
                    <i class="iconfont icon-Character-Spacing {{formats.letterSpacing ? 'ql-active' : ''}}" data-name="letterSpacing" data-value="2em"></i>
                    <i class="iconfont icon-722bianjiqi_duanqianju {{formats.marginTop ? 'ql-active' : ''}}" data-name="marginTop" data-value="20px"></i>
                    <i class="iconfont icon-723bianjiqi_duanhouju {{formats.micon-previewarginBottom ? 'ql-active' : ''}}" data-name="marginBottom" data-value="20px"></i>
                    <i class="iconfont icon-clearedformat" bindtap="removeFormat"></i>
                    <i class="iconfont icon-font {{formats.fontFamily ? 'ql-active' : ''}}" data-name="fontFamily" data-value="Pacifico"></i>
                    <i class="iconfont icon-fontsize {{formats.fontSize === '24px' ? 'ql-active' : ''}}" data-name="fontSize" data-value="24px"></i>

                    <i class="iconfont icon-text_color {{formats.color === '#0000ff' ? 'ql-active' : ''}}" data-name="color" data-value="#0000ff"></i>
                    <i class="iconfont icon-fontbgcolor {{formats.backgroundColor === '#00ff00' ? 'ql-active' : ''}}" data-name="backgroundColor" data-value="#00ff00"></i>

                    <i class="iconfont icon-date" bindtap="insertDate"></i>
                    <i class="iconfont icon--checklist" data-name="list" data-value="check"></i>
                    <i class="iconfont icon-youxupailie {{formats.list === 'ordered' ? 'ql-active' : ''}}" data-name="list" data-value="ordered"></i>
                    <i class="iconfont icon-wuxupailie {{formats.list === 'bullet' ? 'ql-active' : ''}}" data-name="list" data-value="bullet"></i>
                    <i class="iconfont icon-undo" bindtap="undo"></i>
                    <i class="iconfont icon-redo" bindtap="redo"></i>

                    <i class="iconfont icon-outdent" data-name="indent" data-value="-1"></i>
                    <i class="iconfont icon-indent" data-name="indent" data-value="+1"></i>
                    <i class="iconfont icon-fengexian" bindtap="insertDivider"></i>
                    <i class="iconfont icon-charutupian" bindtap="insertImage"></i>
                    <i class="iconfont icon-format-header-1 {{formats.header === 1 ? 'ql-active' : ''}}" data-name="header" data-value="{{1}}"></i>
                    <i class="iconfont icon-zitixiabiao {{formats.script === 'sub' ? 'ql-active' : ''}}" data-name="script" data-value="sub"></i>
                    <i class="iconfont icon-zitishangbiao {{formats.script === 'super' ? 'ql-active' : ''}}" data-name="script" data-value="super"></i>
                    <i class="iconfont icon-shanchu" bindtap="clear"></i>
                    <i class="iconfont icon-direction-rtl {{formats.direction === 'rtl' ? 'ql-active' : ''}}" data-name="direction" data-value="rtl"></i>

                </View>
            </View>
        )
    }
}
