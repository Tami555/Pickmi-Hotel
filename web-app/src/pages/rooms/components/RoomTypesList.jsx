import React from "react";
import { RoomTypeBlock } from "./RoomTypeBlock";
import '../styles/room_types_list.css';


export const RoomTypesList = ({room_types_list}) => {
    return (
        <>
            {/* <h1 className="room-types-title">Номера</h1> */}
            <div className="room-types-blocks">
                {room_types_list.map((room, index) => (
                    <RoomTypeBlock
                        room={room}
                        index={index}
                        key={room.slug}
                    />
                ))}
            </div>
        </>
    )
}