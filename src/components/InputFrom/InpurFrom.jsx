import React from "react";
import { WrapperInputStyle } from "./style";

const InputFrom = ({ placeholder = "Nhập text", style, value, onChange, ...rests }) => {
    return (
        <WrapperInputStyle
            placeholder={placeholder}
            value={value} // Sử dụng value từ props
            onChange={onChange} // Sử dụng onChange từ props
            style={style}
            {...rests}
        />
    );
};

export default InputFrom;