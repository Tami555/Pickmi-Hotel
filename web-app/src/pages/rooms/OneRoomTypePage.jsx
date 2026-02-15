import React, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { room_type_by_slug } from "../../api/services/RoomService/room_types";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import "./styles/one_room_type_page.css";
import { Wifi } from 'lucide-react';
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";


export const OneRoomTypePage = () => {
    const params = useParams()
    const [roomType, setRoomType] = useState({})
    const [get_one_room_type, loading, errorServer] = useFetch(
        async () => {
            const res = await room_type_by_slug(params.slug)
            setRoomType(res)
        }
    )
    useEffect(() => {get_one_room_type()}, [])


    const main_amenities  = []
    const other_amenities  = []
    roomType?.amenities?.forEach((amenity) => { 
        if (amenity.is_main){
            main_amenities.push(amenity)
        }
        else{
            other_amenities.push(amenity)
        }
    });

    return (
        <CommonBlock>
            <ContentApiBlock loading={loading} error={errorServer}>
                <div className="one-room-type-block">
                    <h1 className="title">Номер {roomType.title}</h1>
                    <div className="main-infa-block">

                        <img src={`https://drive.google.com/thumbnail?id=${roomType.image}&sz=w300`}/>

                        <div className="amenities-main-block">
                            {main_amenities?.map((amenity) => (
                                <div className="amenity-block">
                                    <Wifi size={35} color={"var(--purple-deep)"}/>
                                    <p>{amenity.title}</p>
                                </div>
                            ))}
                        </div>

                        <div className="price-block">
                            <h2>{roomType.price_per_day} руб</h2>
                            <PickMeButton className={'change-btn'}>Выбрать</PickMeButton>
                        </div>

                        <div className="description-block">
                            <h2>Описание</h2>
                            <p>{roomType.description}</p>
                        </div>
                    </div>
                    <div className="amenities-other-block">
                        <h2>Доступные вещи:</h2>
                        {other_amenities.length ? 
                            other_amenities.map((amenity) => (
                                <p>~ {amenity.title}</p>
                            ))
                            :
                            <p>------</p>
                        }
                    </div>
                </div>
            </ContentApiBlock>
        </CommonBlock>
    )
}