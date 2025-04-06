import { Badge, Col } from 'antd';
import React from 'react';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const HeaderComponent = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
    const handleNavigateLogin = ()=> {
        navigate('/sign-in')
    }
    console.log('user', user)
    return (
        <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}>
            <WrapperHeader>
                <Col span={5}>
                    <WrapperTextHeader>MERN</WrapperTextHeader>
                </Col>
                <Col span={13}>
                    <ButtonInputSearch
                        size="large"
                        textButton="Tìm kiếm"
                        placeholder="input search text"
                        // onSearch={onSearch}
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center'}}>
                    <WrapperHeaderAccout>
                        <UserOutlined style={{ fontSize: '30px' }} />
                        {user?.email ? (
                            <div style={{ cursor: 'pointer'}} >{user.name?.trim()}</div>
                        ) : (
                            <div onClick={handleNavigateLogin} style={{ cursor: 'pointer'}} >
                            <WrapperTextHeaderSmall>Đăng nhập/ Đăng ký</WrapperTextHeaderSmall>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>Tài khoản</span>
                                <CaretDownOutlined style={{ fontSize: '14px', marginTop: '0px' }} />
                            </div>
                        </div>
                        )}
                    </WrapperHeaderAccout>
                    <div>
                        <Badge count={4} size="small">
                            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        </Badge>
                        <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div>
                </Col>
            </WrapperHeader>
        </div>
    );
}

export default HeaderComponent;
