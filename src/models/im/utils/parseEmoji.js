import emojiObj from './../config/emoji.js';
import genEmojiList from './genEmojiList.js';

/**
 * //解析 emoji 文本
 * @param {string} str - 需要被解析的包含emoji图片的字符串
 *                     - emoji图片字符串： \[笑哭]
 * @returns {array} - 解析出来的对象数组
 *
 * @example
 *
 * //parseEmoji('abc[笑哭]haha')
 * //return:
 * // [
 * //  {categ: 'text', cont: 'abc'},
 * //  {categ: 'emoji', cont: '[笑哭]'},
 * //  {categ: 'text', cont: 'haha'}
 * // ]
 */
const parseEmoji = (str = '') => {
  const isHasEndSymbol = (str = '') => str.includes(']');
  const isEmoji = (str = '') => str[0] === '[' && str[str.length - 1] === ']';
  const getSplitEmojiStrArr = (str = '') => {
    const ind = str.indexOf(']');
    if (ind === str.length - 1) {
      return [`[${str}`];
    }
    return [`[${str.substring(0, ind + 1)}`, str.substring(ind + 1)];
  };
  const flat = i => {
    if (!Array.isArray(i)) {
      return i;
    }
    return [].concat(...i.map(e => (Array.isArray(e) ? flat(e) : e)));
  };
  const genTypeObj = (type, i) => ({ categ: type, cont: i });

  return str
    .split('[')
    .map(i => (isHasEndSymbol(i) ? getSplitEmojiStrArr(i) : i))
    .reduce((acc, curr) => acc.concat(flat(curr)), [])
    .filter(i => typeof i === 'string' && i.trim())
    .map(i => (isEmoji(i) ? genTypeObj('emoji', i) : genTypeObj('text', i)));
};

const checkEmojiValid = (genEmojiList, emojiList) => (str = '') => {
  try {
    const emojiArr = genEmojiList('emoji', emojiList).emoji.list;
    const isFinedEmoji = emojiArr.find(i => i.key === str);
    return isFinedEmoji ? isFinedEmoji.img : null;
  } catch (e) {
    return null;
  }
};

const isValidEmoji = checkEmojiValid(genEmojiList, emojiObj.emojiList);

const parsePinup = ({ data: { catalog, chartlet } }) => {
  const { pinupList } = emojiObj;
  try {
    return genEmojiList('pinup', pinupList)[catalog].list.find(
      i => i.key === chartlet
    ).img;
  } catch (e) {
    return '';
  }
};

export { parseEmoji, isValidEmoji, parsePinup };
