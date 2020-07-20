import { request, } from "../../utils/request";
import { API_BOARD } from "../../gloalSet/js/constant";
import { createHeaderContentDataByCardId } from '../constant'

//流程详情
export const getTemplateDetails = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        headers: createHeaderContentDataByCardId(data.card_id),
        method: 'GET',
        url: `${API_BOARD}/v2/workflow`,
    }, notShowLoading)
}

export const aa = (data, notShowLoading) => {

}




