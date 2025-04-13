import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
    const [valueDebounce, setValueDebounce] = useState('');

    useEffect(() => {
        const handle = setTimeout(() => {
            setValueDebounce(value);
        }, delay); // Sửa lại: truyền delay là số, không phải mảng

        return () => {
            clearTimeout(handle);
        };
    }, [value, delay]); // Thêm delay vào dependency

    return valueDebounce;
};
