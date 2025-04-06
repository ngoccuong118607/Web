import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputFrom from '../../components/InputFrom/InpurFrom'
import imageLogo from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { Image } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/UserSlide';

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] =useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )
    const {data, isLoading, isSuccess, isError} = mutation

    useEffect(() => {
        if(isSuccess){
            navigate('/')
            console.log('data', data)
            localStorage.setItem('accessToken', data?.data?.accessToken)
            if(data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                console.log('decode', decoded);
                if(decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            } 
        }
    }, [isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
        console.log('res', res)
    }

    console.log('mutation', mutation)

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        mutation.mutate ({ 
            email, 
            password 
        })
        console.log('sign-in', email, password)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background:'rgba(0, 0, 0, 0.53)', height:'100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius:'6px', background: '#fff', display: 'flex' }}>
            <WrapperContainerLeft>
                <h1>Xin chào</h1>
                <p>Đăng nhập hoặc tạo tài khoản</p>
                <InputFrom style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
                <div style={{ position: "relative" }}>
                    <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                            zIndex: 10,
                            position: "absolute",
                            top: "4px",
                            right: "8px",
                        }}
                    >
                        {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                    </span>
                    <InputFrom 
                        placeholder="password" 
                        type={isShowPassword ? "text" : "password"} 
                        value={password} 
                        onChange={handleOnchangePassword} 
                    />
                </div>
                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <Loading isPending={mutation.isPending}>
                <ButtonComponent
                    disabled={!email.length || !password.length }
                    onClick={handleSignIn}
                    size={40}
                    styleButton={{
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 0px',
                        background: 'rgb(255, 57, 69)' // Thêm thuộc tính background
                    }}
                    textButton={'Đăng nhập'}
                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
                </Loading>
                <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px"/>
                    <h4>Mua sắm tại đây MERN</h4>
            </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage