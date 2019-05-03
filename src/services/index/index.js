import { request, packagePromise} from "../../utils/request";

export const getBar = (data , notShowLoading) => {
  request({
    data: {
      ...data
    },
    method: 'GET',
    url: `/stars`,
  }, notShowLoading)
}
