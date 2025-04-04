import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputFrom from '../../components/InputFrom/InpurFrom'
import imageLogo from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { Image } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] =useState(false)
    const navigate = useNavigate()
    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background:'rgba(0, 0, 0, 0.53)', height:'100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius:'6px', background: '#fff', display: 'flex' }}>
            <WrapperContainerLeft>
                <h1>Xin chào</h1>
                <p>Đăng nhập hoặc tạo tài khoản</p>
                <InputFrom style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" />
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
                    <InputFrom placeholder="password" type={isShowPassword ? "text" : "password"} />
                </div>
                <ButtonComponent
                    bordered={false}
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
                />
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