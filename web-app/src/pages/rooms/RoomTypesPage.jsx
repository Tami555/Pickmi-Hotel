import React, { useEffect, useState } from "react";
import { CommonBlock } from '../../components/layouts/CommonBlock';
import { RoomTypesList } from "./components/RoomTypesList";
import { available_rooms_count, room_types_list } from "../../api/services";
import { useFetch } from "../../hooks/useFetch";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { FilterAvailableRoomBlock } from "./components/FilterAvailableRoomBlock";


export const RoomTypesPage = () => {
  const [roomTypesList, setRoomTypesList] = useState([])
  const [get_room_types, loading, errorServer] = useFetch(
    async () => {
      const res = await room_types_list()
      setRoomTypesList(res)
    }
  )
  useEffect(() => {get_room_types()}, [])

  // Фильтры для получения количества свободных номеров
  const [filterData, setFilterData] = useState({check_in: '', check_out: '', number_people: 1})
  const [availableRoomsCount, setAvailableRoomsCount] = useState([])

  return (
      <CommonBlock>
        <h1 className="room-types-title">Номера</h1>

        <FilterAvailableRoomBlock
          filterData={filterData}
          setFilterData={setFilterData}
          setFilterResponse={setAvailableRoomsCount}
          applyFiltersFunc={available_rooms_count}
        />

        <ContentApiBlock loading={loading} error={errorServer}>
          <RoomTypesList
            room_types_list={roomTypesList}
            available_count={availableRoomsCount}
            rooms_filters={filterData}
          />
        </ContentApiBlock>
      </CommonBlock>
  );
}