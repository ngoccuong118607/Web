import { Button } from 'antd';
import React from 'react';

const ButtonComponent = ({ size, styleButton, StyleTextButton, textButton, disabled, ...rests }) => {
    return (
        <Button
            style ={{
                ...styleButton,
                background: disabled ? '#ccc' : styleButton.background,
            }}
            size={size} 
            {...rests}
        >
            <span style={StyleTextButton}>{textButton}</span>
        </Button>
    )
}


export default ButtonComponent;
