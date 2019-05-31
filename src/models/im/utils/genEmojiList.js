/**
 *
 * @param {string} type - emoji 类型: emoji | pinup
 * @param {array} emojiList - emoji 列表: emojiObj.emojiList | emojiObj.pinupList
 */
function genEmojiList (type, emojiList) {
  let result = {}
  for (let name in emojiList) {
    let emojiMap = emojiList[name]
    let list = []
    for (let key in emojiMap) {
      list.push({
        type,
        name,
        key,
        img: emojiMap[key].img
      })
    }
    if (list.length > 0) {
      result[name] = {
        type,
        name,
        list,
        album: list[0].img
      }
    }
  }
  return result
}

export default genEmojiList
