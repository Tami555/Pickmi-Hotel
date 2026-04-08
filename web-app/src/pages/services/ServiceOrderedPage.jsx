import React, { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { create_service, current_user_active_reservations, service_by_slug } from "../../api/services"
import { CommonBlock } from "../../components/layouts/CommonBlock"
import { ContentApiBlock } from "../../components/layouts/ContentApiBlock"
import { useFetch } from "../../hooks/useFetch"
import { PickMeButton } from "../../components/UI/buttons/PickMeButton"
import { formatDateToRussian } from "../../utils/formats/dates"
import { formatImageUrl } from "../../utils/formats/image"
import "./styles/service_ordered_page.css";
import { PickMeSelectedList } from "../../components/UI/feedback/PickMeSelectedList"


export const ServiceOrderedPage = () => {
    const params = useParams();
    const nav = useNavigate();

    const [service, setService] = useState({});
    const [getService, loadingService, errorServerService] = useFetch(
        async () => {
            const res = await service_by_slug(params.slug);
            setService(res);
        }
    );
    
    const [activeReservations, setActiveReservations] = useState([]);
    const [getActiveReservation, loadingReservation, errorServerReservation] = useFetch(
        async () => {
            const res = await current_user_active_reservations();
            setActiveReservations(res);
        }
    );

    // Состояния для выбранных значений
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [comment, setComment] = useState(''); // Добавляем комментарий
    
    // Доступные опции
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        getService();
        getActiveReservation();
    }, []);

    // список номеров для первого выпадающего списка
    const roomOptions = useMemo(() => {
        return activeReservations.map(res => ({
            id: res.id,
            displayValue: (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3>Номер {res.room.room_number}</h3>
                    <p>{formatDateToRussian(res.check_in_date)} - {formatDateToRussian(res.check_out_date)}</p>
                </div>
            ),
            rawValue: res
        }));
    }, [activeReservations]);

    // Генерация доступных дней при выборе брони
    useEffect(() => {
        if (!selectedReservation) {
            setAvailableDates([]);
            setSelectedDate(null);
            setAvailableTimes([]);
            setSelectedTime(null);
            return;
        }
        
        const checkIn = new Date(selectedReservation.rawValue?.check_in_date);
        const checkOut = new Date(selectedReservation.rawValue?.check_out_date);
        
        const dates = [];
        const now = new Date();
        const checkInDate = new Date(checkIn);
        let currentDate = checkInDate < now ? now : checkInDate;
        
        currentDate.setHours(0, 0, 0, 0);
        const checkOutCopy = new Date(checkOut);
        checkOutCopy.setHours(0, 0, 0, 0);
        
        while (currentDate <= checkOutCopy) {            
            dates.push({
                id: currentDate.toISOString(),
                displayValue: formatDateToRussian(currentDate),
                rawValue: new Date(currentDate)
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setAvailableDates(dates);
        setSelectedDate(null);
        setAvailableTimes([]);
        setSelectedTime(null);
    }, [selectedReservation]);

    // Генерация доступных временных слотов при выборе дня
    useEffect(() => {
        if (!selectedReservation || !selectedDate) {
            setAvailableTimes([]);
            setSelectedTime(null);
            return;
        }
        
        const times = [];
        const checkIn = new Date(selectedReservation.rawValue?.check_in_date);
        const checkOut = new Date(selectedReservation.rawValue?.check_out_date);
        
        // Генерируем время с 00:00 до 23:30 с интервалом в 30 минут
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                const selectedDateTime = new Date(selectedDate.rawValue);
                selectedDateTime.setHours(hour, minute, 0, 0);
                
                // Для последнего дня брони ограничиваем время
                const isLastDay = selectedDate.rawValue.toDateString() === checkOut.toDateString();
                const maxHour = isLastDay ? checkOut.getHours() : 23;
                const maxMinute = isLastDay ? checkOut.getMinutes() : 59;
                
                if (selectedDateTime >= checkIn && selectedDateTime <= checkOut) {
                    if (hour < maxHour || (hour === maxHour && minute <= maxMinute)) {
                        times.push({
                            id: timeString,
                            displayValue: timeString,
                            rawValue: timeString
                        });
                    }
                }
            }
        }   
        
        setAvailableTimes(times);
        setSelectedTime(null);
    }, [selectedReservation, selectedDate]);


    const [errorLocalOrderService, setErrorLocalOrderService] = useState()
    const [orderService, loadingOrderService, errorServerOrderService] = useFetch(
        async () => {

            const [hours, minutes] = selectedTime.rawValue.split(':');
            const year = selectedDate.rawValue.getFullYear();
            const month = String(selectedDate.rawValue.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.rawValue.getDate()).padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
        
            await create_service(service.id, selectedReservation.id, formattedDateTime, comment);
            nav('/users/profile')
        }
    );

    const handleOrder = () => {
        if (!selectedReservation || !selectedDate || !selectedTime) {
            setErrorLocalOrderService('Пожалуйста, выберите номер, дату и время');
            return;
        }
        orderService();
    };

    return (
        <CommonBlock back_button={true}>
            <ContentApiBlock 
                loading={loadingService || loadingReservation || loadingOrderService} 
                error={errorServerService || errorServerReservation}
            >
                <div className="ordered-main-block">
                    <h1>{service.title}</h1>
                    <img src={formatImageUrl(service.image)} alt={service.title}/>
                </div>
                
                <div className="order-block">
                    <h2>Заказать услугу: </h2>
                    <div className="order-data-block">
                        <PickMeSelectedList
                            label="Выберите номер:"
                            items={roomOptions}
                            selectedItem={selectedReservation}
                            setSelectedItem={setSelectedReservation}
                            placeholder="Выберите бронь"
                        />
                        
                        <PickMeSelectedList
                            label="Выберите дату:"
                            items={availableDates}
                            selectedItem={selectedDate}
                            setSelectedItem={setSelectedDate}
                            disabled={!selectedReservation}
                            placeholder="Сначала выберите номер"
                        />
                        
                        <PickMeSelectedList
                            label="Выберите время:"
                            items={availableTimes}
                            selectedItem={selectedTime}
                            setSelectedItem={setSelectedTime}
                            disabled={!selectedDate}
                            placeholder="Сначала выберите дату"
                        />                                
                        <PickMeButton onClick={handleOrder}>Заказать</PickMeButton>
                    </div>

                    <div className="comment-block">
                        <label className="comment-label">Комментарий к заказу:</label>
                        <textarea
                            className="comment-input"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Напишите пожелания, особые просьбы или дополнительную информацию..."
                            rows={4}
                        />
                    </div>
                    {errorServerOrderService && <p className="errors">{errorServerOrderService}</p>}
                    {errorLocalOrderService && <p className="errors">{errorLocalOrderService}</p>}
                </div>
            </ContentApiBlock>
        </CommonBlock>
    );
};