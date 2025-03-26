import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: rgb(26, 148, 255);
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 1270px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
`;

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
`;

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    
    div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
`;
