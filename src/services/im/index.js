import { API_MORE, API_UPMS } from './../../gloalSet/js/constant'
import { request } from './../../utils/request'

// const currentUserListsUrl = `${serverUrlPrefix}/api/more/mini/im/contacts`;

//手动注入， 等完成登录模块，就会自动注入了
// const Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTc1NzA1MzUsInVzZXJJZCI6IjEwNzYzMjQ2MzcwNTIzNzUwNDAiLCJvcmdJZCI6IjEwNjA4NzIyMDkwMjA2MjA4MDAiLCJtZW1iZXJJZCI6IjEwNzYzMjUyNTcwODc5NDY3NTIifQ.rQrCEwjjRqRxp0QxFRlMXUEa9NjCUu-kjHx3hCwCEro'
// const requestWithNotShowLoading = (method, url, data = {}, header = {Authorization}) => () => request({data, method, url, header}, true)

const requestWithNotShowLoading = (method, url, data = {}) => () => request({ data, method, url }, true)

export const getAllIMTeamList = requestWithNotShowLoading('GET', `${API_MORE}/mini/im/contacts`)

export const getIMAccount = requestWithNotShowLoading('GET', `${API_UPMS}/user/info/im/account`)

export const repairTeam = data => requestWithNotShowLoading('POST', `${API_MORE}/mini/im/checkImTeamData`, data)


//项目圈历史记录
export const getImHistory = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_MORE}/im/history`,
    }, notShowLoading)
}

//项目圈消息 已读
export const setImHistoryRead = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'POST',
        url: `${API_MORE}/im/history/read`,
    }, notShowLoading)
}

//项目圈未读总数
export const getImAllHistoryUnread = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_MORE}/im/history/unread`,
    }, notShowLoading)
}
