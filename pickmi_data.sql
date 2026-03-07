--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Data for Name: amenities;
--
INSERT INTO public.amenities VALUES (2, 'Wi-Fi');
INSERT INTO public.amenities VALUES (3, 'Минибар');
INSERT INTO public.amenities VALUES (4, 'Кондиционер');
INSERT INTO public.amenities VALUES (5, 'Золотой унитаз');
INSERT INTO public.amenities VALUES (6, 'Джакузи');
INSERT INTO public.amenities VALUES (7, 'Балкон с видом на помойку');
INSERT INTO public.amenities VALUES (8, 'Шведский стол');
INSERT INTO public.amenities VALUES (9, 'Искуственные цветы для ванны');
INSERT INTO public.amenities VALUES (10, 'Телевизор');
INSERT INTO public.amenities VALUES (11, 'Домашний кинотеатр');


--
-- Data for Name: position;
--
INSERT INTO public."position" VALUES (1, 'Горничная', 'Любительница идеального порядка и ароматов свежего белья — спокойная, внимательная к деталям и всегда готова удивить чистотой.');
INSERT INTO public."position" VALUES (2, 'Сантехник', 'Спокойный решатель сложных задач, который не боится воды и неожиданных сюрпризов под раковинами — мастер быстрых и надёжных починок.');
INSERT INTO public."position" VALUES (3, 'Менеджер', 'Коммуникативный стратег с улыбкой, умеет успокоить гостя, расставить приоритеты и сделать так, чтобы всё работало как часы.');
INSERT INTO public."position" VALUES (4, 'Официант', 'Классный чел, который приносит еду и напитки');


--
-- Data for Name: user;
--

INSERT INTO public."user" VALUES (30, 'anton@gmail.com', '\x243262243132246a2f48774e74336a322f58634a48356a3633383043654b7255774d58706253616f51374450676757396b79506c796849673550412e', 'Антон', 'Зайчиков', 'Петров', 'tel:+7-919-696-25-60', '9898', '989898', 'GUEST', '2026-02-20 16:39:31.706217', '2026-02-23 01:55:42.543209');
INSERT INTO public."user" VALUES (28, 'amirkagorilka@mail.ru', '\x243262243132243351485044306166357549464850756f70723962772e4d69516761722f555935693459706c4e63474c482f726a454b524965312f75', 'Амир', 'Горила', NULL, 'tel:+7-917-800-90-01', '6767', '676767', 'EMPLOYEE', '2026-02-18 22:50:43.955892', '2026-02-23 12:01:49.240687');
INSERT INTO public."user" VALUES (40, 'valerkadobrov@mail.ru', '\x24326224313224672f4a643356567036672f716e46752e31437a35572e582e424d3735612f69444750416f336f61656e5276614e39597455784d7732', 'Валерка', 'Добровка', 'Антонович', 'tel:+7-917-688-54-43', '4321', '654321', 'EMPLOYEE', '2026-02-23 14:49:43.1227', '2026-02-23 15:03:57.207764');
INSERT INTO public."user" VALUES (17, 'bobbulder@gmail.com', '\x24326224313224636e6c4f37652e62694f6e506452592f754478624f757a633351474c624242684c334a5a6b4c445a454b2e6e72476f457737446b43', 'Боб', 'Черный', 'Строитель', 'tel:+7-917-877-65-51', '9090', '909090', 'EMPLOYEE', '2026-02-18 01:16:46.550172', '2026-02-18 01:16:46.550172');
INSERT INTO public."user" VALUES (26, 'tomleniv@gmail.com', '\x24326224313224394b7761324570657770444b6832646c70416d4b41656f6d4839487657704d59444f45442f66787330646355756b686f3534764f4b', 'Том', 'Ленивый', NULL, 'tel:+7-917-566-89-90', '1234', '098765', 'EMPLOYEE', '2026-02-18 13:15:16.825628', '2026-02-18 13:15:16.825628');
INSERT INTO public."user" VALUES (10, 'tdrozdikova@gmail.com', '\x24326224313224314e656c5036754f694266514f4d543954447447574f6e2f5366412e6146422e565975482e63534d797551712e6d456542776b3643', 'Татьяна', 'Дроздикова', 'Андреевна', 'tel:+7-919-696-25-67', '1111', '111111', 'ADMIN', '2026-02-17 17:16:22.172323', '2026-02-22 20:48:19.175158');
INSERT INTO public."user" VALUES (7, 'larimilord@mail.com', '\x24326224313224716e624a646f597962304c4366655a58757258363975496a2f586f7756717a6477487867485a6a6b657a524d31724a306657677357', 'Лари', 'Милорд', NULL, 'tel:+7-917-855-91-15', '1789', '567890', 'GUEST', '2026-02-17 16:52:48.701811', '2026-03-04 17:34:44.440821');
INSERT INTO public."user" VALUES (8, 'monich@gmail.com', '\x24326224313224506844744c6b6c387361633672657170686167504b2e5a6d744179503441774f787a6439555a4e42687278787743566978716a2e6d', 'Артем', 'Монич', 'Олегович', 'tel:+7-905-766-12-21', '3333', '333333', 'EMPLOYEE', '2026-03-05 22:55:32.592526', '2026-03-05 22:55:32.593547');
INSERT INTO public."user" VALUES (9, 'lakricen@gmail.com', '\x2432622431322452475344656a5264626443364c674538794f736a704f534d68374a3468316a4867346a6864694f4466585949494f366b676d674c36', 'Егор', 'Лакрицен', 'Алексеевич', 'tel:+7-905-766-12-23', '4444', '444444', 'EMPLOYEE', '2026-03-05 22:59:01.27114', '2026-03-05 22:59:01.27114');
INSERT INTO public."user" VALUES (11, 'krlov@gmail.com', '\x24326224313224514f416d7a37504a684c4779326f5967734546367975636c38486b74534f347654425177534c4c2f727a37312e394132486b796643', 'Михаил', 'Крылов', 'Андреевич', 'tel:+7-905-766-12-25', '5555', '555555', 'EMPLOYEE', '2026-03-05 23:01:15.521312', '2026-03-05 23:01:15.521312');
INSERT INTO public."user" VALUES (1, 'tami@gmail.com', '\x24326224313224775963683779597979444a6b654e616a78545751372e5a7658324452624f766d6c756d427a6c3769376244696b36454a7146674479', 'Тамирон', 'Пост', NULL, 'tel:+7-919-696-25-69', '1234', '123456', 'GUEST', '2026-02-17 14:10:50.002576', '2026-03-06 14:39:39.348827');


--
-- Data for Name: employee;
--
INSERT INTO public.employee VALUES (1, 17, 2, 200, 50, '2026-02-10 00:00:00', '90909090909090909090', 'ACTIVE', NULL, '{2,7}');
INSERT INTO public.employee VALUES (16, 40, 3, 1000, 50, '2026-02-23 00:00:00', '13141516121314243546', 'ACTIVE', NULL, '{1,2,3}');
INSERT INTO public.employee VALUES (7, 26, 2, 300, 20, '2026-02-18 00:00:00', '21124356342143568709', 'ACTIVE', NULL, '{6,2}');
INSERT INTO public.employee VALUES (8, 28, 1, 200, 10, '2026-02-13 00:00:00', '90121416181910171615', 'ACTIVE', NULL, '{7}');
INSERT INTO public.employee VALUES (3, 8, 4, 1000, 500, '2026-03-05 00:00:00', '33333333333333333333', 'ACTIVE', NULL, '{1,3}');
INSERT INTO public.employee VALUES (4, 9, 4, 1500, 500, '2026-03-05 00:00:00', '44444444444444444444', 'ACTIVE', NULL, '{4}');
INSERT INTO public.employee VALUES (5, 11, 4, 1000, 500, '2026-03-05 00:00:00', '55555555555555555555', 'ACTIVE', NULL, '{6,7}');


--
-- Data for Name: room_types;
--

INSERT INTO public.room_types VALUES (3, 'standart', 'Стандарт', 'Номер для нормальных людей. Кровать не скрипит (всегда), есть окно (иногда открывается). Чуть лучше, чем эконом.', '1wha3et4RkrbnIuQ5dwVw16WE1gljiS4i', 3000);
INSERT INTO public.room_types VALUES (4, 'lyuks', 'Люкс', 'Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно', '1pWokUIsbVFaZrDztrQN6i40Cxm6bBsXW', 6000);
INSERT INTO public.room_types VALUES (5, 'prezidentskiy', 'Президентский ', 'Королевские апартаменты! Вы будете чуствоать себя в розовом раю. Вид на город, если не туман.', '168fO5JrXJqs2I8ceuzQU5axdlEo5lLfM', 12000);
INSERT INTO public.room_types VALUES (2, 'ekonom', 'Эконом', 'Для тех, кто считает каждую копейку. Кровати розовые, но старые, возможно есть клопы. Wi-Fi только в коридоре', '1GTjbX0fjtfiPcf5K48prFR0uLVTbvN_u', 1500);
INSERT INTO public.room_types VALUES (6, 'bunker', 'Бункер', 'Для параноиков и интровертов. Никаких окон, звукоизоляция, еда подаётся через шлюз. Wi-Fi от соседей.', '1YrABgx3eborVEhxWxLPZSSKNkIeBoR9y', 1100);

--
-- Data for Name: rooms;
--

INSERT INTO public.rooms VALUES (11, '301', 3, 2, 2);
INSERT INTO public.rooms VALUES (12, '302', 3, 1, 2);
INSERT INTO public.rooms VALUES (13, '303', 3, 4, 2);
INSERT INTO public.rooms VALUES (14, '400', 4, 2, 3);
INSERT INTO public.rooms VALUES (15, '401', 4, 4, 3);
INSERT INTO public.rooms VALUES (16, '402', 4, 3, 3);
INSERT INTO public.rooms VALUES (17, '501', 5, 3, 4);
INSERT INTO public.rooms VALUES (18, '502', 5, 1, 4);
INSERT INTO public.rooms VALUES (19, '503', 5, 5, 4);
INSERT INTO public.rooms VALUES (20, '505', 5, 6, 4);
INSERT INTO public.rooms VALUES (21, '601', 4, 1, 5);
INSERT INTO public.rooms VALUES (22, '602', 4, 4, 5);
INSERT INTO public.rooms VALUES (23, '603', 4, 1, 5);
INSERT INTO public.rooms VALUES (24, '666', 4, 8, 5);
INSERT INTO public.rooms VALUES (25, '200', 2, 1, 6);
INSERT INTO public.rooms VALUES (26, '201', 2, 1, 6);
INSERT INTO public.rooms VALUES (27, '202', 2, 2, 6);


--
-- Data for Name: room_type_amenities_association;
--

INSERT INTO public.room_type_amenities_association VALUES (2, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (2, 4, true);
INSERT INTO public.room_type_amenities_association VALUES (2, 8, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 4, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 10, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 8, false);
INSERT INTO public.room_type_amenities_association VALUES (4, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (4, 3, true);
INSERT INTO public.room_type_amenities_association VALUES (4, 4, false);
INSERT INTO public.room_type_amenities_association VALUES (4, 10, false);
INSERT INTO public.room_type_amenities_association VALUES (4, 6, true);
INSERT INTO public.room_type_amenities_association VALUES (4, 9, false);
INSERT INTO public.room_type_amenities_association VALUES (4, 8, false);
INSERT INTO public.room_type_amenities_association VALUES (5, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (5, 3, true);
INSERT INTO public.room_type_amenities_association VALUES (5, 4, false);
INSERT INTO public.room_type_amenities_association VALUES (5, 11, true);
INSERT INTO public.room_type_amenities_association VALUES (5, 6, false);
INSERT INTO public.room_type_amenities_association VALUES (5, 7, false);
INSERT INTO public.room_type_amenities_association VALUES (5, 8, false);
INSERT INTO public.room_type_amenities_association VALUES (5, 5, true);
INSERT INTO public.room_type_amenities_association VALUES (5, 9, false);


--
-- Data for Name: reservation;
--

INSERT INTO public.reservation VALUES (20, 30, 22, '2026-03-11 13:00:00', '2026-03-13 11:00:00', 24000, 'CANCELED', '2026-03-01 14:52:02.183965', '2026-03-03 21:10:45.557309');
INSERT INTO public.reservation VALUES (3, 30, 19, '2026-03-08 12:00:00', '2026-03-09 12:00:00', 6000, 'CANCELED', '2026-03-01 13:05:26.536733', '2026-03-03 21:16:32.713825');
INSERT INTO public.reservation VALUES (17, 30, 22, '2026-03-09 12:00:00', '2026-03-10 12:30:00', 12000, 'PENDING', '2026-03-01 14:48:56.386556', '2026-03-04 01:25:54.625353');
INSERT INTO public.reservation VALUES (25, 1, 19, '2026-03-08 12:00:00', '2026-03-10 12:00:00', 12000, 'PENDING', '2026-03-03 21:18:59.610745', '2026-03-03 21:18:59.611743');
INSERT INTO public.reservation VALUES (1, 30, 19, '2026-03-01 13:00:00', '2026-03-08 12:00:00', 42000, 'ACTIVE', '2026-03-01 12:56:28.928549', '2026-03-06 21:09:25.338544');
INSERT INTO public.reservation VALUES (27, 7, 13, '2026-03-05 12:00:00', '2026-03-08 12:00:00', 9000, 'ACTIVE', '2026-03-04 12:24:01.858', '2026-03-06 21:09:25.338544');
INSERT INTO public.reservation VALUES (26, 7, 11, '2026-03-04 18:00:00', '2026-03-10 18:00:00', 15000, 'ACTIVE', '2026-03-04 12:15:17.571521', '2026-03-06 21:09:25.338544');
INSERT INTO public.reservation VALUES (21, 1, 26, '2026-03-03 19:30:00', '2026-03-10 12:00:00', 9400, 'ACTIVE', '2026-03-01 14:56:36.368893', '2026-03-06 21:09:25.338544');
INSERT INTO public.reservation VALUES (16, 30, 22, '2026-03-04 12:00:00', '2026-03-05 12:30:00', 12000, 'COMPLETED', '2026-03-01 14:46:41.023575', '2026-03-06 21:09:25.340442');
INSERT INTO public.reservation VALUES (14, 1, 22, '2026-03-01 15:00:00', '2026-03-03 15:30:00', 24000, 'COMPLETED', '2026-03-01 14:37:07.239367', '2026-03-06 21:09:25.340442');
INSERT INTO public.reservation VALUES (24, 1, 14, '2026-03-02 09:00:00', '2026-03-03 09:00:00', 3000, 'COMPLETED', '2026-03-01 16:47:11.208348', '2026-03-06 21:09:25.340442');
INSERT INTO public.reservation VALUES (28, 7, 11, '2026-05-02 09:00:00', '2026-05-03 09:00:00', 1500, 'CANCELED', '2026-03-04 14:31:31.925002', '2026-03-04 14:34:43.453911');
INSERT INTO public.reservation VALUES (29, 7, 11, '2026-01-15 14:00:00', '2026-01-20 12:00:00', 12500, 'COMPLETED', '2026-01-10 10:00:00.000000', '2026-01-20 12:30:00.000000');
INSERT INTO public.reservation VALUES (30, 30, 19, '2026-02-10 15:00:00', '2026-02-15 11:00:00', 15000, 'COMPLETED', '2026-02-05 09:30:00.000000', '2026-02-15 11:15:00.000000');



--
-- Data for Name: service_categories;
--

INSERT INTO public.service_categories VALUES (1, 'uborka-i-klining', 'Уборка и клининг');
INSERT INTO public.service_categories VALUES (2, 'tehnicheskoe-obsluzhivanie', 'Техническое обслуживание');
INSERT INTO public.service_categories VALUES (3, 'servis-v-nomer', 'Сервис в номер');
INSERT INTO public.service_categories VALUES (4, 'restorannoe-obsluzhivanie', 'Ресторанное обслуживание');


--
-- Data for Name: services; 
--

INSERT INTO public.services VALUES (1, 'ezhednevnaya-uborka-nomera', 'Ежедневная уборка номера', 0, 'Стандартная уборка номера: заправка кровати, вынос мусора, замена полотенец', NULL, 1);
INSERT INTO public.services VALUES (2, 'generalnaya-uborka', 'Генеральная уборка', 1500, 'Полная уборка номера с мытьем окон и санузла', NULL, 1);
INSERT INTO public.services VALUES (3, 'dopolnitelnaya-smena-belya', 'Дополнительная смена белья', 500, 'Внеплановая смена постельного белья', NULL, 1);
INSERT INTO public.services VALUES (4, 'zamena-lampochki', 'Замена лампочки', 0, 'Замена перегоревшей лампочки в номере', NULL, 2);
INSERT INTO public.services VALUES (6, 'remont-santehniki', 'Ремонт сантехники', 0, 'Устранение неполадок сантехнического оборудования', NULL, 2);
INSERT INTO public.services VALUES (7, 'dopolnitelnyy-seyf', 'Дополнительный сейф', 3000, 'Аренда персонального сейфа на время проживания', NULL, 3);
INSERT INTO public.services VALUES (9, 'postelnye-prinadlezhnosti', 'Постельные принадлежности', 500, 'Дополнительное одеяло или подушка', NULL, 3);
INSERT INTO public.services VALUES (10, 'zavtrak-v-nomer', 'Завтрак в номер', 1200, 'Сервировка завтрака в номере', NULL, 4);
INSERT INTO public.services VALUES (11, 'kofe-chay-v-nomer', 'Кофе/чай в номер', 300, 'Доставка горячих напитков в номер', NULL, 4);
INSERT INTO public.services VALUES (12, 'mini-bar-obsluzhivanie', 'Мини-бар обслуживание', 500, 'Пополнение мини-бара', NULL, 4);
INSERT INTO public.services VALUES (8, 'nabor-sredstv-dle-kypania', 'Набор средств для купания', 800, 'Дополнительный набор средств для душа и шампуней', NULL, 3);


--
-- Data for Name: position_services_association; 
--
INSERT INTO public.position_services_association VALUES (1, 1);
INSERT INTO public.position_services_association VALUES (1, 2);
INSERT INTO public.position_services_association VALUES (1, 3);
INSERT INTO public.position_services_association VALUES (2, 4);
INSERT INTO public.position_services_association VALUES (2, 6);
INSERT INTO public.position_services_association VALUES (3, 7);
INSERT INTO public.position_services_association VALUES (1, 8);
INSERT INTO public.position_services_association VALUES (1, 9);
INSERT INTO public.position_services_association VALUES (4, 10);
INSERT INTO public.position_services_association VALUES (4, 11);
INSERT INTO public.position_services_association VALUES (4, 12);
INSERT INTO public.position_services_association VALUES (2, 7);

--
-- Data for Name: task; 
--

INSERT INTO public.task VALUES (1, 2, 27, 8, 'PENDING', '2026-03-07 09:00:00', 'уберите пожалуйста паука из шкафа', NULL, NULL, '2026-03-05 18:35:32.11874', '2026-03-05 18:35:32.11874');
INSERT INTO public.task VALUES (4, 6, 26, 1, 'PENDING', '2026-03-05 19:00:00', 'достаньте рыбы из трубы, а то раковина засорилась', NULL, NULL, '2026-03-05 18:51:26.900089', '2026-03-05 18:51:26.900089');
INSERT INTO public.task VALUES (5, 4, 26, 7, 'PENDING', '2026-03-05 19:00:00', 'дайте свет ппжпжпжпжпж', NULL, NULL, '2026-03-05 18:53:15.178774', '2026-03-05 18:53:15.178774');
INSERT INTO public.task VALUES (6, 7, 26, 16, 'PENDING', '2026-03-05 19:00:00', 'я хочу спрятать все свои украденные деньги', NULL, NULL, '2026-03-05 18:56:13.305692', '2026-03-05 18:56:13.305692');
INSERT INTO public.task VALUES (7, 7, 26, 1, 'PENDING', '2026-03-05 19:05:00', 'я спрятать там ранее купленный сейф', NULL, NULL, '2026-03-05 19:00:42.220173', '2026-03-05 19:00:42.220173');
INSERT INTO public.task VALUES (8, 10, 21, 3, 'COMPLETED', '2026-03-06 09:00:00', 'есть принесите пжпжпж', '2026-03-06 00:45:37.130816', '2026-03-06 00:50:24.01853', '2026-03-05 23:09:29.608158', '2026-03-06 00:50:24.01853');
INSERT INTO public.task VALUES (10, 11, 21, 4, 'COMPLETED', '2026-03-07 09:00:00', 'принисите коооофъэээ пжпжпж', '2026-03-06 00:56:19.258014', '2026-03-06 00:58:09.722789', '2026-03-05 23:20:10.104211', '2026-03-06 00:58:09.722789');
INSERT INTO public.task VALUES (14, 10, 21, 4, 'CANCELED', '2026-03-09 09:00:00', 'покушать принесите :) ', NULL, NULL, '2026-03-05 23:24:13.193401', '2026-03-06 01:06:18.602425');
INSERT INTO public.task VALUES (13, 12, 21, 5, 'PENDING', '2026-03-09 23:00:00', 'я буду бухать и шуметь. Извините за ранее', NULL, NULL, '2026-03-05 23:23:06.160837', '2026-03-06 17:11:04.734395');
INSERT INTO public.task VALUES (100, 1, 29, 1, 'COMPLETED', '2026-01-16 10:00:00', 'Ежедневная уборка после заезда', '2026-01-16 10:05:00', '2026-01-16 11:00:00', '2026-01-15 23:00:00.000000', '2026-01-16 11:05:00.000000');
INSERT INTO public.task VALUES (101, 2, 29, 1, 'COMPLETED', '2026-01-19 09:00:00', 'Генеральная уборка перед выездом', '2026-01-19 09:10:00', '2026-01-19 11:30:00', '2026-01-18 21:00:00.000000', '2026-01-19 11:35:00.000000');
INSERT INTO public.task VALUES (102, 4, 1, 7, 'COMPLETED', '2026-03-04 15:00:00', 'Заменить перегоревшую лампочку в ванной', '2026-03-04 15:20:00', '2026-03-04 15:40:00', '2026-03-03 20:15:00.000000', '2026-03-04 15:45:00.000000');
INSERT INTO public.task VALUES (103, 6, 27, 7, 'COMPLETED', '2026-03-06 11:00:00', 'Протекает кран на кухне', '2026-03-06 11:15:00', '2026-03-06 12:00:00', '2026-03-05 09:00:00.000000', '2026-03-06 12:05:00.000000');
INSERT INTO public.task VALUES (104, 7, 26, 3, 'COMPLETED', '2026-03-05 18:00:00', 'Активировать и занести сейф в номер', '2026-03-05 18:10:00', '2026-03-05 18:30:00', '2026-03-05 10:00:00.000000', '2026-03-05 18:35:00.000000');
INSERT INTO public.task VALUES (105, 7, 26, 3, 'COMPLETED', '2026-03-08 09:00:00', 'Забрать сейф из номера', '2026-03-08 09:05:00', '2026-03-08 09:20:00', '2026-03-07 22:00:00.000000', '2026-03-08 09:25:00.000000');
INSERT INTO public.task VALUES (106, 8, 21, 1, 'COMPLETED', '2026-03-04 20:00:00', 'Дополнительный набор шампуня и геля для душа', '2026-03-04 20:15:00', '2026-03-04 20:25:00', '2026-03-04 18:30:00.000000', '2026-03-04 20:30:00.000000');
INSERT INTO public.task VALUES (107, 9, 21, 1, 'COMPLETED', '2026-03-05 22:00:00', 'Принести вторую подушку', '2026-03-05 22:10:00', '2026-03-05 22:20:00', '2026-03-05 20:00:00.000000', '2026-03-05 22:25:00.000000');
INSERT INTO public.task VALUES (108, 10, 30, 5, 'COMPLETED', '2026-02-11 08:30:00', 'Завтрак в номер: континентальный', '2026-02-11 08:35:00', '2026-02-11 09:00:00', '2026-02-10 22:15:00.000000', '2026-02-11 09:05:00.000000');
INSERT INTO public.task VALUES (109, 11, 30, 5, 'COMPLETED', '2026-02-12 16:00:00', 'Американо и два круассана', '2026-02-12 16:10:00', '2026-02-12 16:25:00', '2026-02-12 15:00:00.000000', '2026-02-12 16:30:00.000000');
INSERT INTO public.task VALUES (110, 12, 30, 5, 'COMPLETED', '2026-02-13 11:00:00', 'Пополнить мини-бар водой и соком', '2026-02-13 11:05:00', '2026-02-13 11:20:00', '2026-02-12 23:00:00.000000', '2026-02-13 11:25:00.000000');
INSERT INTO public.task VALUES (111, 1, 16, 1, 'COMPLETED', '2026-03-04 12:30:00', 'Уборка номера', '2026-03-04 12:40:00', '2026-03-04 13:30:00', '2026-03-04 09:45:00.000000', '2026-03-04 13:35:00.000000');
INSERT INTO public.task VALUES (112, 3, 14, 1, 'COMPLETED', '2026-03-02 11:00:00', 'Дополнительная смена белья', '2026-03-02 11:10:00', '2026-03-02 11:45:00', '2026-03-02 08:00:00.000000', '2026-03-02 11:50:00.000000');
INSERT INTO public.task VALUES (113, 4, 24, 7, 'COMPLETED', '2026-03-02 14:00:00', 'Не работает розетка', '2026-03-02 14:30:00', '2026-03-02 15:15:00', '2026-03-02 12:00:00.000000', '2026-03-02 15:20:00.000000');
INSERT INTO public.task VALUES (114, 9, 29, 1, 'COMPLETED', '2026-01-17 21:00:00', 'Дополнительное одеяло, гостю холодно', '2026-01-17 21:10:00', '2026-01-17 21:20:00', '2026-01-17 19:30:00.000000', '2026-01-17 21:25:00.000000');
INSERT INTO public.task VALUES (115, 2, 30, 1, 'COMPLETED', '2026-02-14 10:00:00', 'Генеральная уборка номера', '2026-02-14 10:15:00', '2026-02-14 12:45:00', '2026-02-13 17:00:00.000000', '2026-02-14 12:50:00.000000');
INSERT INTO public.task VALUES (116, 10, 26, 5, 'COMPLETED', '2026-03-06 09:00:00', 'Завтрак в номер: яичница с беконом', '2026-03-06 09:05:00', '2026-03-06 09:35:00', '2026-03-05 23:00:00.000000', '2026-03-06 09:40:00.000000');
INSERT INTO public.task VALUES (117, 11, 27, 5, 'COMPLETED', '2026-03-07 15:30:00', 'Капучино и вода без газа', '2026-03-07 15:40:00', '2026-03-07 15:55:00', '2026-03-07 14:00:00.000000', '2026-03-07 16:00:00.000000');
INSERT INTO public.task VALUES (118, 3, 21, 1, 'COMPLETED', '2026-03-06 12:00:00', 'Смена постельного белья', '2026-03-06 12:10:00', '2026-03-06 12:50:00', '2026-03-06 09:00:00.000000', '2026-03-06 12:55:00.000000');
INSERT INTO public.task VALUES (119, 6, 24, 7, 'COMPLETED', '2026-03-03 10:00:00', 'Забилась раковина', '2026-03-03 10:20:00', '2026-03-03 11:10:00', '2026-03-02 22:00:00.000000', '2026-03-03 11:15:00.000000');
--
-- PostgreSQL database dump complete
--

