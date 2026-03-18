import axios from "axios";
import { getBackendUrl, ROOMS_ENDPOINTS } from "../../config/endpoints";
import { apiRequest } from "../../utils/apiRequest";
import { handleReservationRoomError } from "../../utils/errors/reservation/ReservationHandlers";


export const available_rooms_count = async (number_people, check_in, check_out) => {
    return await apiRequest(
        async () => {
            const queries = `?quantity_places=${number_people}&check_in=${check_in}&check_out=${check_out}`
            const res = await axios.get(getBackendUrl(ROOMS_ENDPOINTS.ROOMS_AVAILABLE_COUNT) + queries)
            return res.data
        }
    )
}


export const available_rooms_by_type = async (number_people, check_in, check_out, slug) => {
    return await apiRequest(
        async () => {
            const queries = `?quantity_places=${number_people}&check_in=${check_in}&check_out=${check_out}`
            const url = getBackendUrl(ROOMS_ENDPOINTS.ROOMS_AVAILABLE_BY_TYPE) + slug + queries
            const res = await axios.get(url)
            return res.data
        },
        handleReservationRoomError
    )
}