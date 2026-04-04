import React, { useState } from "react";
import "../styles/detail_reservation_block.css";
import { formatToRussianDateTime } from "../../../utils/formats/dates";
import { formatImageUrl } from "../../../utils/formats/image";
import { RESERVATIONS_STATUSES } from "../utils/data";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailServicesWindow } from "../../services/components/DetailServicesWindow";
import { useFetch } from "../../../hooks/useFetch";
import { ModalWindow } from "../../../components/UI/feedback/ModalWindow";
import { Loader } from "../../../components/UI/feedback/Loader";
import { cancel_reservations } from "../../../api/services/ReservationsService/reservation";


export const DetailReservationBlock = ({reservation}) => {
    const [status, setStatus] = useState(RESERVATIONS_STATUSES[reservation.status])
    const [isOpenTasksWindow, openTasksWindow] = useState(false)

    const [confirmCancelWindow, openConfirmCancelWindow] = useState(false)
    const [reservationCancel, loadingCancel, serverError] = useFetch(
        async () => {
            await cancel_reservations(reservation.id);
            openConfirmCancelWindow(false);
            setStatus(RESERVATIONS_STATUSES.canceled)
        }
    )

    
    return (
        <div className="deatil-reservation-block">
            <div className="reservation-status" style={{background: status?.color}}>
                {status?.value}
            </div>
            <img src={formatImageUrl(reservation.room.room_type.image)} className="image"/>
            <div className="detail-infa">
                <h2 className="title">Номер {reservation.room.room_number}</h2>
                <div className="infa-block">
                    <h3>Тип номера: <span>{reservation.room.room_type.title}</span></h3>
                    <h3>Кол-чел: <span>{reservation.room.quantity_places}</span></h3>

                    <h3>Въезд: <span>{formatToRussianDateTime(reservation.check_in_date)}</span></h3>
                    <h3>Этаж: <span>{reservation.room.floor}</span></h3>

                    <h3>Выезд: <span>{formatToRussianDateTime(reservation.check_out_date)}</span></h3>                    
                    <h3>Итог: <span>{reservation.total_price} руб</span></h3>
                </div>
                {/* {serverError && <p className="errors">{serverError}</p>} */}
                {
                    status == RESERVATIONS_STATUSES.pending ?
                    <PickMeButton
                        className={'btns canceled'}
                        onClick={() => openConfirmCancelWindow(true)}
                    >
                        Отменить
                    </PickMeButton>
                    :
                    reservation.tasks.length > 0 &&
                    <PickMeButton
                        onClick={() => openTasksWindow(true)}
                        className={"btns services"}
                    >
                        Посмотреть заказанные услуги
                    </PickMeButton>
                }
                <DetailServicesWindow
                    isOpen={isOpenTasksWindow}
                    closeFunc={() => openTasksWindow(false)}
                    services_list={reservation.tasks}
                    title_window={`Услуги номера ${reservation.room.room_number}`}
                />
            </div>
            <ModalWindow
                isOpen={confirmCancelWindow}
                closeFunc={() => {openConfirmCancelWindow(false)}}
            >
                <h1>Вы уверены, что хотите отменить бронь на номер {reservation.room.room_number} ?</h1>
                <PickMeButton
                    onClick={() => reservationCancel()}
                >
                    {loadingCancel ? <Loader/> : 'Отменить бронь'}
                </PickMeButton>
            </ModalWindow>
        </div>
    )
}