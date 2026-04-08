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
INSERT INTO public.amenities VALUES (1, 'Wi-Fi');
INSERT INTO public.amenities VALUES (2, 'Минибар');
INSERT INTO public.amenities VALUES (3, 'Кондиционер');
INSERT INTO public.amenities VALUES (4, 'Золотой унитаз');
INSERT INTO public.amenities VALUES (5, 'Джакузи');
INSERT INTO public.amenities VALUES (6, 'Балкон с видом на помойку');
INSERT INTO public.amenities VALUES (7, 'Шведский стол');
INSERT INTO public.amenities VALUES (8, 'Искуственные цветы для ванны');
INSERT INTO public.amenities VALUES (9, 'Телевизор');
INSERT INTO public.amenities VALUES (10, 'Домашний кинотеатр');


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
INSERT INTO public."user" VALUES (1, 'anton@gmail.com', '\x243262243132246a2f48774e74336a322f58634a48356a3633383043654b7255774d58706253616f51374450676757396b79506c796849673550412e', 'Антон', 'Зайчиков', 'Петров', 'tel:+7-919-696-25-60', '9898', '989898', 'GUEST', '2026-02-20 16:39:31.706217', '2026-02-23 01:55:42.543209');
INSERT INTO public."user" VALUES (2, 'amirkagorilka@mail.ru', '\x243262243132243351485044306166357549464850756f70723962772e4d69516761722f555935693459706c4e63474c482f726a454b524965312f75', 'Амир', 'Горила', NULL, 'tel:+7-917-800-90-01', '6767', '676767', 'EMPLOYEE', '2026-02-18 22:50:43.955892', '2026-02-23 12:01:49.240687');
INSERT INTO public."user" VALUES (3, 'bobbulder@gmail.com', '\x24326224313224636e6c4f37652e62694f6e506452592f754478624f757a633351474c624242684c334a5a6b4c445a454b2e6e72476f457737446b43', 'Боб', 'Черный', 'Строитель', 'tel:+7-917-877-65-51', '9090', '909090', 'EMPLOYEE', '2026-02-18 01:16:46.550172', '2026-02-18 01:16:46.550172');
INSERT INTO public."user" VALUES (4, 'tomleniv@gmail.com', '\x24326224313224394b7761324570657770444b6832646c70416d4b41656f6d4839487657704d59444f45442f66787330646355756b686f3534764f4b', 'Том', 'Ленивый', NULL, 'tel:+7-917-566-89-90', '1234', '098765', 'EMPLOYEE', '2026-02-18 13:15:16.825628', '2026-02-18 13:15:16.825628');
INSERT INTO public."user" VALUES (5, 'larimilord@mail.com', '\x24326224313224716e624a646f597962304c4366655a58757258363975496a2f586f7756717a6477487867485a6a6b657a524d31724a306657677357', 'Лари', 'Милорд', NULL, 'tel:+7-917-855-91-15', '1789', '567890', 'GUEST', '2026-02-17 16:52:48.701811', '2026-03-04 17:34:44.440821');
INSERT INTO public."user" VALUES (6, 'tami@gmail.com', '\x24326224313224775963683779597979444a6b654e616a78545751372e5a7658324452624f766d6c756d427a6c3769376244696b36454a7146674479', 'Тамирон', 'Пост', NULL, 'tel:+7-919-696-25-69', '1234', '123456', 'GUEST', '2026-02-17 14:10:50.002576', '2026-03-06 14:39:39.348827');


--
-- Data for Name: employee;
--
INSERT INTO public.employee VALUES (1, 3, 2, 200, 50, '2026-02-10 00:00:00', '90909090909090909090', 'ACTIVE', NULL, '{2,7}');
INSERT INTO public.employee VALUES (2, 4, 2, 300, 20, '2026-02-18 00:00:00', '21124356342143568709', 'ACTIVE', NULL, '{6,2}');
INSERT INTO public.employee VALUES (3, 2, 1, 200, 10, '2026-02-13 00:00:00', '90121416181910171615', 'ACTIVE', NULL, '{7}');

--
-- Data for Name: room_types;
--
INSERT INTO public.room_types VALUES (1, 'standart', 'Стандарт', 'Номер для нормальных людей. Кровать не скрипит (всегда), есть окно (иногда открывается). Чуть лучше, чем эконом.', '1wha3et4RkrbnIuQ5dwVw16WE1gljiS4i', 3000);
INSERT INTO public.room_types VALUES (2, 'lyuks', 'Люкс', 'Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно', '1pWokUIsbVFaZrDztrQN6i40Cxm6bBsXW', 6000);
INSERT INTO public.room_types VALUES (3, 'prezidentskiy', 'Президентский ', 'Королевские апартаменты! Вы будете чуствоать себя в розовом раю. Вид на город, если не туман.', '168fO5JrXJqs2I8ceuzQU5axdlEo5lLfM', 12000);
INSERT INTO public.room_types VALUES (4, 'ekonom', 'Эконом', 'Для тех, кто считает каждую копейку. Кровати розовые, но старые, возможно есть клопы. Wi-Fi только в коридоре', '1GTjbX0fjtfiPcf5K48prFR0uLVTbvN_u', 1500);
INSERT INTO public.room_types VALUES (5, 'bunker', 'Бункер', 'Для параноиков и интровертов. Никаких окон, звукоизоляция, еда подаётся через шлюз. Wi-Fi от соседей.', '1YrABgx3eborVEhxWxLPZSSKNkIeBoR9y', 1100);

--
-- Data for Name: rooms;
--
INSERT INTO public.rooms VALUES (1, '301', 3, 2, 4);
INSERT INTO public.rooms VALUES (2, '302', 3, 1, 4);
INSERT INTO public.rooms VALUES (3, '303', 3, 4, 4);
INSERT INTO public.rooms VALUES (4, '400', 4, 2, 1);
INSERT INTO public.rooms VALUES (5, '401', 4, 4, 1);
INSERT INTO public.rooms VALUES (6, '402', 4, 3, 1);
INSERT INTO public.rooms VALUES (7, '501', 5, 3, 2);
INSERT INTO public.rooms VALUES (8, '502', 5, 1, 2);
INSERT INTO public.rooms VALUES (9, '503', 5, 5, 2);
INSERT INTO public.rooms VALUES (10, '505', 5, 6, 2);
INSERT INTO public.rooms VALUES (11, '601', 4, 1, 3);
INSERT INTO public.rooms VALUES (12, '602', 4, 4, 3);
INSERT INTO public.rooms VALUES (13, '603', 4, 1, 3);
INSERT INTO public.rooms VALUES (14, '666', 4, 8, 3);
INSERT INTO public.rooms VALUES (15, '200', 2, 1, 5);
INSERT INTO public.rooms VALUES (16, '201', 2, 1, 5);
INSERT INTO public.rooms VALUES (17, '202', 2, 2, 5);


--
-- Data for Name: room_type_amenities_association;
--
INSERT INTO public.room_type_amenities_association VALUES (4, 1, true);
INSERT INTO public.room_type_amenities_association VALUES (4, 3, true);
INSERT INTO public.room_type_amenities_association VALUES (4, 7, true);
INSERT INTO public.room_type_amenities_association VALUES (1, 1, true);
INSERT INTO public.room_type_amenities_association VALUES (1, 3, true);
INSERT INTO public.room_type_amenities_association VALUES (1, 9, true);
INSERT INTO public.room_type_amenities_association VALUES (1, 7, false);
INSERT INTO public.room_type_amenities_association VALUES (2, 1, true);
INSERT INTO public.room_type_amenities_association VALUES (2, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (2, 3, false);
INSERT INTO public.room_type_amenities_association VALUES (2, 9, false);
INSERT INTO public.room_type_amenities_association VALUES (2, 5, true);
INSERT INTO public.room_type_amenities_association VALUES (2, 8, false);
INSERT INTO public.room_type_amenities_association VALUES (2, 7, false);
INSERT INTO public.room_type_amenities_association VALUES (3, 1, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 2, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 3, false);
INSERT INTO public.room_type_amenities_association VALUES (3, 10, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 5, false);
INSERT INTO public.room_type_amenities_association VALUES (3, 6, false);
INSERT INTO public.room_type_amenities_association VALUES (3, 7, false);
INSERT INTO public.room_type_amenities_association VALUES (3, 4, true);
INSERT INTO public.room_type_amenities_association VALUES (3, 8, false);


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
INSERT INTO public.services VALUES (1, 'ezhednevnaya-uborka-nomera', 'Ежедневная уборка номера', 0, 'Стандартная уборка номера: заправка кровати, вынос мусора, замена полотенец', '1IsE5l3aQrL3oXPSavpmneuah8VwwGx67', 1);
INSERT INTO public.services VALUES (2, 'generalnaya-uborka', 'Генеральная уборка', 1500, 'Полная уборка номера с мытьем окон и санузла', '1jEgXN9y2rNJ_FSjwIlR_tFa1Z_8KeCUt', 1);
INSERT INTO public.services VALUES (3, 'dopolnitelnaya-smena-belya', 'Дополнительная смена белья', 500, 'Внеплановая смена постельного белья', '1d28FZ0rEye1spIJYLsQVlpa5o6hQaIp3', 1);
INSERT INTO public.services VALUES (4, 'zamena-lampochki', 'Замена лампочки', 0, 'Замена перегоревшей лампочки в номере', '1sN2V0zh3YWtaAgNuR75vJOj_Qbp6IrYl', 2);
INSERT INTO public.services VALUES (5, 'remont-santehniki', 'Ремонт сантехники', 0, 'Устранение неполадок сантехнического оборудования', '1cX65iMf8tX9gy98Peunw7E6nKGvAqiMW	', 2);
INSERT INTO public.services VALUES (6, 'dopolnitelnyy-seyf', 'Дополнительный сейф', 3000, 'Аренда персонального сейфа на время проживания', '1cTSQv5bmKx7A3qCHdKA-VH0fQ3O7sM_u', 3);
INSERT INTO public.services VALUES (7, 'postelnye-prinadlezhnosti', 'Постельные принадлежности', 500, 'Дополнительное одеяло или подушка', '1ANtDQ4YilEwVT57GFgSykXrHWmVOtn-m', 3);
INSERT INTO public.services VALUES (8, 'zavtrak-v-nomer', 'Завтрак в номер', 1200, 'Сервировка завтрака в номере', '1HI3ilyNCBlnxktcCPU5SS8QN8MTjI2by', 4);
INSERT INTO public.services VALUES (9, 'kofe-chay-v-nomer', 'Кофе/чай в номер', 300, 'Доставка горячих напитков в номер', '1NcZzeXUkcg46JBvtEpNvmlXiMQ2Z5-gg', 4);
INSERT INTO public.services VALUES (10, 'mini-bar-obsluzhivanie', 'Мини-бар обслуживание', 500, 'Пополнение мини-бара', '1NS8BMK3ENjDUcIFCDogURWaLSMUvgmuF', 4);
INSERT INTO public.services VALUES (11, 'nabor-sredstv-dle-kypania', 'Набор средств для купания', 800, 'Дополнительный набор средств для душа и шампуней', '1ISb02uKv3BM5JvBrCzTrqIBw90QVxX78', 3);


--
-- Data for Name: position_services_association; 
--
INSERT INTO public.position_services_association VALUES (1, 1);
INSERT INTO public.position_services_association VALUES (1, 2);
INSERT INTO public.position_services_association VALUES (1, 3);
INSERT INTO public.position_services_association VALUES (2, 4);
INSERT INTO public.position_services_association VALUES (2, 5);
INSERT INTO public.position_services_association VALUES (3, 6);
INSERT INTO public.position_services_association VALUES (1, 11);
INSERT INTO public.position_services_association VALUES (1, 7);
INSERT INTO public.position_services_association VALUES (4, 8);
INSERT INTO public.position_services_association VALUES (4, 9);
INSERT INTO public.position_services_association VALUES (4, 10);
INSERT INTO public.position_services_association VALUES (2, 6);