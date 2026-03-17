import React from "react";
import { RoomTypeBlock } from "./RoomTypeBlock";
import '../styles/room_types_list.css';


export const RoomTypesList = ({room_types_list, available_count}) => {
    return (
        <>
            <div className="room-types-blocks">
                {room_types_list.map((room, index) => (
                    <RoomTypeBlock
                        room={room}
                        index={index}
                        key={room.slug}
                        available_count={
                            available_count.length > 0 ?
                             available_count[index].available_rooms : null
                        }
                    />
                ))}
            </div>
        </>
    )
}