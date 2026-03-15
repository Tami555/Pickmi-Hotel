import React from "react";
import '../styles/room_type_block.css';
import { useNavigate } from "react-router-dom";
import { formatImageUrl } from '../../../utils/formats/image';


export const RoomTypeBlock = ({room, index}) => {
    const nav = useNavigate()
    return (
        <div className={`room-block ${index % 2 === 1 ? 'reverse' : ''}`}>
            <img src={formatImageUrl(room.image)} />
            <div
                className={`infa-block ${index % 2 === 1 ? 'triangle-right' : 'triangle-left'}`}>
                <h2 className="title">{room.title}</h2>
                <p className="description">{room.description}</p>
                <div className={`last-block ${index % 2 === 1 ? 'reverse' : ''}`}>
                    <div
                        className={`btn btn-choose ${index % 2 === 1 ? 'btn-right' : 'btn-left'}`}
                    >
                        Выбрать
                    </div>
                    <div
                        className={`btn btn-detaile ${index % 2 === 1 ? 'btn-right' : 'btn-left'}`}
                        onClick={() => nav(`/rooms/${room.slug}`)}
                    >
                        Подробнее
                    </div>
                    <p className="price">{room.price_per_day} руб</p>
                </div>
            </div>
        </div>
    )
}