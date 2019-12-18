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
                                    <Image key={i} className={styles.ItemWrapperOne} mode='aspectFill' src={i} />
                                );
                            }
                            return (
                                <View className={styles.ItemWrapperOneUnImg}>
                                    {i}
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen === 2 && (
                    <View className={styles.wrapperTwo}>
                        {urlList.map((i, key) => {
                            if (this.isValidImgUrl(i)) {
                                return (
                                    <View key={i} className={styles.ItemWrapperTwo}>
                                        <Image className={key === 0 ? styles.ItemWrapperTwoFirstChild : styles.ItemWrapperTwoSecondChild} mode='aspectFill' src={i} />
                                    </View>
                                );
                            }
                            return (
                                <View key={i} className={styles.ItemWrapperTwo}>
                                    <View className={key === 0 ? styles.ItemWrapperTwoFirstChild : styles.ItemWrapperTwoSecondChild}>
                                        {i}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}
                {urlLen === 3 && (
                    <View className={styles.wrapperThree}>
                        {this.isValidImgUrl(urlList[0]) ? (
                            <Image
                                className={styles.ItemWrapperThreeFirstChild}
                                mode='aspectFill'
                                src={urlList[0]}
                            />
                        ) : (
                                <View
                                    className={styles.ItemWrapperThreeFirstChild}>
                                    {urlList[0]}
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[1]) ? (
                            <Image
                                className={styles.ItemWrapperThreeSecondChild}
                                mode='aspectFill'
                                src={urlList[1]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperThreeSecondChild}>
                                    {urlList[1]}
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[2]) ? (
                            <Image
                                className={styles.ItemWrapperThreeThirdChild}
                                mode='aspectFill'
                                src={urlList[2]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperThreeThirdChild}>
                                    {urlList[2]}
                                </View>
                            )}
                    </View>
                )}
                {urlLen >= 4 && (
                    <View className={styles.wrapperFour}>
                        {this.isValidImgUrl(urlList[0]) ? (
                            <Image
                                className={styles.ItemWrapperFourFirstChild}
                                mode='aspectFill'
                                src={urlList[0]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperFourFirstChild}>
                                    {urlList[0]}
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[1]) ? (
                            <Image
                                className={styles.ItemWrapperFourSecondChild}
                                mode='aspectFill'
                                src={urlList[1]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperFourSecondChild}>
                                    {urlList[1]}
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[2]) ? (
                            <Image
                                className={styles.ItemWrapperFourThirdChild}
                                mode='aspectFill'
                                src={urlList[2]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperFourThirdChild}>
                                    {urlList[2]}
                                </View>
                            )}
                        {this.isValidImgUrl(urlList[3]) ? (
                            <Image
                                className={styles.ItemWrapperFourFourthChild}
                                mode='aspectFill'
                                src={urlList[3]}
                            />
                        ) : (
                                <View className={styles.ItemWrapperFourFourthChild}>
                                    {urlList[3]}
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
