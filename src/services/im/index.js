import {API_MORE} from './../../gloalSet/js/constant'
import {request} from './../../utils/request'

// const currentUserListsUrl = `${serverUrlPrefix}/api/more/mini/im/contacts`;

//手动注入， 等完成登录模块，就会自动注入了
const Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTc0NzIwNjEsInVzZXJJZCI6IjEwNzYzMjQ2MzcwNTIzNzUwNDAiLCJvcmdJZCI6IjEwNjA4NzIyMDkwMjA2MjA4MDAiLCJtZW1iZXJJZCI6IjEwNzYzMjUyNTcwODc5NDY3NTIifQ.ZReazv_GR1fuYvtPPCF5x0vr_Q5Fx_64lMJHYmTsae4'

const requestWithNotShowLoading = (method, url, data = {}, header = {Authorization}) => () => request({data, method, url, header}, true)


export const getAllIMTeamList = requestWithNotShowLoading('GET', `${API_MORE}/im/contacts`)
