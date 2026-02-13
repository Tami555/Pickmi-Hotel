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