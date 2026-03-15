import React from "react";
import {hotel_bed_1 } from "../../../images/index";
import { formatToRussianDateTime } from "../../../utils/formats/dates";
import "../styles/reservation_block.css";
import { formatImageUrl } from "../../../utils/formats/image";


export const ReservationBlock = ({reservation}) => {
    return (
        <div className="reservation-block">
            <img src={formatImageUrl(reservation.room.room_type.image)} className="image"/>
            <div className="infa-block">
                <h2 className="nuber-title">
                    Номер {reservation.room.room_type.title} №{reservation.room.room_number}
                </h2>
                <div className="main-infa">
                    <h3>Заезд</h3>
                    <h3>Выезд</h3>
                    <h3>Кол-во человек</h3>
                    <p>{formatToRussianDateTime(reservation.check_in_date)}</p>
                    <p>{formatToRussianDateTime(reservation.check_out_date)}</p>
                    <p>{reservation.room.quantity_places}</p>
                </div>
                <h2 className="price">Цена: {reservation.total_price} руб</h2>
            </div>
        </div>
    )
}