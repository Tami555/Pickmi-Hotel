import React, { useEffect, useState } from "react";
import { CommonBlock } from '../../components/layouts/CommonBlock';
import { RoomTypesList } from "./components/RoomTypesList";
import { room_types_list } from "../../api/services";
import { useFetch } from "../../hooks/useFetch";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";


export const RoomTypesPage = () => {
  const [roomTypesList, setRoomTypesList] = useState([])
  const [get_room_types, loading, errorServer] = useFetch(
    async () => {
      const res = await room_types_list()
      setRoomTypesList(res)
    }
  )
  useEffect(() => {get_room_types()}, [])

  return (
      <CommonBlock>
        <h1 className="room-types-title">Номера</h1>
        <ContentApiBlock loading={loading} error={errorServer}>
          <RoomTypesList room_types_list={roomTypesList}/>
        </ContentApiBlock>
      </CommonBlock>
  );
}