import { MainPage } from '../pages/main/MainPage';
import { RoomTypesPage } from '../pages/rooms/RoomTypesPage';


// Общие пути
export const  common_routes = [
    {path: '/', element: MainPage},
    {path: '/main', element: MainPage},
    {path: '/rooms', element: RoomTypesPage}
]
// для не авторизованных
export const no_authorized_routes = []
// для авторизованных
export const authorized_routes = []