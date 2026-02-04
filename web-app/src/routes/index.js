import { MainPage } from '../pages/main/MainPage';

// Общие пути
export const  common_routes = [
    {path: '/', element: MainPage},
    {path: '/main', element: MainPage}
]
// для не авторизованных
export const no_authorized_routes = []
// для авторизованных
export const authorized_routes = []