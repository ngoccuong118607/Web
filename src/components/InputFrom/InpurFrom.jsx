import React, { useState } from "react"
import { WrapperInputStyle } from "./style"

const InputFrom = (props) => {
    const [valueInput, setValueInput] = useState('')
    const { placeholder = "Nhập text", style, ...rests } = props

    return (
        <WrapperInputStyle 
            placeholder={placeholder} 
            value={valueInput} 
            {...rests} 
            style={style} // Đảm bảo style được truyền vào đây
        />
    )
}

export default InputFrom
