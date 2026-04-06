// Единая точка входа для всех сервисов

// Rooms
export { room_types_list, room_type_by_slug } from "./RoomService/room_types";
export { available_rooms_count, available_rooms_by_type } from "./RoomService/available_rooms";

// Users
export { login, registration, logout } from "./UserService/auth";
export { read_profile, edit_profile } from "./UserService/profile";

// Services
export { current_user_services } from "./ServicesService/to_user";
export {cancel_service, services_categories, services_by_category} from "./ServicesService/services";

// Reservations
export { current_user_reservations } from "./ReservationsService/to_user";
export { create_reservations, cancel_reservations } from "./ReservationsService/reservation";