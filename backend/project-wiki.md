# API Documentation - Pickmi Hotel Management System 🔧🏩
***
#### Базовый URL: http://localhost:8000/api/v1
#### Авторизация: Bearer Token (JWT)
***
### 📚 Содержание
1. API для сайта (Гости)
2. API для мобильного приложения (Сотрудники)
3. API для десктоп-приложения (Администраторы)
4. Общие эндпоинты

##  1. API для сайта (Гости)
Эндпоинты для использования на сайте
### Аутентификация/Авторизация
- ####  Регистрация пользователя (гостя):
> **POST: /auth/registration/guest/**

**Тело запроса:**
```json
{
  "email": "ivan@gmail.com",
  "password": "12345678",
  "first_name": "Иван",
  "last_name": "Иванов",
  "patronymic": "Иванович",
  "phone": "+79178667112",
  "passport_series": "1235",
  "passport_number": "123455"
}
```
**Ответ (200 OK):**
```json
{
  "id": 30,
  "email": "ivan@gmail.com",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```
<br>

### Профиль гостя
- ####  Просмотр профиля:
> **GET: /users/guests/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 30,
  "email": "ivan@gmail.com",
  "first_name": "Иван",
  "last_name": "Иванов",
  "patronymic": "Иванович",
  "phone": "tel:+7-917-866-71-12",
  "passport_series": "1235",
  "passport_number": "123455"
}
```
<br>

- ####  Редактирование профиля:
> **PATCH: /users/guests/profile/edit**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Тело запроса: (можно указывать не все поля)**
```json
{
  "first_name": "Иванушка",
  "last_name": "Ивонович",
  "patronymic": "Иванов",
  "phone": "+79178667114"
}
```
**Ответ (200 OK):**
```json
{
  "id": 30,
  "email": "ivan@gmail.com",
  "first_name": "Иванушка",
  "last_name": "Ивонович"
}
```
<br>

### Номера
- ####  Получить все типы номеров:
> **GET: /rooms-types**

**Ответ (200 OK):**
```json
[
  {
    "slug": "lyuks",
    "title": "Люкс",
    "description": "Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно",
    "image": "1234",
    "price_per_day": 6000
  },
  ...
]
```
<br>

- ####  Получить конкретный тип номера:
> **GET: /rooms-types/{slug}**

**Ответ (200 OK):**
```json
{
  "slug": "lyuks",
  "title": "Люкс",
  "description": "Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно",
  "image": "1234",
  "price_per_day": 6000,
  "amenities": [
    {
      "title": "Wi-Fi",
      "image": null,
      "is_main": true
    },
    {
      "title": "Искуственные цветы для ванны",
      "image": "1234",
      "is_main": false
    }
  ]
}
```
<br>

- #### Получить количество свободных номеров, всех типов, по критериям (кол.мест, даты въезда\выезда):
> **GET: /room-types/rooms/available/count?quantity_places={quantity_places}&check_in={check_in}&check_out={check_out}**

>**Параметры запроса:<br>
  quantity_places - количество мест в номере<br>
  check_in - дата заезда<br>
  check_out - дата выезда**

**Ответ (200 OK):**
```json
[
  {
    "slug": "prezidentskiy",
    "title": "Президентский ",
    "price_per_day": 12000,
    "available_rooms": 2
  },
  ...
]
```
<br>


- #### Получить свободные номера, конкретного типа, по критериям (кол.мест, даты въезда\выезда):
> **GET: rooms/available/by-type/{room_type_slug}?quantity_places={quantity_places}&check_in={check_in}&check_out={check_out}**

>**Параметры запроса:<br>
  quantity_places - количество мест в номере<br>
  check_in - дата заезда<br>
  check_out - дата выезда**

**Ответ (200 OK):**
```json
[
  {
    "room_number": "501",
    "floor": 5,
    "quantity_places": 3
  },
  ...
]
```
<br>


### Бронировние 
- ####  Создание брони:
> **POST: /reservations**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Тело запроса:**
```json
{
  "room_number": "301",
  "check_in_date": "2026-05-02 09:00",
  "check_out_date": "2026-05-03 09:00"
}
```
**Ответ (200 OK):**
```json
{
  "id": 1,
  "check_in_date": "2026-05-02T09:00:00",
  "check_out_date": "2026-05-03T09:00:00",
  "total_price": 1500,
  "status": "pending",
  "created_at": "2026-03-04T14:31:31.925002",
  "room": {
    "room_number": "301",
    "floor": 3,
    "quantity_places": 2,
    "room_type": {
      "slug": "ekonom",
      "title": "Эконом",
      "price_per_day": 1500
    }
  }
}
```
<br>

- ####  Отмена брони:
> **PATCH: /reservations/{reservation_id}/cancel**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "check_in_date": "2026-05-02T09:00:00",
  "check_out_date": "2026-05-03T09:00:00",
  "status": "canceled",
  "room": {
    "room_number": "301",
    "floor": 3,
    "quantity_places": 2
  }
}
```
<br>

- ####  Получить список броней:
> **GET: /users/guests/profile/reservations**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
[
  {
    "id": 21,
    "check_in_date": "2026-03-03T19:30:00",
    "check_out_date": "2026-03-10T12:00:00",
    "total_price": 8900,
    "status": "active",
    "created_at": "2026-03-01T14:56:36.368893",
    "room": {
      "room_number": "201",
      "floor": 2,
      "quantity_places": 1,
      "room_type": {
        "slug": "bunker",
        "title": "Бункер",
        "price_per_day": 1100
      }
    }
  },
  ...
]
```
<br>


### Услуги
- ####  Получить список категорий услуг:
> **GET: /services-categories/**

**Ответ (200 OK):**
```json
[
  {
    "slug": "uborka-i-klining",
    "title": "Уборка и клининг"
  },
  {
    "slug": "tehnicheskoe-obsluzhivanie",
    "title": "Техническое обслуживание"
  }
]
```
<br>

- ####  Получить список услуг определенной категории:
> **GET: /services-categories/{category_slug}/services**

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "slug": "ezhednevnaya-uborka-nomera",
    "title": "Ежедневная уборка номера",
    "price": 0,
    "description": "Стандартная уборка номера: заправка кровати, вынос мусора, замена полотенец",
    "image": null
  },
  ...
]
```
<br>

- ####  Получить информацию об услуге:
> **GET: /services/{service_slug}**

**Ответ (200 OK):**
```json
{
  "id": 1,
  "slug": "ezhednevnaya-uborka-nomera",
  "title": "Ежедневная уборка номера",
  "price": 0,
  "description": "Стандартная уборка номера: заправка кровати, вынос мусора, замена полотенец",
  "image": null
}
```
<br>


- ####  Заказ услуги:
> **POST: /tasks/**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Тело запроса:**
```json
{
  "service_id": 3,
  "reservation_id": 21,
  "scheduled_time": "2026-03-06 18:00",
  "comment": "заберите пожалуйста клопов"
}
```
**Ответ (200 OK):**
```json
{
  "id": 15,
  "scheduled_time": "2026-03-06T18:00:00",
  "comment": "заберите пожалуйста клопов",
  "service": {
    "id": 3,
    "slug": "dopolnitelnaya-smena-belya",
    "title": "Дополнительная смена белья",
    "price": 500
  },
  "status": "pending"
}
```
<br>

- #### Отменить заказанную услугу:
> **PATCH: /tasks/{task_id}/canceled**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 13,
  "scheduled_time": "2026-03-09T23:00:00",
  "comment": "я буду бухать и шуметь. Извините за ранее",
  "service": {
    "id": 12,
    "slug": "mini-bar-obsluzhivanie",
    "title": "Мини-бар обслуживание",
    "price": 500
  },
  "status": "canceled"
}
```
<br>


- ####  Получить список заказанных услуг:
> **GET: /users/guests/profile/tasks**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
[
  {
    "id": 13,
    "scheduled_time": "2026-03-09T23:00:00",
    "comment": "я буду бухать и шуметь. Извините заранее",
    "service": {
      "id": 12,
      "slug": "mini-bar-obsluzhivanie",
      "title": "Мини-бар обслуживание",
      "price": 500
    },
    "status": "pending"
  },
  ...
]
```
<br>


##  2. API для мобильного приложения (Сотрудники)
### Профиль сотрудника
- ####  Просмотр профиля:
> **GET: /users/employee/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "user": {
    "id": 8,
    "email": "valerkadobrov@mail.ru",
    "first_name": "Валерка",
    "last_name": "Добровка",
    "patronymic": "Антонович",
    "phone": "tel:+7-917-688-54-43",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "position": {
    "id": 3,
    "title": "Менеджер"
  },
  "salary": 1000,
  "advance": 50,
  "hire_date": "2026-02-23",
  "bank_account": "13141516121314243546",
  "status": "active",
  "fired_date": null,
  "weekends": [
    1,
    2,
    3
  ]
}
```
<br>

### Задачи сотрудника
- ####  Просмотр задач:
> **GET: /users/employee/profile/tasks**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
[
  {
    "id": 8,
    "scheduled_time": "2026-03-06T09:00:00",
    "comment": "есть принесите пжпжпж",
    "service": {
      "id": 10,
      "slug": "zavtrak-v-nomer",
      "title": "Завтрак в номер",
      "price": 1200
    },
    "status": "completed"
  },
  ...
]
```
<br>

- #### Начать выполнение задачи:
> **PATCH: /tasks/{task_id}/started**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 13,
  "scheduled_time": "2026-03-09T23:00:00",
  "comment": "я буду бухать и шуметь. Извините за ранее",
  "service": {
    "id": 12,
    "slug": "mini-bar-obsluzhivanie",
    "title": "Мини-бар обслуживание",
    "price": 500
  },
  "status": "in_progress"
}
```
<br>

- #### Завершить выполнение задачи:
> **PATCH: /tasks/{task_id}/completed**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 13,
  "scheduled_time": "2026-03-09T23:00:00",
  "comment": "я буду бухать и шуметь. Извините за ранее",
  "service": {
    "id": 12,
    "slug": "mini-bar-obsluzhivanie",
    "title": "Мини-бар обслуживание",
    "price": 500
  },
  "status": "completed"
}
```
<br>

##  3. API для десктоп-приложения (Администраторы)
### Профиль админа
- ####  Просмотр профиля:
> **GET: /users/admin/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "tamiron@gmail.com",
  "first_name": "Тамирон",
  "last_name": "Пост",
  "patronymic": null,
  "phone": "+79196966725",
  "passport_series": "1111",
  "passport_number": "111111"
}
```
<br>

- ####  Редактирование профиля:
> **PATCH: /users/admin/profile/edit**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Тело запроса: (можно указывать не все поля)**
```json
{
  "first_name": "Тами",
  "last_name": "Пост",
  "patronymic": null,
  "phone": "+79178990991",
  "email": "tamipost@gmail.com",
  "passport_series": "3333",
  "passport_number": "333333"
}
```
**Ответ (200 OK):**
```json
{
  "id": 1,
  "email": "tamipost@gmail.com",
  "first_name": "Тами",
  "last_name": "Пост"
}
```
<br>


### Работа с сотрудниками
- ####  Регистрирование (создание) сотрудника:
> **POST: /auth/registration/employee/**

**Тело запроса:**
```json
{
  "user": {
    "email": "valerka@mail.ru",
    "password": "12345678",
    "first_name": "Валерий",
    "last_name": "Добров",
    "patronymic": "Антонович",
    "phone": "+79176885443",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "employee": {
    "position_id": 2,
    "salary": 1000,
    "advance": 300,
    "bank_account": "13141516121314243546",
    "weekends": [
      2,
      6
    ]
  }
}
```
**Ответ (200 OK):**
```json
{
  "id": 16,
  "user": {
    "id": 8,
    "email": "valerka@mail.ru",
    "first_name": "Валерий",
    "last_name": "Добров"
  },
  "position": {
    "id": 2,
    "title": "Сантехник"
  },
  "salary": 1000,
  "status": "active"
}
```
<br>

- ####  Просмотр списка сотрудников:
> **GET: users/employees/**

**Ответ (200 OK):**
```json
[
  {
    "id": 16,
    "user": {
      "id": 8,
      "email": "valerka@mail.ru",
      "first_name": "Валерий",
      "last_name": "Добров"
    },
    "position": {
      "id": 2,
      "title": "Сантехник"
    },
    "salary": 1000,
    "status": "active"
  },
  ...
]
```
<br>

- ####  Просмотр сотрудника по Id:
> **GET: users/employees/{employee_id}**

**Ответ (200 OK):**
```json
{
  "user": {
    "id": 8,
    "email": "valerka@mail.ru",
    "first_name": "Валерий",
    "last_name": "Добров",
    "patronymic": "Антонович",
    "phone": "tel:+7-917-688-54-43",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "position": {
    "id": 2,
    "title": "Сантехник"
  },
  "salary": 1000,
  "advance": 300,
  "hire_date": "2026-02-23",
  "bank_account": "13141516121314243546",
  "status": "active",
  "fired_date": null,
  "weekends": [
    2,
    6
  ]
}
```
<br>

- ####  Редактирование cотрудника по Id:
> **PATCH: /users/employees/edit/{employee_id}**

**Заголовок запроса: (токен нужен для подтверждения что действие делает админ)**
``` Authorization: Bearer <access token> ```

**Тело запроса: (можно указывать не все поля)**
```json
{
  "user_data": {
    "first_name": "Валерка",
    "last_name": "Добровка",
    "patronymic": "Антонович",
    "phone": "+79176885443",
    "email": "valerkadobrov@mail.ru",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "employee_data": {
    "position_id": 3,
    "salary": 1000,
    "advance": 50,
    "status": "active",
    "bank_account": "13141516121314243546",
    "weekends": [
      1, 2, 3
    ]
  }
}
```
**Ответ (200 OK):**
```json
{
  "id": 16,
  "user": {
    "id": 8,
    "email": "valerkadobrov@mail.ru",
    "first_name": "Валерка",
    "last_name": "Добровка"
  },
  "position": {
    "id": 3,
    "title": "Менеджер"
  },
  "salary": 1000,
  "status": "active"
}
```
#### Если статус установить как "fired" (уволен), то сотрудник удаляется из системы автоматически, спустя некоторе время (по умолчанию это 2 дня)
<br>

- ####  Просмотр задач сотрудника:
> **GET: /users/employee/{employee_id}/tasks**

**Ответ (200 OK):**
```json
[
  {
    "id": 8,
    "scheduled_time": "2026-03-06T09:00:00",
    "comment": "есть принесите пжпжпж",
    "service": {
      "id": 10,
      "slug": "zavtrak-v-nomer",
      "title": "Завтрак в номер",
      "price": 1200
    },
    "status": "completed"
  },
  ...
]
```
<br>


### Работа с гостями
- ####  Просмотр списка гостей:
> **GET: /users/guests/**

**Ответ (200 OK):**
```json
[
  {
    "id": 30,
    "email": "ivan@gmail.com",
    "first_name": "Иванушка",
    "last_name": "Ивонович",
    "is_currently_staying": true
  },
  ...
]
```
<br>

- ####  Просмотр гостя по Id:
> **GET: /users/guests/{guest_id}**

**Ответ (200 OK):**
```json
{
  "id": 30,
  "email": "ivan@gmail.com",
  "first_name": "Иванушка",
  "last_name": "Ивонович",
  "patronymic": "Иванов",
  "phone": "tel:+7-917-866-71-14",
  "passport_series": "1235",
  "passport_number": "123455"
}
```
<br>

- ####  Редактирование гостя по Id:
> **PATCH: /users/guests/edit/{guest_id}**

**Заголовок запроса: (токен нужен для подтверждения что действие делает админ)**
``` Authorization: Bearer <access token> ```

**Тело запроса: (можно указывать не все поля)**
```json
{
  "first_name": "Иван",
  "last_name": "Иванов",
  "patronymic": "",
  "phone": "+79178667114",
  "email": "ivankrytov@mail.ru",
  "passport_series": "1235",
  "passport_number": "123455"
}
```
**Ответ (200 OK):**
```json
{
  "id": 30,
  "email": "ivankrytov@mail.ru",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```
<br>

- ####  Получить список броней пользователя:
> **GET: /users/guests/{guest_id}/reservations**


**Ответ (200 OK):**
```json
[
  {
    "id": 21,
    "check_in_date": "2026-03-03T19:30:00",
    "check_out_date": "2026-03-10T12:00:00",
    "total_price": 8900,
    "status": "active",
    "created_at": "2026-03-01T14:56:36.368893",
    "room": {
      "room_number": "201",
      "floor": 2,
      "quantity_places": 1,
      "room_type": {
        "slug": "bunker",
        "title": "Бункер",
        "price_per_day": 1100
      }
    }
  },
  ...
]
```
<br>

- ####  Получить список заказанных услуг гостя:
> **GET: /users/guests/{guest_id}/tasks**


**Ответ (200 OK):**
```json
[
  {
    "id": 13,
    "scheduled_time": "2026-03-09T23:00:00",
    "comment": "я буду бухать и шуметь. Извините заранее",
    "service": {
      "id": 12,
      "slug": "mini-bar-obsluzhivanie",
      "title": "Мини-бар обслуживание",
      "price": 500
    },
    "status": "pending"
  },
  ...
]
```
<br>


### Номера
- ####  Получить все типы номеров:
> **GET: /rooms-types**

**Ответ (200 OK):**
```json
[
  {
    "slug": "lyuks",
    "title": "Люкс",
    "description": "Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно",
    "image": "1234",
    "price_per_day": 6000
  },
  ...
]
```
<br>


- ####  Получить все номера, конкретного типа, а также общий процент загруженности на данный момент:
> **GET: /rooms/occupancy/by-type/{room_type_slug}**

**Ответ (200 OK):**
```json
{
  "percentage_occupied": 25,
  "total_rooms": 4,
  "occupied_rooms": 1,
  "rooms": [
    {
      "room_number": "501",
      "floor": 5,
      "quantity_places": 1,
      "is_occupied": false,
      "current_guest": null,
      "days_occupied": null
    },
    {
      "room_number": "503",
      "floor": 5,
      "quantity_places": 5,
      "is_occupied": true,
      "current_guest": {
        "id": 30,
        "email": "anton@gmail.com",
        "first_name": "Антон",
        "last_name": "Зайчиков"
      },
      "days_occupied": 6
    },
    ...
  ]
}
```
<br>

### Должности сотрудников
- ####  Получиние всех должностей:
> **GET: /positions**

**Ответ (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Горничная"
  },
  {
    "id": 2,
    "title": "Сантехник"
  },
  ...
]
```
<br>

- ####  Получиние должности по Id:
> **GET: /positions/{position_id}**

**Ответ (200 OK):**
```json
{
  "title": "Горничная",
  "description": "Любительница идеального порядка и ароматов свежего белья — спокойная, внимательная к деталям и всегда готова удивить чистотой.",
  "id": 1,
  "services": [
    {
      "id": 1,
      "slug": "ezhednevnaya-uborka-nomera",
      "title": "Ежедневная уборка номера",
      "price": 0
    },
    {
      "id": 2,
      "slug": "dopolnitelnaya-smena-belya",
      "title": "Дополнительная смена белья",
      "price": 500
    }
  ]
}
```
<br>

### Услуги 
- ####  Заказ (создание) услуги:
> **POST: /tasks/**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Тело запроса:**
```json
{
  "service_id": 3,
  "reservation_id": 21,
  "scheduled_time": "2026-03-06 18:00",
  "comment": "заберите пожалуйста клопов"
}
```
**Ответ (200 OK):**
```json
{
  "id": 15,
  "scheduled_time": "2026-03-06T18:00:00",
  "comment": "заберите пожалуйста клопов",
  "service": {
    "id": 3,
    "slug": "dopolnitelnaya-smena-belya",
    "title": "Дополнительная смена белья",
    "price": 500
  },
  "status": "pending"
}
```
<br>

- #### Отменить заказанную услугу гостя:
> **PATCH: /tasks/{task_id}/canceled**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 13,
  "scheduled_time": "2026-03-09T23:00:00",
  "comment": "я буду бухать и шуметь. Извините за ранее",
  "service": {
    "id": 12,
    "slug": "mini-bar-obsluzhivanie",
    "title": "Мини-бар обслуживание",
    "price": 500
  },
  "status": "canceled"
}
```
<br>


### Бронировние 
- ####  Отмена брони:
> **PATCH: /reservations/{reservation_id}/cancel**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "id": 1,
  "check_in_date": "2026-05-02T09:00:00",
  "check_out_date": "2026-05-03T09:00:00",
  "status": "canceled",
  "room": {
    "room_number": "301",
    "floor": 3,
    "quantity_places": 2
  }
}
```
<br>

### Отчеты
>**Возможные параметры запросов:<br>
  start_date - начальная дата (от какого-то числа)<br>
  end_date - Конечная дата (до какого-то числа)<br>
  <br>по умолчанию берется весь промежуток работы отеля**
<br>

- ####  Генерация отчета по номерам и броням:
> **GET: /reports/rooms**

- ####  Генерация отчета по сотрудникам:
> **GET: /reports/employees**

- ####  Генерация отчета по услугам:
> **GET: /reports/services**

<br>

##  4. Общие эндпоинты
### Авторизация
- ####  Вход пользователей
> **POST: /auth/login/**

**Тело запроса:**
```json
{
  "email": "ivan@gmail.com",
  "password": "12345678"
}
```
**Ответ (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJI.....",
  "refresh_token": "eyJhbGciOiJ....",
  "token_type": "Bearer"
}
```
<br>

- ####  Обновление JWT-токена
> **POST: /auth/refresh/**

**Тело запроса:**
```json
{
  "token": "your_refresh_token"
}
```

**Ответ (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJI.....",
  "token_type": "Bearer"
}
```
<br>

- ####  Проверка действия JWT-токена
> **POST: /auth/verify/**

**Тело запроса:**
```json
{
  "token": "your_access_token"
}
```

**Ответ (200 OK):**
```json
{
  "is_verify_token": true
}
```
<br>