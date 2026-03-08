import react, { useEffect, useState } from "react";
import { FormContainer } from "./components/FormContainer";
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";
import { InputBlock } from "../../components/UI/inputs/InputBlock";
import { useFetch } from "../../hooks/useFetch";
import { login } from "../../api/services";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/UI/feedback/Loader";
import { useAuth } from "../../contexts/AuthContext";


export const LoginPage = () => {
    const nav = useNavigate()
    const {setIsAuth} = useAuth()
    const [userLogin, setUserLogin] = useState({email: "", password: ""})

    const [login_func, loading, serverError] = useFetch(async () => 
        {
            const res = await login(userLogin.email, userLogin.password)
            if (res){
                setIsAuth(true)
                nav('/')
            }
        }
    )

    return (
        <FormContainer form_title={"Вход"}>
            <InputBlock
                label="Почта"
                name="email"
                type="email"
                value={userLogin.email}
                onChange={e => setUserLogin({...userLogin, email: e.target.value})}
                placeholder="your@email.com"
            />

            <InputBlock
                label="Пароль"
                name="password" 
                type="password"
                value={userLogin.password}
                onChange={e => setUserLogin({...userLogin, password: e.target.value})}
                placeholder="введите свой пароль"
            />
            {/* Серверные ошибки */}
            {serverError && <p className="errors">{serverError}</p>}
            
            {/* Загрузка */}
            {loading && <Loader/>}
            <PickMeButton onClick={login_func}>Войти</PickMeButton>
        </FormContainer>
    )
}