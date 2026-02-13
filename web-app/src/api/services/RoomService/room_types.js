import axios from "axios";
import { getBackendUrl, ROOMS_ENDPOINTS } from "../../endpoints";


export const room_types_list = async () => {
    const res = await axios.get(getBackendUrl(ROOMS_ENDPOINTS.ROOMS_TYPES))
    return res.data
}