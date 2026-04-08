import react, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { ContentApiBlock } from "../../../components/layouts/ContentApiBlock";
import { current_user_reservations } from "../../../api/services";
import "../styles/reservations_list.css";
import { ReservationBlock } from "./ReservationBlock";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailReservationsWindow } from "./DetailReservationsWindow";
import { useNavigate } from "react-router-dom";


export const ReservationsList = () => {
    const nav = useNavigate();
    const [userReservations, setUserReservations] = useState([])
    const [isOpenDetailWindow, openDetailWindow] = useState(false)

    const [get_user_reservation, loading, errorServer] = useFetch(
        async () => {
            const res = await current_user_reservations()
            setUserReservations(res)
        }
    )
    useEffect(() => {get_user_reservation()}, [])
    return (
        <div className="reservation-list-block">
            <h1 className="main-title">Ваши номера:</h1>
            <ContentApiBlock loading={loading} error={errorServer}>
                {
                    userReservations.length > 0 ?
                    <>
                        {userReservations.slice(0, 2).map(reservation => (<ReservationBlock reservation={reservation} key={reservation.id}/>))}
                        {userReservations.length > 2 && <p>...</p>}
                        <PickMeButton onClick={() => openDetailWindow(true)}>Подробнее</PickMeButton>
                    </>
                    :
                    <div className={"create-service-btn"} onClick={() => nav('/rooms')}>+</div>
                }
                <DetailReservationsWindow
                    isOpen={isOpenDetailWindow}
                    closeFunc={() => {openDetailWindow(false); get_user_reservation()}}
                    reservations_list={userReservations}
                />
            </ContentApiBlock>
        </div>
    )
}
