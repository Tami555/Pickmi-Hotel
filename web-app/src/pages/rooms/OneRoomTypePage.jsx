import React, { useEffect, useState } from "react";
import { CommonBlock } from "../../components/layouts/CommonBlock";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { room_type_by_slug } from "../../api/services/RoomService/room_types";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";


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

    return (
        <CommonBlock>
            <ContentApiBlock loading={loading} error={errorServer}>
                <h1>{roomType.title}</h1>
                <p>{roomType.description}</p>
            </ContentApiBlock>
        </CommonBlock>
    )
}