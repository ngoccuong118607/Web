import React, { useState } from 'react';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputFrom from '../../components/InputFrom/InpurFrom'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'

const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] =useState(false)
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background:'rgba(0, 0, 0, 0.53)', height:'100vh'}}>
            <div style={{ width: '800px', height: '445px', borderRadius:'6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                <h1>Xin chào</h1>
                <p>Đăng ký và tạo tài khoản</p>
                <InputFrom style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" />
                <div style={{ position: "relative" }}>
                    <span
                        style={{
                            zIndex: 10,
                            position: "absolute",
                            top: "4px",
                            right: "8px",
                        }}
                    >
                        {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                    </span>
                    <InputFrom placeholder="Password" type={isShowPassword ? "text" : "Password"} />
                </div>
                <div style={{ position: "relative" }}>
                    <span
                        style={{
                            zIndex: 10,
                            position: "absolute",
                            top: "4px",
                            right: "8px",
                        }}
                    >
                        {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                    </span>
                    <InputFrom placeholder="Confirm password" type={isShowPassword ? "text" : "Confirm password"} />
                </div>
                <ButtonComponent 
                    bordered = {false}
                    size={40}
                    styleButton={{ 
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        margin: '26px 0 0px'
                    }}
                    textButton={"Đăng nhập"}
                    styleTextButton={{ color: '#fff', fontSize:'15px', fontWeight:'700' }} 
                ></ButtonComponent>
                <p>Bạn đã có tài khoản? <WrapperTextLight>Đăng nhập</WrapperTextLight></p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
                <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px"/>
                <h4>Mua sắm tại đây MERN</h4>
            </WrapperContainerRight>
        </div>
    </div>
    )
}

export default SignUpPage