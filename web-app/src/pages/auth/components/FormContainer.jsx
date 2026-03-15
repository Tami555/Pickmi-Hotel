import { BackStepButton } from '../../../components/UI/buttons/BackStepButton';
import '../styles/form_container.css';


export const FormContainer = ({children, form_title})  => {
  return (
    <div className='form-conteiner-block'>
      <BackStepButton path={"/"}/>
      <h1 className='main-title'>Your Pickmi</h1>

      <div className='form-block'>
        <h2 className='main-title'>{form_title}</h2>
        {children}
      </div>
    </div>
  );
}