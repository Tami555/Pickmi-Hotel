import React, { useState } from "react";
import "../styles/room_block.css";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";


export const RoomBlock = ({room, selectedRoom, reservationFunc}) => {
    
    return (
        <div className="reservation-room-block">
            <div className="infa-block">
                <h2>Номер {room.room_number}</h2>
                <div>
                    <p>Этаж: {room.floor}</p>
                    <p>Кол-во мест: {room.quantity_places}</p>
                </div>
            </div>
            <PickMeButton className={"reservation-btn"} onClick={() => {
                selectedRoom(room);
                reservationFunc()
            }}>
                Бронировать
            </PickMeButton>
        </div>
    )
}
