import Taro, { Component } from '@tarojs/taro';
import { View, Image, AtBadge } from '@tarojs/components';
import styles from './Avatar.scss';
import { AtIcon } from 'taro-ui';

class Avatar extends Component {
    isValidImgUrl = url => {
        return /^http[s]?:/.test(url);
    };
    render() {
        const { urlList, showDot, maxValue, value } = this.props;
        const urlLen = urlList.length;
        return (
            <View className={styles.wrapper}>
                {Number(value) <= 0 && showDot && <View className={styles.newsDot} />}
                {Number(value) > 0 && !showDot && (
                    <View className={styles.newsNumber}>
                        {Number(value) <= maxValue ? Number(value) : maxValue + '+'}
                    </View>
                )}
                {urlLen === 1 && (
                    <View className={styles.wrapperOne}>
                        {urlList.map(i => {
                            if (this.isValidImgUrl(i)) {
                                return (
                                    <View key={i} className={styles.ItemWrapperOne}>
                                        <Image className={styles.item} mode='aspectFill' src={i} />
                                    </View>
                                );
                            }
                            return (
                                <View key={i} className={styles.ItemWrapperOne}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen === 2 && (
                    <View className={styles.wrapperTwo}>
                        {urlList.map(i => {
                            if (this.isValidImgUrl(i)) {
                                return (
                                    <View key={i} className={styles.ItemWrapperTwo}>
                                        <Image className={styles.item} mode='aspectFill' src={i} />
                                    </View>
                                );
                            }
                            return (
                                <View key={i} className={styles.ItemWrapperTwo}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen === 3 && (
                    <View className={styles.wrapperThree}>
                        {urlList.map((i, index) => {
                            if (this.isValidImgUrl(i)) {
                                return (
                                    <View
                                        key={i}
                                        className={
                                            index === 0
                                                ? styles.ItemWrapperThreeFirstChild
                                                : styles.ItemWrapperThree
                                        }
                                    >
                                        <Image className={styles.item} mode='aspectFill' src={i} />
                                    </View>
                                );
                            }
                            return (
                                <View
                                    key={i}
                                    className={
                                        index === 0
                                            ? styles.ItemWrapperThreeFirstChild
                                            : styles.ItemWrapperThree
                                    }
                                >
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen === 4 && (
                    <View className={styles.wrapperFour}>
                        {urlList.map(i => {
                            if (this.isValidImgUrl(i)) {
                                return (
                                    <View key={i} className={styles.ItemWrapperFour}>
                                        <Image className={styles.item} mode='aspectFill' src={i} />
                                    </View>
                                );
                            }
                            return (
                                <View key={i} className={styles.ItemWrapperFour}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon
                                            style={{ height: '20px' }}
                                            value='user'
                                            size='18'
                                            color='#3F536E'
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen >= 5 && (
                    <View className={styles.wrapperFive}>
                        {this.isValidImgUrl(urlList[0]) ? (
                            <View className={styles.ItemWrapperFiveFirstChild}>
                                <Image
                                    className={styles.item}
                                    mode='aspectFill'
                                    src={urlList[0]}
                                />
                            </View>
                        ) : (
                                <View className={styles.ItemWrapperFiveFirstChild}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[1]) ? (
                            <View className={styles.ItemWrapperFiveSecondChild}>
                                <Image
                                    className={styles.item}
                                    mode='aspectFill'
                                    src={urlList[1]}
                                />
                            </View>
                        ) : (
                                <View className={styles.ItemWrapperFiveSecondChild}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[2]) ? (
                            <View className={styles.ItemWrapperFiveThirdChild}>
                                <Image
                                    className={styles.item}
                                    mode='aspectFill'
                                    src={urlList[2]}
                                />
                            </View>
                        ) : (
                                <View className={styles.ItemWrapperFiveThirdChild}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[3]) ? (
                            <View className={styles.ItemWrapperFiveFourthChild}>
                                <Image
                                    className={styles.item}
                                    mode='aspectFill'
                                    src={urlList[3]}
                                />
                            </View>
                        ) : (
                                <View className={styles.ItemWrapperFiveFourthChild}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[4]) ? (
                            <View className={styles.ItemWrapperFiveFifthChild}>
                                <Image
                                    className={styles.item}
                                    mode='aspectFill'
                                    src={urlList[4]}
                                />
                            </View>
                        ) : (
                                <View className={styles.ItemWrapperFiveFifthChild}>
                                    <View className={styles.amendAtIconPosition}>
                                        <AtIcon value='user' size='18' color='#3F536E' />
                                    </View>
                                </View>
                            )}
                    </View>
                )}
            </View>
        );
    }
}

Avatar.defaultProps = {
    urlList: [], //头像 url 字符串数组
    showDot: false, //是否显示右上角圆点
    value: 0, //显示的数字，如果大于等于零则显示，否则不显示
    maxValue: 99 //要显示的最大值
};

export default Avatar;
