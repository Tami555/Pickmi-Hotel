import react, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { useLocation, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { available_rooms_by_type, room_type_by_slug } from "../../api/services";
import { ReservationRoomTypeBlock } from "./components/ReservationRoomTypeBlock";
import { BackStepButton } from "../../components/UI/buttons/BackStepButton";
import { FilterAvailableRoomBlock } from "../rooms/components/FilterAvailableRoomBlock";
import "./styles/reservation_page.css";


export const ReservationPage = () => {
    const params = useParams()
    const location = useLocation();
    const queries = new URLSearchParams(location.search);
    const [roomType, setRoomType] = useState({})

    const [get_room_type, loading, serverError] = useFetch(
        async () => {
            const res = await room_type_by_slug(params.slug);
            setRoomType(res)
        }
    )
    useEffect(() => {get_room_type()}, [])

    const [filterData, setFilterData] = useState({
        check_in: queries.get('check_in') ?? '',
        check_out: queries.get('check_out') ?? '',
        number_people: queries.get('number_people') ?? ''
    })
    const [availableRoomsList, setAvailableRoomsList] = useState([])
    
    return (
        <CommonBlock>
            <BackStepButton/>
            <h1 className="reservation-title">Бронирование номеров</h1>
            <ContentApiBlock loading={loading} error={serverError}>
                <ReservationRoomTypeBlock roomData={roomType}/>
            </ContentApiBlock>
            <h2 className="reservation-rooms-search-title">Поиск свободных номеров</h2>
            <FilterAvailableRoomBlock
                filterData={filterData}
                setFilterData={setFilterData}
                setFilterResponse={setAvailableRoomsList}
                applyFiltersFunc={available_rooms_by_type}
                optionalApplyParams={[params.slug]}
            />
            <br/>
            <div>
                {availableRoomsList?.map(room => (
                    <h1>Номер {room.room_number}</h1>
                ))}
            </div>
        </CommonBlock>
    )
}