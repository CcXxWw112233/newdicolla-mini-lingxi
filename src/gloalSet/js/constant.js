//线上环境
//export const BASE_URL = 'https://lingxi.di-an.com' 
//测试环境
export const BASE_URL = 'http://test.lingxi.new-di.com'
//本地环境
// export const BASE_URL = 'http://192.168.1.39'
// export const BASE_URL = 'http://192.168.1.68'
// export const BASE_URL = 'http://ff6vm8.natappfree.cc'
//export const BASE_URL = 'http://prerelease.lingxi.new-di.com'
//export const BASE_URL = 'http://w4iawu.natappfree.cc'
//export const BASE_URL = 'http://uwvnrx.natappfree.cc'

export const NODE_ENV = process.env.NODE_ENV
export const PAGE_SIZE = 20
export const QUERY_TYPE = 1

export const API_UPMS = '/api/upms' //接口域名
export const API_BOARD = '/api/projects' //接口域名
export const API_FILES = '/api/files' //接口域名
export const API_FLOWS = '/api/flows' //接口域名
export const API_WORKBENCHS = '/api/workbenchs'
export const API_MORE = '/api/more'

export const WEBSOCKET_PATH = '192.168.0.30'  //WS链接地址
export const WEBSOCKET_PORT= '9326'  //WS链接地址

export const UPLOAD_PROCESS_FILE_SIZE = 100 //流程上传文件MB限制
export const MESSAGE_DURATION_TIME = 10 //message弹框时间
export const UPLOAD_FILE_SIZE = 30 //上传文件MB限制

export const INT_REQUEST_OK = 0 //接口返回常量定义

//接口返回code 接口返回常量定义
export const REQUEST_RES_CODE_SUCCESS = '0' //成功
export const REQUEST_RES_CODE_TOKEN_INVALID = '401' //token失效
export const REQUEST_RES_CODE_NO_BIND = '4013' //未绑定

//特殊接口字段待修改,（后台定义不规范，前端统一定义，便于修改）
export const RESPONSE_DATA_CODE_DATA = 'data'
