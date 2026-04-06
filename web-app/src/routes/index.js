import { LoginPage } from '../pages/auth/LoginPage'
import { ProfilePage } from '../pages/auth/ProfilePage'
import { RegistrationPage } from '../pages/auth/RegistrationPage'
import { MainPage } from '../pages/main/MainPage'
import { OneRoomTypePage } from '../pages/rooms/OneRoomTypePage'
import { RoomTypesPage } from '../pages/rooms/RoomTypesPage'
import { ReservationPage } from '../pages/reservation/ReservationPage'
import { ServicesCategoriesPage } from '../pages/services/ServicesCategoriesPage'


// Общие пути
export const  common_routes = [
    {path: '/', element: MainPage},
    {path: '/main', element: MainPage},
    {path: '/rooms', element: RoomTypesPage},
    {path: '/rooms/:slug', element: OneRoomTypePage},
    {path: '/rooms/:slug/reservation', element: ReservationPage},
    {path: '/services/categories', element: ServicesCategoriesPage},
]

// для не авторизованных
export const no_authorized_routes = [
    {path: '*', element: LoginPage},
    {path: '/users/login', element: LoginPage},
    {path: '/users/registration', element: RegistrationPage},
]

// для авторизованных
export const authorized_routes = [
    {path: '/users/profile', element: ProfilePage}
]