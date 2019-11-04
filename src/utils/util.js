//工具函数
export const isPlainObject = obj => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return true
  }
  return false
}
