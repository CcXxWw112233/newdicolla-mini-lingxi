//工具函数
export const isPlainObject = obj => {
  if(typeof obj === 'object' && obj !== null) {
    return true
  }
  return false
}
