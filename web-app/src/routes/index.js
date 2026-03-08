import { LoginPage } from '../pages/auth/LoginPage';
import { MainPage } from '../pages/main/MainPage';
import { OneRoomTypePage } from '../pages/rooms/OneRoomTypePage';
import { RoomTypesPage } from '../pages/rooms/RoomTypesPage';


// Общие пути
export const  common_routes = [
    {path: '/', element: MainPage},
    {path: '/main', element: MainPage},
    {path: '/rooms', element: RoomTypesPage},
    {path: '/rooms/:slug', element: OneRoomTypePage},

    // для тестов
    {path: '/users/login', element: LoginPage},
]
// для не авторизованных
export const no_authorized_routes = [
    {path: '*', element: LoginPage},
    {path: '/users/login', element: LoginPage},
]

// для авторизованных
export const authorized_routes = []