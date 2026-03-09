import react, { useState } from "react";
import { FormContainer } from "./components/FormContainer";
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";
import { InputBlock } from "../../components/UI/inputs/InputBlock";
import { useFetch } from "../../hooks/useFetch";
import { registration } from "../../api/services";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/UI/feedback/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { useValidation } from "../../hooks/useValidation";
import { registrationSchema } from "../../utils/validators/schemas";


export const RegistrationPage = () => {
    const nav = useNavigate()
    const {setIsAuth} = useAuth()
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        patronymic: "",
        email: "",
        phone: "",
        passport_series: "",
        passport_number: "",
        password: "",
        repeat_password: "",
    })

    const [registration_func, loading, serverError] = useFetch(async () => 
        {
            const res = await registration(
                user.first_name,
                user.last_name,
                user.patronymic,
                user.email,
                user.phone,
                user.passport_series,
                user.passport_number,
                user.password
            )
            if (res){
                setIsAuth(true)
                nav('/')
            }
        }
    )

    // Локальные ошибки валидации   
    const { error: localError, validate } = useValidation();
    const handleRegistration = () => {
        if (!validate(user, registrationSchema)) return;
        registration_func();
    };

    return (
        <FormContainer form_title={"Регистрация"}>

            <InputBlock
                label="Имя"
                name="first_name"
                type="text"
                value={user.first_name}
                onChange={e => setUser({...user, first_name: e.target.value})}
                placeholder="введите ваше имя"
            />

           <InputBlock
                label="Фамилия"
                name="last_name"
                type="text"
                value={user.last_name}
                onChange={e => setUser({...user, last_name: e.target.value})}
                placeholder="введите вашу фамилию"
            />

            <InputBlock
                label="*Отчество"
                name="patronymic"
                type="text"
                value={user.patronymic}
                onChange={e => setUser({...user, patronymic: e.target.value})}
                placeholder="введите ваше отчество (не обязательно для заполнения)"
            />

            <InputBlock
                label="Почта"
                name="email"
                type="email"
                value={user.email}
                onChange={e => setUser({...user, email: e.target.value})}
                placeholder="your@email.com"
            />

            <InputBlock
                label="Телефон"
                name="phone"
                type="text"
                value={user.phone}
                onChange={e => setUser({...user, phone: e.target.value})}
                placeholder="введите ваш номер телефона (+7xxxxxxxxxx)"
            />

            <InputBlock
                label="Серия паспорта"
                name="passport_series"
                type="text"
                value={user.passport_series}
                onChange={e => setUser({...user, passport_series: e.target.value})}
                placeholder="введите вашу серию паспорта (4 символа)"
            />

            <InputBlock
                label="Номер паспорта"
                name="passport_number"
                type="text"
                value={user.passport_number}
                onChange={e => setUser({...user, passport_number: e.target.value})}
                placeholder="введите ваш номер паспорта (6 символов)"
            />

            <InputBlock
                label="Пароль"
                name="password"
                type="password"
                value={user.password}
                onChange={e => setUser({...user, password: e.target.value})}
                placeholder="введите пароль (минимум 8 символов)"
            />

            <InputBlock
                label="Повторите Пароль"
                name="repeat_password"
                type="password"
                value={user.repeat_password}
                onChange={e => setUser({...user, repeat_password: e.target.value})}
                placeholder="повторите ваш пароль"
            />

            {/* локальные ошибки */}
            {localError && <p className="errors">{localError}</p>}

            {/* Серверные ошибки */}
            {serverError && <p className="errors">{serverError}</p>}
            
            {/* Загрузка */}
            {loading && <Loader/>}
            <PickMeButton onClick={handleRegistration}>Зарегистрироваться</PickMeButton>
            <p className='reverse-block'>
                Уже есть аккаунт? 
                <Link to='/users/login' className='link'>Войти</Link>
            </p>
        </FormContainer>
    )
}