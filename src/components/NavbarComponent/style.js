import styled from "styled-components";

export const WrapperLabelText = styled.h4`
    color: rgb(55, 56, 61);
    font-size: 14px;
    font-weight: 500;
`;
export const WrapperTextValue = styled.span`
    color: rgb(55, 56, 61);
    font-size: 12px;
    font-weight: 400;
    display: block; /* Đảm bảo xuống dòng */
`;


export const WrapperContent = styled.div`
    display: flex;
    align-items: flex-start; /* Đổi từ center thành flex-start */
    flex-direction: column;
    gap: 12px;
    width: 100%; /* Đảm bảo full width */
`;

export const WrapperTextPrice = styled.div`
    padding: 4px;
    color: rgb(56, 56, 61);
    border-radius: 10px;
    background-color: rgb(238, 238, 238);
    width: fit-content;
`;
