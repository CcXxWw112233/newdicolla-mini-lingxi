import {API_MORE} from './../../gloalSet/js/constant'
import {request} from './../../utils/request'

// const currentUserListsUrl = `${serverUrlPrefix}/api/more/mini/im/contacts`;

//手动注入， 等完成登录模块，就会自动注入了
const Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTc1NzA1MzUsInVzZXJJZCI6IjEwNzYzMjQ2MzcwNTIzNzUwNDAiLCJvcmdJZCI6IjEwNjA4NzIyMDkwMjA2MjA4MDAiLCJtZW1iZXJJZCI6IjEwNzYzMjUyNTcwODc5NDY3NTIifQ.rQrCEwjjRqRxp0QxFRlMXUEa9NjCUu-kjHx3hCwCEro'

const requestWithNotShowLoading = (method, url, data = {}, header = {Authorization}) => () => request({data, method, url, header}, true)


export const getAllIMTeamList = requestWithNotShowLoading('GET', `${API_MORE}/im/contacts`)
