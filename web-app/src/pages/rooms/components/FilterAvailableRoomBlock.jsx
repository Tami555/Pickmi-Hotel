import React, { useState } from "react";
import "../styles/filter_available_room_block.css"
import { InputBlock } from "../../../components/UI/inputs/InputBlock";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";
import { useFetch } from "../../../hooks/useFetch";
import { roomAvailableFiltersSchema } from "../../../utils/validators/schemas";
import { useValidation } from "../../../hooks/useValidation";
import { Loader } from "../../../components/UI/feedback/Loader";


export const FilterAvailableRoomBlock = ({
    filterData,
    setFilterData,
    setFilterResponse,
    applyFiltersFunc,
    optionalApplyParams=[]
}) => {

    const [apply_filters, loadingFilter, serverFilterError] = useFetch(
        async () => {
          const res = await applyFiltersFunc(
            filterData.number_people,
            filterData.check_in,
            filterData.check_out,
            ...optionalApplyParams
          )
          setFilterResponse(res);
        }
      );
    // Локальные ошибки валидации   
    const { error: localFilterError, validate } = useValidation();
    const handleRoomFilters = () => {
        if (!validate(filterData, roomAvailableFiltersSchema)) return;
        apply_filters();
    };
    
    const resetFilters = () => {
        // сброс фильтров
        setFilterData({check_in: '', check_out: '', number_people: 1});
        setFilterResponse([]);
    }

    return  (
        <div className="filter-room-block">
            <div className="input-blocks">
                <InputBlock
                    label="Заезд"
                    name="check_in" 
                    type="datetime-local"
                    value={filterData.check_in}
                    className={'filter-input'}
                    onChange={e => setFilterData({...filterData, check_in: e.target.value})}
                />
                <InputBlock
                    label="Выезд"
                    name="check_out" 
                    type="datetime-local"
                    className={'filter-input'}
                    value={filterData.check_out}
                    onChange={e => setFilterData({...filterData, check_out: e.target.value})}
                />
                <InputBlock
                    label="Кол-во человек"
                    name="number_people" 
                    type="number"
                    min="1"
                    className={'filter-input'}
                    value={filterData.number_people}
                    onChange={e => setFilterData({...filterData, number_people: e.target.value})}
                />
            </div>

            {/* загрузка/ошибки фильтрации */}
            {localFilterError && <p className="errors">{localFilterError}</p>}
            {serverFilterError && <p className="errors">{serverFilterError}</p>}
            {loadingFilter && <Loader/>}

            <div className="btns-block">
                <PickMeButton className={'reset-btn'} onClick={handleRoomFilters}>
                    Применить
                </PickMeButton>
                <PickMeButton className={'reset-btn'} onClick={resetFilters}>
                    Сброс
                </PickMeButton>
            </div>
        </div>
    )
}