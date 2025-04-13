import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscoutText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style";
import {StarFilled} from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import { useNavigate } from "react-router-dom";

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, selled, discount, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ with: '200px', height:'200px'}}
            style={{ width: 200 }}
            bodyStyle={{padding:'10px'}}
            cover={
                <img 
                    alt="example" 
                    src={image} 
                />
            }
            onClick={() => handleDetailsProduct(id)}
        >
            <img alt=""
                src ={logo}
                style={{ 
                    width:'68px', height: '14px', position: 'absolute', top: -1, left: -1,
                    borderTopLeftRadius: '3px'

                }}
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight:'4px'}}>
                    <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)'}} /> 
                </span>
                <WrapperStyleTextSell> | Đã bán {selled || 1000 }+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{price?.toLocaleString()}</span>
                <WrapperDiscoutText>
                    - {discount || 5} %
                </WrapperDiscoutText> 
            </WrapperPriceText>
            
        </WrapperCardStyle>
    );
};

export default CardComponent;
