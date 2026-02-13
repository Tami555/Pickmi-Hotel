import React, { useEffect, useState } from "react";
import { CommonBlock } from '../../components/layouts/CommonBlock';
import { RoomTypesList } from "./components/RoomTypesList";
import { room_types_list } from "../../api/services";


export const RoomTypesPage = () => {
  const [roomTypesList, setRoomTypesList] = useState([])
  const get_room_types = async () => {
    const res = await room_types_list()
    setRoomTypesList(res)
  }
  useEffect(() => {get_room_types()}, [])

  return (
      <CommonBlock>
          <RoomTypesList room_types_list={roomTypesList}/>
      </CommonBlock>
  );
}