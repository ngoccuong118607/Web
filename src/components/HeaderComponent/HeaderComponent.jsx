import { Badge, Button, Col, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('') 
    const [userAvatar, setUserAvatar] = useState('') 
    const [search, setSearch] = useState('')
    const order = useSelector ((state) => state.order)
    const [loading, setLoading] = useState(false)
    const handleNavigateLogin = ()=> {
        navigate('/sign-in') 
    }

    const handleLogout = async() => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    },[user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
        </div>
    );
    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}>
            <WrapperHeader>
                <Col span={5}>
                    <WrapperTextHeader>MERN</WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13}>
                        <ButtonInputSearch
                            size="large"
                            textButton="Tìm kiếm"
                            placeholder="input search text"
                            onChange={onSearch}
                        />
                    </Col>
                )}
                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center'}}>
                <Loading isPending={loading} >
                    <WrapperHeaderAccout>
                        {userAvatar? (
                            <img src={userAvatar} alt="avatar" style={{
                                height: '30px',
                                width: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }} />
                        ) : (
                            <UserOutlined style={{ fontSize: '30px' }} />
                        )}
                        {user?.access_token ? (
                            <>
                                <Popover content={content} trigger="click">
                                    <div style={{ cursor: 'pointer' }}>{userName?.length ?  userName : user?.email}</div>
                                </Popover>
                            </>
                           ) : (
                            <div onClick={handleNavigateLogin} style={{ cursor: 'pointer'}} >
                            <WrapperTextHeaderSmall>Đăng nhập/ Đăng ký</WrapperTextHeaderSmall>
                            <div>
                                <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                                <CaretDownOutlined />
                            </div>
                        </div>
                        )}
                    </WrapperHeaderAccout>
                </Loading>
                {!isHiddenCart && (
                    <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                        <Badge count={order?.orderItems?.length} size="small">
                            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        </Badge>
                        <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div> 
                )}
                </Col>
            </WrapperHeader>
        </div>
    );
}

export default HeaderComponent;
