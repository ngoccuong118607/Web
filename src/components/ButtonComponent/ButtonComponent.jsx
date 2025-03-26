import { Button } from 'antd';
import React from 'react';

const ButtonComponent = ({ size, styleButton, StyleTextButton, textButton, ...rests }) => {
    return (
        <Button 
            size={size} 
            style={styleButton}
            {...rests}
        >
            <span style={StyleTextButton}>{textButton}</span>
        </Button>
    )
}


export default ButtonComponent;
