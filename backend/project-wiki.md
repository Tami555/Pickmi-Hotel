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
- #####  Регистрация пользователя (гостя):
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
  "email": "ivan@gmail.com",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```
<br>

### Профиль гостя
- #####  Просмотр профиля:
> **GET: /users/guests/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
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

- #####  Редактирование профиля:
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
  "email": "ivan@gmail.com",
  "first_name": "Иванушка",
  "last_name": "Ивонович"
}
```
<br>

### Номера
- #####  Получить все типы номеров:
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

- #####  Получить конкретный тип номера:
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


##  2. API для мобильного приложения (Сотрудники)
### Профиль сотрудника
- #####  Просмотр профиля:
> **GET: /users/employee/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
  "user": {
    "email": "valerkadobrov@mail.ru",
    "first_name": "Валерка",
    "last_name": "Добровка",
    "patronymic": "Антонович",
    "phone": "tel:+7-917-688-54-43",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "position": {
    "title": "Менеджер",
    "description": "Коммуникативный стратег с улыбкой, умеет успокоить гостя, расставить приоритеты и сделать так, чтобы всё работало как часы.",
    "id": 3
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

##  3. API для десктоп-приложения (Администраторы)
### Профиль админа
- #####  Просмотр профиля:
> **GET: /users/admin/profile**

**Заголовок запроса:**
``` Authorization: Bearer <access token> ```

**Ответ (200 OK):**
```json
{
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

- #####  Редактирование профиля:
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
  "email": "tamipost@gmail.com",
  "first_name": "Тами",
  "last_name": "Пост"
}
```
<br>


### Работа с сотрудниками
- #####  Регистрирование (создание) сотрудника:
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

- #####  Просмотр списка сотрудников:
> **GET: users/employees/**

**Ответ (200 OK):**
```json
[
  {
    "id": 16,
    "user": {
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

- #####  Просмотр сотрудника по Id:
> **GET: users/employees/{employee_id}**

**Ответ (200 OK):**
```json
{
  "user": {
    "email": "valerka@mail.ru",
    "first_name": "Валерий",
    "last_name": "Добров",
    "patronymic": "Антонович",
    "phone": "tel:+7-917-688-54-43",
    "passport_series": "4321",
    "passport_number": "654321"
  },
  "position": {
    "title": "Сантехник",
    "description": "Спокойный решатель сложных задач, который не боится воды и неожиданных сюрпризов под раковинами — мастер быстрых и надёжных починок.",
    "id": 2
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

- #####  Редактирование cотрудника по Id:
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

### Работа с гостями
- #####  Просмотр списка гостей:
> **GET: /users/guests/**

**Ответ (200 OK):**
```json
[
  {
    "email": "ivan@gmail.com",
    "first_name": "Иванушка",
    "last_name": "Ивонович"
  },
  ...
]
```
<br>

- #####  Просмотр гостя по Id:
> **GET: /users/guests/{guest_id}**

**Ответ (200 OK):**
```json
{
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

- #####  Редактирование гостя по Id:
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
  "email": "ivankrytov@mail.ru",
  "first_name": "Иван",
  "last_name": "Иванов"
}
```
<br>


### Номера
- #####  Получить все типы номеров:
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

### Должности сотрудников
- #####  Получиние всех должностей:
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

- #####  Получиние должности по Id:
> **GET: /positions/{position_id}**

**Ответ (200 OK):**
```json
{
  "title": "Горничная",
  "description": "Любительница идеального порядка и ароматов свежего белья — спокойная, внимательная к деталям и всегда готова удивить чистотой.",
  "id": 1
}
```
<br>


##  4. Общие эндпоинты
### Авторизация
- #####  Вход пользователей
> **POST: /auth/login/**

**Тело запроса:**
```json
[
  {
    "email": "ivan@gmail.com",
    "password": "12345678"
  }
]
```
**Ответ (200 OK):**
```json
[
  {
    "access_token": "eyJhbGciOiJI.....",
    "refresh_token": "eyJhbGciOiJ....",
    "token_type": "Bearer"
  }
]
```
<br>

- #####  Обновление JWT-токена
> **GET: /auth/refresh/**

**Заголовок запроса:**
``` Authorization: Bearer <refresh token> ```

**Ответ (200 OK):**
```json
[
  {
    "access_token": "eyJhbGciOiJI.....",
    "token_type": "Bearer"
  }
]
```
<br>