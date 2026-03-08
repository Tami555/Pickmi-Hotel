import react, { useState } from "react";
import { FormContainer } from "./components/FormContainer";
import { PickMeButton } from "../../components/UI/buttons/PickMeButton";
import { InputBlock } from "../../components/UI/inputs/InputBlock";


export const LoginPage = () => {
    const [UserLogin, SetUserLogin] = useState({email: "", password: ""})

    return (
        <FormContainer form_title={"Вход"}>
            <InputBlock
                label="Почта"
                name="email"
                type="email"
                value={UserLogin.email}
                onChange={e => SetUserLogin({...UserLogin, email: e.target.value})}
                placeholder="your@email.com"
            />

            <InputBlock
                label="Пароль"
                name="password" 
                type="password"
                value={UserLogin.password}
                onChange={e => SetUserLogin({...UserLogin, password: e.target.value})}
                placeholder="введите свой пароль"
            />
            <PickMeButton>Войти</PickMeButton>
        </FormContainer>
    )
}