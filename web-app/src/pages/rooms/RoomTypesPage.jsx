import React, { useEffect, useState } from "react";
import { CommonBlock } from '../../components/layouts/CommonBlock';
import { RoomTypesList } from "./components/RoomTypesList";
import { available_rooms_count, room_types_list } from "../../api/services";
import { useFetch } from "../../hooks/useFetch";
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock";
import { FilterAvailableRoomBlock } from "./components/FilterAvailableRoomBlock";
import { useValidation } from "../../hooks/useValidation";
import { roomAvailableFiltersSchema } from "../../utils/validators/schemas";
import { Loader } from "../../components/UI/feedback/Loader";


export const RoomTypesPage = () => {
  const [roomTypesList, setRoomTypesList] = useState([])
  const [get_room_types, loading, errorServer] = useFetch(
    async () => {
      const res = await room_types_list()
      setRoomTypesList(res)
    }
  )
  useEffect(() => {get_room_types()}, [])


  // ФИЛЬТРЫ свободных номеров
  const noFilters = {check_in: '', check_out: '', number_people: 1}
  const [filterData, setFilterData] = useState(noFilters)
  const [availableRoomsCount, setAvailableRoomsCount] = useState([])

  const [available_rooms_func, loadingFilter, serverFilterError] = useFetch(
    async () => {
      const res = await available_rooms_count(
        filterData.number_people,
        filterData.check_in,
        filterData.check_out
      )
      setAvailableRoomsCount(res);
    }
  );
  // Локальные ошибки валидации   
  const { error: localFilterError, validate } = useValidation();
  const handleRoomFilters = () => {
      if (!validate(filterData, roomAvailableFiltersSchema)) return;
      available_rooms_func();
  };

  const resetFilters = () => {
    // сброс фильтров
    setFilterData(noFilters);
    setAvailableRoomsCount([]);
  }

  return (
      <CommonBlock>
        <h1 className="room-types-title">Номера</h1>
        <FilterAvailableRoomBlock
          filterData={filterData}
          setFilterData={setFilterData}
          resetFilters={resetFilters}
          applyFilters={handleRoomFilters}
        />

        {/* загрузка/ошибки фильтрации */}
        {localFilterError && <p className="errors">{localFilterError}</p>}
        {serverFilterError && <p className="errors">{serverFilterError}</p>}
        {loadingFilter && <Loader/>}

        <ContentApiBlock loading={loading} error={errorServer}>
          <RoomTypesList room_types_list={roomTypesList} available_count={availableRoomsCount}/>
        </ContentApiBlock>
      </CommonBlock>
  );
}