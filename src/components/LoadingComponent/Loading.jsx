import React from 'react';
import { Spin } from 'antd';

const Loading = ({ isLoading, children }) => {
    return (
        <>
            {isLoading && <Spin size="large" style={{ marginRight: '10px' }} />}
            {children}
        </>
    );
};

export default Loading;