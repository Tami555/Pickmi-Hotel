import React from "react";
import '../styles/room_type_block.css';
import { useNavigate } from "react-router-dom";
import { formatImageUrl } from '../../../utils/formats/image';


export const RoomTypeBlock = ({room, index, available_count, rooms_filters}) => {
    const nav = useNavigate()
    const selectRoomType = () => {
        const url = `/rooms/${room.slug}/reservation`
        const queries = `?check_in=${rooms_filters.check_in}&check_out=${rooms_filters.check_out}&number_people=${rooms_filters.number_people}`
        nav(url + queries)
    }
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
                        onClick={selectRoomType}
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
            {
                available_count != null &&
                <div className={`available-room-block ${index % 2 === 1 ? 'left-available' : 'right-available'}`}>
                    Свобных номеров: {available_count}
                </div>
            }
        </div>
    )
}