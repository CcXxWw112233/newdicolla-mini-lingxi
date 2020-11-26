//内容类型 board , list, card, file, folder,flow
export const CONTENT_DATA_TYPE_BOARD = 'board'
export const CONTENT_DATA_TYPE_MILESTONE = 'milestone'
export const CONTENT_DATA_TYPE_LIST = 'list'
export const CONTENT_DATA_TYPE_CARD = 'card'
export const CONTENT_DATA_TYPE_FILE = 'file'
export const CONTENT_DATA_TYPE_FOLDER = 'folder'
export const CONTENT_DATA_TYPE_FLOW = 'flow'

export const createHeaderContentDataByCardId = (cardId) => {
  if (cardId) {
    return {
      BaseInfo: {
        contentDataType: CONTENT_DATA_TYPE_CARD,
        contentDataId: cardId
      }
    }
  } else {
    return {}
  }
}
