import { Image } from "antd";
import React from "react";
import { WrapperSliderStyle } from "./style";

const SliderComponent = ({ arrImages = [] }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,  // Số lượng ảnh hiển thị cùng lúc
        slidesToScroll: 1,
        autoplay: true, // Tự động chạy
        autoplaySpeed: 1000, // Chạy sau 3 giây
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2, // Khi màn hình nhỏ hơn 1024px, hiển thị 2 ảnh
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1, // Khi màn hình nhỏ hơn 600px, hiển thị 1 ảnh
                }
            }
        ]
    };

    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image, index) => (
                <div key={index}>
                    <Image src={image} alt={`slider-${index}`} preview={false} style={{ width: "100%"}} />
                </div>
            ))}
        </WrapperSliderStyle>
    );
};

export default SliderComponent;
