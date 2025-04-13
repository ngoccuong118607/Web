import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./utils";
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "./redux/slides/userSlide";
import Loading from "./components/LoadingComponent/Loading";

function App() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        setIsLoading(true);
        const { storageData, decoded } = handleDecoded();
        if (decoded?.id) {
            handleGetDetailsUser(decoded?.id, storageData);
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleDecoded = () => {
        let storageData = localStorage.getItem('accessToken');
        let decoded = {};
        if (storageData && isJsonString(storageData)) {
            storageData = JSON.parse(storageData);
            decoded = jwtDecode(storageData);
        }
        return { decoded, storageData };
    };

    UserService.axiosJWT.interceptors.request.use(async (config) => {
        const currentime = new Date();
        const { decoded } = handleDecoded();
        if (decoded?.exp < currentime.getTime() / 1000) {
            const data = await UserService.refreshToken();
            config.headers['token'] = `Bearer ${data?.accessToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const handleGetDetailsUser = async (id, token) => {
        try {
            const res = await UserService.getDetailsUser(id, token);
            const decoded = jwtDecode(token);
            dispatch(updateUser({ ...res?.data, access_token: token, isAdmin: decoded?.isAdmin }));
        } catch (error) {
            console.error('Error getting user details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isAuthenticated = !!user?.access_token;
    const isAdmin = user?.isAdmin;

    console.log('User in App.js:', user); // Thêm log để debug

    return (
        <div>
            <Loading isPending={isLoading}>
                <Router>
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.page;
                            const Layout = route.isShowHeader ? DefaultComponent : Fragment;

                            if (route.isPrivate) {
                                if (!isAuthenticated) {
                                    return <Route key={route.path} path={route.path} element={<Navigate to="/sign-in" />} />;
                                }
                                if (!isAdmin) {
                                    return <Route key={route.path} path={route.path} element={<Navigate to="/" />} />;
                                }
                            }

                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        <Layout isPending={isLoading}>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </Router>
            </Loading>
        </div>
    );
}

export default App;