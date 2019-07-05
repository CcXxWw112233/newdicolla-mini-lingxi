//工具函数
export const isPlainObject = obj => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return true
  }
  return false
}


//前端数据分组分页工具
function getPaginationData(pageNo, pageSize, array) {
  var offset = (pageNo - 1) * pageSize;
  return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
}
