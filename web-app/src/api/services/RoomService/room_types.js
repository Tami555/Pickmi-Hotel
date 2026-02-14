import axios from "axios";
import { getBackendUrl, ROOMS_ENDPOINTS } from "../../config/endpoints";
import { apiRequest } from "../../utils/apiRequest";


export const room_types_list = async () => {
    return await apiRequest(
        async () => {
            const res = await axios.get(getBackendUrl(ROOMS_ENDPOINTS.ROOMS_TYPES))
            return res.data
        }
    )
}

export const room_type_by_slug = async (slug) => {
    return await apiRequest(
        async () => {
            const res = await axios.get(getBackendUrl(ROOMS_ENDPOINTS.ROOMS_TYPES) + `/${slug}`)
            return res.data
        }
    )
}