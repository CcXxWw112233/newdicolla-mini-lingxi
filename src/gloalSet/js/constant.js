//线上环境
export const BASE_URL = "https://lingxi.di-an.com";
//测试环境
// export const BASE_URL = "http://test.lingxi.new-di.com";
//稳定版开发服务器
// export const BASE_URL = 'http://dev.lingxi.new-di.com'
//本地环境
// export const BASE_URL = 'http://192.168.1.81:8836'
//预发布地址
// export const BASE_URL = 'http://ygk5cq.natappfree.cc'

// 后端环境
// export const BASE_URL = "http://192.168.1.36";

/***
 * 根据环境自动配置url
 */
// export let BASE_URL
// if (typeof __wxConfig == "object") {
//     let version = __wxConfig.envVersion;
//     // console.log("当前环境:" + version)
//     if (version == "develop") { //工具或者真机 开发环境
//         BASE_URL = 'http://test.lingxi.new-di.com'
//     } else if (version == "trial") { //测试环境(体验版)
//         BASE_URL = 'https://lingxi.di-an.com'
//     } else if (version == "release") { //正式环境
//         BASE_URL = 'https://lingxi.di-an.com'
//     }
// }

export const NODE_ENV = process.env.NODE_ENV;
export const PAGE_SIZE = 20;
export const QUERY_TYPE = 1;
export const REQUEST_PREFIX = "/dian_lingxi";

export const API_UPMS = `${REQUEST_PREFIX}/upms`; //接口域名
export const API_BOARD = `${REQUEST_PREFIX}/projects`; //接口域名
export const API_FILES = `${REQUEST_PREFIX}/files`; //接口域名
export const API_FLOWS = `${REQUEST_PREFIX}/flows`; //接口域名
export const API_WORKBENCHS = `${REQUEST_PREFIX}/workbenchs`;
export const API_MORE = `${REQUEST_PREFIX}/more`;
export const REQUEST_INTERGFACE_VERSIONN = "/v2"; //接口版本

export const WEBSOCKET_PATH = "192.168.0.30"; //WS链接地址
export const WEBSOCKET_PORT = "9326"; //WS链接地址

export const UPLOAD_PROCESS_FILE_SIZE = 100; //流程上传文件MB限制
export const MESSAGE_DURATION_TIME = 10; //message弹框时间
export const UPLOAD_FILE_SIZE = 30; //上传文件MB限制

export const INT_REQUEST_OK = 0; //接口返回常量定义

//接口返回code 接口返回常量定义
export const REQUEST_RES_CODE_SUCCESS = "0"; //成功
export const REQUEST_RES_CODE_TOKEN_INVALID = "401"; //token失效
export const REQUEST_RES_CODE_NO_BIND = "4013"; //未绑定

//特殊接口字段待修改,（后台定义不规范，前端统一定义，便于修改）
export const RESPONSE_DATA_CODE_DATA = "data";

//腾讯位置服务SDK app_key
export const QQMAPSDK_KEY = "AECBZ-47EKW-RCCRD-RMJH5-T64O2-HEFTQ";

export const MEETING_APPID = "wxa68e2267756b3f16";


//权限列表
export const ORG_TEAM_BOARD_CREATE = 'org:team:board:create' //创建项目 permission_type = 1
export const ORG_TEAM_BOARD_JOIN = 'org:team:board:join' //加入项目 permission_type = 1
export const ORG_UPMS_ORGANIZATION_MEMBER_ADD = 'org:upms:organization:member:add' //添加成员permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_EDIT = 'org:upms:organization:member:edit' //编辑成permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_REMOVE = 'org:upms:organization:member:remove' //移除成员 permission_type=1
export const ORG_UPMS_ORGANIZATION_GROUP = 'org:upms:organization:group' //管理分组 permission_type=1
export const ORG_UPMS_ORGANIZATION_EDIT = 'org:upms:organization:edit' //编辑基本信息 permission_type=1
export const ORG_UPMS_ORGANIZATION_DELETE = 'org:upms:organization:delete' //删除组织 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_CREATE = 'org:upms:organization:role:create' //创建角permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_EDIT = 'org:upms:organization:role:edit' //编辑角色 permission_type=1
export const ORG_UPMS_ORGANIZATION_ROLE_DELETE = 'org:upms:organization:role:delete' //删除角permission_type=1
export const ORG_TEAM_BOARD_QUERY = 'org:team:board:query' //查看项目 permission_type=1
export const ORG_TEAM_BOARD_EDIT = 'org:team:board:edit' //编辑项目 permission_type=1
export const ORG_UPMS_ORGANIZATION_MEMBER_QUERY = 'org:upms:organization:member:query' //查看成员 permission_type=1
export const ORG_TEAM_FLOW_TEMPLETE = 'org:team:flow:template' //组织管理流程模板 permission_type=1
export const PROJECT_TEAM_BOARD_MEMBER = 'project:team:board:member' //成员管理 permission_type=2
export const PROJECT_TEAM_BOARD_EDIT = 'project:team:board:edit' //编辑项目 permission_type=2
export const PROJECT_TEAM_BOARD_ARCHIVE = 'project:team:board:archive' //归档项目 permission_type=2
export const PROJECT_TEAM_BOARD_DELETE = 'project:team:board:delete' //删除项目 permission_type=2
export const PROJECT_TEAM_BOARD_CONTENT_PRIVILEGE = 'project:team:board:content:privilege' // 访问控制 permission_type=2
export const PROJECT_FLOWS_FLOW_TEMPLATE = 'project:flows:flow:template' //管理流程模板 permission_type=2
export const PROJECT_FLOWS_FLOW_CREATE = 'project:flows:flow:create' //新增流程 permission_type=2
export const PROJECT_FLOWS_FLOW_DELETE = 'project:flows:flow:delete' //删除流程 permission_type=2
export const PROJECT_FLOWS_FLOW_ABORT = 'project:flows:flow:abort' //中止流程 permission_type=2
export const PROJECT_FLOW_FLOW_ACCESS = 'project:flows:flow:access' //访问流程 permission_type=2
export const PROJECT_FLOWS_FLOW_COMMENT = 'project:flows:flow:comment' //发表评论 //
export const PROJECT_TEAM_CARD_INTERVIEW = 'project:team:card:interview' //访问任务 permission_type=2
export const PROJECT_TEAM_CARD_CREATE = 'project:team:card:create' //创建任务 permission_type=2
export const PROJECT_TEAM_CARD_EDIT = 'project:team:card:edit' //编辑任务 permission_type=2
export const PROJECT_TEAM_CARD_COMPLETE = 'project:team:card:complete' //完成/重做任务 permission_type=2
export const PROJECT_TEAM_CARD_DELETE = 'project:team:card:delete' //删除任务 permission_type=2
export const PROJECT_TEAM_CARD_GROUP = 'project:team:card:group' //管理任务分组 permission_type=2
export const PROJECT_TEAM_CARD_EDIT_FINISH_TIME = 'project:team:card:edit:finishTime' //修改任务完成时间
export const PROJECT_TEAM_CARD_COMMENT_PUBLISH = 'project:team:card:comment:publish' //发表评论 permission_type=2
export const PROJECT_TEAM_CARD_ATTACHMENT_UPLOAD = 'project:team:card:attachment:upload' // 上传附件 premission_type = 2
export const PROJECT_FILES_FILE_INTERVIEW = 'project:files:file:interview' //访问文件 permission_type=2
export const PROJECT_FILES_FILE_UPLOAD = 'project:files:file:upload' //上传文件 permission_type=2
export const PROJECT_FILES_FILE_DOWNLOAD = 'project:files:file:download' //下载文件 permission_type=2
export const PROJECT_FILES_FILE_UPDATE = 'project:files:file:update' //更新文件 permission_type=2
export const PROJECT_FILES_FILE_DELETE = 'project:files:file:delete' //删除文件 permission_type=2
export const PROJECT_FILES_FILE_EDIT = 'project:files:file:edit' //编辑文件 permission_type=2
export const PROJECT_FILES_FOLDER = 'project:files:folder' //管理文件夹 permission_type=2
export const PROJECT_FILES_COMMENT_PUBLISH = 'project:files:comment:publish' //发表评论 permission_type=2
export const PROJECT_FILES_COMMENT_VIEW = 'project:files:comment:view' //查看评论 permission_type=2
export const PROJECT_TEAM_BOARD_MILESTONE = 'project:team:board:milestone' // 查看项
