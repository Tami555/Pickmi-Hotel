// Единая точка входа для всех сервисов

// Rooms
export { room_types_list } from "./RoomService/room_types";

// Users
export { login, registration, logout } from "./UserService/auth";
export { read_profile, edit_profile } from "./UserService/profile";

// Services
export { current_user_services } from "./ServicesService/to_user";

// Reservations
export { current_user_reservations } from "./ReservationsService/to_user";

export { 
  getEmployeeProfile, 
  updateEmployeeProfile,
  type EmployeeProfileResponse,
  type UserProfile,
  type Position,
  type UpdateEmployeeProfilePayload,
} from './UserService/employee_profile';

export { 
  getEmployeeTasks,
  calculateTaskProgress,
  getTaskCardColor,
  formatTaskTitle,
  formatTaskTime,
  type EmployeeTask,
  type Service,
  type Reservation,
  type Room,
  startTask,
  completeTask,
  type TaskStatusResponse,
} from './ServicesService/employee_tasks';
