import React, { useState } from "react";
import "../styles/detail_reservation_block.css";
import { formatToRussianDateTime } from "../../../utils/formats/dates";
import { formatImageUrl } from "../../../utils/formats/image";
import { RESERVATIONS_STATUSES } from "../utils/data";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { DetailServicesWindow } from "../../services/components/DetailServicesWindow";


export const DetailReservationBlock = ({reservation}) => {
    const status = RESERVATIONS_STATUSES[reservation.status]
    const [isOpenTasksWindow, openTasksWindow] = useState(false)
    
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
                {
                    status?.value == "pending" ?
                    <PickMeButton className={'btns canceled'}>Отменить</PickMeButton>
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
        </div>
    )
}