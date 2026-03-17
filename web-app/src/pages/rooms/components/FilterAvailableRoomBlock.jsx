import React, { useState } from "react";
import "../styles/filter_available_room_block.css"
import { InputBlock } from "../../../components/UI/inputs/InputBlock";
import { PickMeButton } from "../../../components/UI/buttons/PickMeButton";


export const FilterAvailableRoomBlock = ({filterData, setFilterData, resetFilters, applyFilters}) => {
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

            <div className="btns-block">
                <PickMeButton className={'reset-btn'} onClick={applyFilters}>
                    Применить
                </PickMeButton>
                <PickMeButton className={'reset-btn'} onClick={resetFilters}>
                    Сброс
                </PickMeButton>
            </div>
        </div>
    )
}