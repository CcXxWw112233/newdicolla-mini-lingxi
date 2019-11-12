import { request, } from "../../utils/request";
import { API_BOARD, } from "../../gloalSet/js/constant";

//全局搜索
export const globalQuery = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'POST',
        url: `${API_BOARD}/comm/global_query`,
    }, notShowLoading)
}
