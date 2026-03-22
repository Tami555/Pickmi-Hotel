import react, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { available_rooms_by_type, create_reservations, room_type_by_slug } from "../../api/services";
import { ReservationRoomTypeBlock } from "./components/ReservationRoomTypeBlock";
import { BackStepButton } from "../../components/UI/buttons/BackStepButton";
import { FilterAvailableRoomBlock } from "../rooms/components/FilterAvailableRoomBlock";
import "./styles/reservation_page.css";
import { RoomBlock } from "./components/RoomBlock";
import { ModalWindow } from "../../components/UI/feedback/ModalWindow";
import { formatToRussianDateTime } from "../../utils/formats/dates";
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";
import { Loader } from "../../components/UI/feedback/Loader";
import { useAuth } from "../../contexts/AuthContext";


export const ReservationPage = () => {
    const params = useParams()
    const location = useLocation();
    const queries = new URLSearchParams(location.search);
    const nav = useNavigate();
    const {isAuth} = useAuth();
    

    const [roomType, setRoomType] = useState({})
    const [get_room_type, loadingRoomType, serverRoomTypeError] = useFetch(
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

    const [availableRoomsList, setAvailableRoomsList] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [confirmReservationWindow, openConfirmReservation] = useState(false);
    const countDays = (new Date(filterData.check_out).setHours(0, 0, 0, 0) - new Date(filterData.check_in).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);

    const [reservation_func, loadingReservation, serverreservationError] = useFetch(
        async () => {
            const res = await create_reservations(
                selectedRoom.room_number,
                filterData.check_in,
                filterData.check_out
            )
            nav('/users/profile')
        }
    )

    
    return (
        <CommonBlock>
            <BackStepButton/>
            <h1 className="reservation-title">Бронирование номеров</h1>
            <ContentApiBlock loading={loadingRoomType} error={serverRoomTypeError}>
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
                    <RoomBlock
                        key={room.room_number}
                        room={room}
                        selectedRoom={setSelectedRoom}
                        reservationFunc={() => {isAuth ? openConfirmReservation(true) : nav('/users/login')}}
                    />
                ))}
            </div>
            <ModalWindow
                isOpen={confirmReservationWindow}
                closeFunc={() => {openConfirmReservation(false)}}
                className={"confirm-reservation-window"}
            >
                <h1>Подтверждение бронирования</h1>
                <h2><span>Тип:</span> {roomType.title}</h2>
                <h2><span>Номер:</span>  {selectedRoom?.room_number}</h2>
                <h2><span>Этаж:</span> {selectedRoom?.floor}</h2>
                <h2><span>Кол-во мест:</span> {selectedRoom?.quantity_places}</h2>
                <h2><span>Заезд:</span> {formatToRussianDateTime(filterData.check_in)}</h2>
                <h2><span>Выезд:</span> {formatToRussianDateTime(filterData.check_out)}</h2>
                <h2><span>Цена за ночь:</span> {roomType.price_per_day} руб</h2>
                <h2><span>Финальная цена:</span> {roomType.price_per_day * countDays}руб</h2>

                {/* Серверные ошибки */}
                {serverreservationError && <p className="errors">{serverreservationError}</p>}
                <PickMeButton onClick={reservation_func}>
                    {loadingReservation ?
                        <Loader/>
                        :
                        'Бронировать'
                    }
                </PickMeButton>
            </ModalWindow>
        </CommonBlock>
    )
}