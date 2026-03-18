import React from "react";
import "../styles/reservation_room_type_block.css"
import { formatImageUrl } from "../../../utils/formats/image";


export const ReservationRoomTypeBlock = ({roomData}) => {
    return (
        <div className="reservation-room-type-block">
            <img src={formatImageUrl(roomData.image)}/>
            <div className="room-type-infa">
                <h2 className="title">Номер {roomData.title}</h2>
                <div className="amenities-list">
                    Доступные удобства : 
                    {roomData?.amenities?.map((a) => (
                        <div className="amenity-block">
                            {a.title}
                        </div>
                    ))}
                </div>
                <h2 className="price-per-day">Цена за 1 ночь: <span>{roomData.price_per_day}руб</span></h2>
            </div>
        </div>
    )
}