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
-- Data for Name: position; Type: TABLE DATA; Schema: public; Owner: TamironPost
--
INSERT INTO public."position" VALUES (1, 'Горничная', 'Любительница идеального порядка и ароматов свежего белья — спокойная, внимательная к деталям и всегда готова удивить чистотой.');
INSERT INTO public."position" VALUES (2, 'Сантехник', 'Спокойный решатель сложных задач, который не боится воды и неожиданных сюрпризов под раковинами — мастер быстрых и надёжных починок.');
INSERT INTO public."position" VALUES (3, 'Менеджер', 'Коммуникативный стратег с улыбкой, умеет успокоить гостя, расставить приоритеты и сделать так, чтобы всё работало как часы.');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: TamironPost
--
INSERT INTO public."user" VALUES (30, 'anton@gmail.com', '\x243262243132246a2f48774e74336a322f58634a48356a3633383043654b7255774d58706253616f51374450676757396b79506c796849673550412e', 'Антон', 'Зайчиков', 'Петров', 'tel:+7-919-696-25-60', '9898', '989898', 'GUEST', '2026-02-20 16:39:31.706217', '2026-02-23 01:55:42.543209');
INSERT INTO public."user" VALUES (28, 'amirkagorilka@mail.ru', '\x243262243132243351485044306166357549464850756f70723962772e4d69516761722f555935693459706c4e63474c482f726a454b524965312f75', 'Амир', 'Горила', NULL, 'tel:+7-917-800-90-01', '6767', '676767', 'EMPLOYEE', '2026-02-18 22:50:43.955892', '2026-02-23 12:01:49.240687');
INSERT INTO public."user" VALUES (40, 'valerkadobrov@mail.ru', '\x24326224313224672f4a643356567036672f716e46752e31437a35572e582e424d3735612f69444750416f336f61656e5276614e39597455784d7732', 'Валерка', 'Добровка', 'Антонович', 'tel:+7-917-688-54-43', '4321', '654321', 'EMPLOYEE', '2026-02-23 14:49:43.1227', '2026-02-23 15:03:57.207764');
INSERT INTO public."user" VALUES (38, 'ivankrytov@mail.ru', '\x243262243132243242652f483135784b7641303275694b37484e56664f4d4149634c6e4c595743564d7a6c514b723045724f354f7a736a4e6b555279', 'Иван', 'Крутов', '', 'tel:+7-917-866-71-14', '1235', '123455', 'GUEST', '2026-02-23 14:10:45.792626', '2026-02-23 15:11:49.997358');
INSERT INTO public."user" VALUES (17, 'bobbulder@gmail.com', '\x24326224313224636e6c4f37652e62694f6e506452592f754478624f757a633351474c624242684c334a5a6b4c445a454b2e6e72476f457737446b43', 'Боб', 'Черный', 'Строитель', 'tel:+7-917-877-65-51', '9090', '909090', 'EMPLOYEE', '2026-02-18 01:16:46.550172', '2026-02-18 01:16:46.550172');
INSERT INTO public."user" VALUES (26, 'tomleniv@gmail.com', '\x24326224313224394b7761324570657770444b6832646c70416d4b41656f6d4839487657704d59444f45442f66787330646355756b686f3534764f4b', 'Том', 'Ленивый', NULL, 'tel:+7-917-566-89-90', '1234', '098765', 'EMPLOYEE', '2026-02-18 13:15:16.825628', '2026-02-18 13:15:16.825628');
INSERT INTO public."user" VALUES (27, 'anna@gmail.com', '\x24326224313224496a56383050322f7769326a58413445437130706a4f712e70766f732e787772583147716e72556e322e4a5832464e49556c513443', 'Анна', 'Петрова', 'Сергеевна', 'tel:+7-918-344-56-67', '1289', '907834', 'GUEST', '2026-02-18 22:47:17.109489', '2026-02-18 22:47:17.109489');
INSERT INTO public."user" VALUES (7, 'larimilord@mail.com', '\x24326224313224716e624a646f597962304c4366655a58757258363975496a2f586f7756717a6477487867485a6a6b657a524d31724a306657677357', 'Лари', 'Милорд', 'Джедовский', 'tel:+7-917-855-91-15', '1789', '567890', 'GUEST', '2026-02-17 16:52:48.701811', '2026-02-22 19:35:55.265972');
INSERT INTO public."user" VALUES (1, 'tami@gmail.com', '\x24326224313224775963683779597979444a6b654e616a78545751372e5a7658324452624f766d6c756d427a6c3769376244696b36454a7146674479', 'Тамирон', 'Пост', NULL, 'tel:+7-919-696-25-69', '1234', '123456', 'GUEST', '2026-02-17 14:10:50.002576', '2026-02-22 20:14:30.439714');
INSERT INTO public."user" VALUES (10, 'tdrozdikova@gmail.com', '\x24326224313224314e656c5036754f694266514f4d543954447447574f6e2f5366412e6146422e565975482e63534d797551712e6d456542776b3643', 'Татьяна', 'Дроздикова', 'Андреевна', 'tel:+7-919-696-25-67', '1111', '111111', 'ADMIN', '2026-02-17 17:16:22.172323', '2026-02-22 20:48:19.175158');


--
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: TamironPost
--
INSERT INTO public.employee VALUES (1, 17, 2, 200, 50, '2026-02-10 00:00:00', '90909090909090909090', 'ACTIVE', NULL, '{2,7}');
INSERT INTO public.employee VALUES (16, 40, 3, 1000, 50, '2026-02-23 00:00:00', '13141516121314243546', 'ACTIVE', NULL, '{1,2,3}');
INSERT INTO public.employee VALUES (7, 26, 2, 300, 20, '2026-02-18 00:00:00', '21124356342143568709', 'ACTIVE', NULL, '{6,2}');
INSERT INTO public.employee VALUES (8, 28, 1, 200, 10, '2026-02-13 00:00:00', '90121416181910171615', 'ACTIVE', NULL, '{6}');

--
-- Data for Name: room_types; Type: TABLE DATA; Schema: public; Owner: TamironPost
--
INSERT INTO public.room_types VALUES (3, 'standart', 'Стандарт', 'Номер для нормальных людей. Кровать не скрипит (всегда), есть окно (иногда открывается). Чуть лучше, чем эконом.', '1wha3et4RkrbnIuQ5dwVw16WE1gljiS4i', 3000);
INSERT INTO public.room_types VALUES (4, 'lyuks', 'Люкс', 'Для тех, кто хочет почувствовать себя настоящей пикми. Более менее жить можно', '1pWokUIsbVFaZrDztrQN6i40Cxm6bBsXW', 6000);
INSERT INTO public.room_types VALUES (5, 'prezidentskiy', 'Президентский ', 'Королевские апартаменты! Вы будете чуствоать себя в розовом раю. Вид на город, если не туман.', '168fO5JrXJqs2I8ceuzQU5axdlEo5lLfM', 12000);
INSERT INTO public.room_types VALUES (2, 'ekonom', 'Эконом', 'Для тех, кто считает каждую копейку. Кровати розовые, но старые, возможно есть клопы. Wi-Fi только в коридоре', '1GTjbX0fjtfiPcf5K48prFR0uLVTbvN_u', 1500);
INSERT INTO public.room_types VALUES (6, 'bunker', 'Бункер', 'Для параноиков и интровертов. Никаких окон, звукоизоляция, еда подаётся через шлюз. Wi-Fi от соседей.', '1YrABgx3eborVEhxWxLPZSSKNkIeBoR9y', 1100);

--
-- Data for Name: room_type_amenities; Type: TABLE DATA; Schema: public; Owner: TamironPost
--

INSERT INTO public.room_type_amenities VALUES (2, 2, true);
INSERT INTO public.room_type_amenities VALUES (2, 4, true);
INSERT INTO public.room_type_amenities VALUES (2, 8, true);
INSERT INTO public.room_type_amenities VALUES (3, 2, true);
INSERT INTO public.room_type_amenities VALUES (3, 4, true);
INSERT INTO public.room_type_amenities VALUES (3, 10, true);
INSERT INTO public.room_type_amenities VALUES (3, 8, false);
INSERT INTO public.room_type_amenities VALUES (4, 2, true);
INSERT INTO public.room_type_amenities VALUES (4, 3, true);
INSERT INTO public.room_type_amenities VALUES (4, 4, false);
INSERT INTO public.room_type_amenities VALUES (4, 10, false);
INSERT INTO public.room_type_amenities VALUES (4, 6, true);
INSERT INTO public.room_type_amenities VALUES (4, 9, false);
INSERT INTO public.room_type_amenities VALUES (4, 8, false);
INSERT INTO public.room_type_amenities VALUES (5, 2, true);
INSERT INTO public.room_type_amenities VALUES (5, 3, true);
INSERT INTO public.room_type_amenities VALUES (5, 4, false);
INSERT INTO public.room_type_amenities VALUES (5, 11, true);
INSERT INTO public.room_type_amenities VALUES (5, 6, false);
INSERT INTO public.room_type_amenities VALUES (5, 7, false);
INSERT INTO public.room_type_amenities VALUES (5, 8, false);
INSERT INTO public.room_type_amenities VALUES (5, 5, true);
INSERT INTO public.room_type_amenities VALUES (5, 9, false);




--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: TamironPost
--

INSERT INTO public.rooms VALUES (11, '301', 3, 2, 'AVAILABLE', 2);
INSERT INTO public.rooms VALUES (12, '302', 3, 1, 'AVAILABLE', 2);
INSERT INTO public.rooms VALUES (13, '303', 3, 4, 'AVAILABLE', 2);
INSERT INTO public.rooms VALUES (14, '400', 4, 2, 'AVAILABLE', 3);
INSERT INTO public.rooms VALUES (15, '401', 4, 4, 'AVAILABLE', 3);
INSERT INTO public.rooms VALUES (16, '402', 4, 3, 'AVAILABLE', 3);
INSERT INTO public.rooms VALUES (17, '501', 5, 3, 'AVAILABLE', 4);
INSERT INTO public.rooms VALUES (18, '502', 5, 1, 'AVAILABLE', 4);
INSERT INTO public.rooms VALUES (19, '503', 5, 5, 'AVAILABLE', 4);
INSERT INTO public.rooms VALUES (20, '505', 5, 6, 'AVAILABLE', 4);
INSERT INTO public.rooms VALUES (21, '601', 4, 1, 'AVAILABLE', 5);
INSERT INTO public.rooms VALUES (22, '602', 4, 4, 'AVAILABLE', 5);
INSERT INTO public.rooms VALUES (23, '603', 4, 1, 'AVAILABLE', 5);
INSERT INTO public.rooms VALUES (24, '666', 4, 8, 'AVAILABLE', 5);
INSERT INTO public.rooms VALUES (25, '200', 2, 1, 'AVAILABLE', 6);
INSERT INTO public.rooms VALUES (26, '201', 2, 1, 'AVAILABLE', 6);
INSERT INTO public.rooms VALUES (27, '202', 2, 2, 'AVAILABLE', 6);

--
-- PostgreSQL database dump complete
--

