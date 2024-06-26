import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import './sign-in.scss';

import ContainerForms from '../../shared/UI/container-forms/container-forms';
import { PATHNAMES } from '../../shared/consts/routes';
import Input from '../../shared/UI/input/input';
import InputPassWord from '../../shared/UI/input-password/input-password';
import Button from '../../shared/UI/button/button';
import { FormDataModel, FormDataValidModel } from '../../core/models/FormData.models';
import { emailRgx } from '../../shared/consts/regex-email';
import { Password, emailValid, singInError } from '../../shared/consts/messages';
import { PasswordRegex } from '../../shared/consts/regex-password';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { fetchAuthUser } from '../../redux/actions/authAction';
import SinnerBtn from '../../shared/UI/spinner-btn/spinner-btn';
import { KEY_AUTH } from '../../redux/slices/authUserSlice';
import { setUsers } from '../../core/services/localstorage.services';
import { ResetState } from '../../redux/actions/ResetState';

const SignIN: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormDataModel>({
    email: '',
    password: '',
  });
  const [notValid, setNotValid] = useState<FormDataValidModel>({
    email: false,
    password: false,
  });
  const {isSuccess, isLoading, isError, date} = useAppSelector(state => state[KEY_AUTH]);


  useEffect(() => {
    if (typeof date !== 'undefined' && isSuccess) {
      setUsers(date);
      navigate(`/${PATHNAMES.favorites}`);
    };

    return () => {
      dispatch(ResetState())
    }

  }, [date, isSuccess]);

  const onCheckValidPassWord = () => {
    const cloneValid = {...notValid};
      const value = PasswordRegex.length_password.test(formData.password);
      cloneValid.password = value ? 
        cloneValid.password = false: cloneValid.password = true;
    setNotValid(cloneValid);
  };

  const onCheckValidEmail = () => {
    const cloneValid = {...notValid};
      const value = emailRgx.test(formData.email);
      cloneValid.email = value ? 
        cloneValid.email = false: cloneValid.email = true;
    setNotValid(cloneValid);
  };

  useEffect(() => {
    if (!!formData.email) onCheckValidEmail();
  }, [formData.email]);

  useEffect(() => {
    if (!!formData.password) onCheckValidPassWord();
  }, [formData.password]);

  const onHandlerEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const cloneDate = {...formData};
    cloneDate.email = e.target.value;
    setFormData(cloneDate)
  };

  const onHandlerPassWord = (e: ChangeEvent<HTMLInputElement>) => {
    const cloneDate = {...formData};
    cloneDate.password = e.target.value;
    setFormData(cloneDate);
  };

  const onCheckValidField = (): boolean[] => {
    const email = emailRgx.test(formData.email);
    const password = PasswordRegex.length_password.test(formData.password);
    const cloneValid = {...notValid};
    cloneValid.email = email ? 
      cloneValid.email = false: cloneValid.email = true;

    cloneValid.password = password ? 
      cloneValid.password = false: cloneValid.password = true;

    setNotValid(cloneValid);

    return [email, password];
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fieldValid = onCheckValidField().every(Boolean);
    if (fieldValid) {
      dispatch(fetchAuthUser(formData));
    };
  };

  return (
    <>
      <ContainerForms 
        title={'Sign In'} 
        link={`/${PATHNAMES.sign_up}`} 
        titleLink={'Now Sign Up'}
        styleForms={{height: '500px'}}
        onSubmit={onSubmit}
        classForm='sing_in'
      >
        <Input 
          placeholder='Email' 
          notValid={notValid.email}
          onChange={onHandlerEmail}
          onBlur={onCheckValidEmail}
          styleConf={{padding:'2.2% 2%', borderRadius: "20px"}}
          styles={{maxWidth: '100%'}}
        >
          {notValid.email && <span className='requirements'>{emailValid}</span>}
        </Input>
        <InputPassWord 
            label='Password' 
            placeholder='Password' 
            onChange={onHandlerPassWord}
            onBlur={onCheckValidPassWord}
            notValid={notValid.password}
          >
            {notValid.password && <span className='requirements'>{Password}</span>}
          </InputPassWord>
          {isError && <span className='message-error'>{singInError}</span>}
          <Button 
            isLoading={isLoading}
            title={'Sign In'} 
            type='submit'
            className={isLoading ? 'pink' : 'green'}
            style={{maxWidth: '93%', padding: '0.6rem 0'}}
          >
            <SinnerBtn/>
          </Button>
      </ContainerForms>
    </>
  )
};

export default SignIN;
