import React from "react";
import { CommonBlock } from '../../components/layouts/CommonBlock';
import { RoomTypesList } from "./components/RoomTypesList";


export const RoomTypesPage = () => {
    // пока тестовые данные, потом настроем бэкенд
    const data_rooms = [
  {
    "slug": "ekonom",
    "title": "Эконом",
    "description": "Для тех, кто считает каждую копейку. Кровати розовые, но старые, возможно есть клопы. Wi-Fi только в коридоре, вид на соседнюю стену. Завтрак - чайник в номере.",
    "image": "https://lh3.googleusercontent.com/d/1pWokUIsbVFaZrDztrQN6i40Cxm6bBsXW=w300?authuser=0",
    "price_per_day": 1500
  },
  {
    "slug": "standart",
    "title": "Стандарт",
    "description": "Номер для нормальных людей. Кровать не скрипит (всегда), есть окно (иногда открывается). Чуть лучше, чем эконом.",
    "image": "https://lh3.googleusercontent.com/d/1pWokUIsbVFaZrDztrQN6i40Cxm6bBsXW=w300?authuser=0",
    "price_per_day": 3000
  }
]
    return (
        <CommonBlock>
            <RoomTypesList room_types_list={data_rooms}/>
        </CommonBlock>
    );
}