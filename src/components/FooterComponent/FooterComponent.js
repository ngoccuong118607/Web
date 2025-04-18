import React from "react";
import styled from "styled-components";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Cần cài đặt react-icons: npm install react-icons

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 40px 0;
`;

const FooterContainer = styled.div`
  width: 1270px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const FooterLink = styled.a`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(11, 116, 229);
  }
`;

const FooterContact = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIcon = styled.a`
  font-size: 20px;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(11, 116, 229);
  }
`;

const FooterBottom = styled.div`
  width: 100%;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
`;

const FooterBottomText = styled.p`
  font-size: 12px;
  color: #999;
`;

const FooterComponent = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterColumn>
          <FooterTitle>Cửa hàng</FooterTitle>
          <FooterLink href="#">Tất cả sản phẩm</FooterLink>
          <FooterLink href="#">Danh mục</FooterLink>
          <FooterLink href="#">Sản phẩm mới</FooterLink>
          <FooterLink href="#">Bán chạy</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Hỗ trợ</FooterTitle>
          <FooterLink href="#">Câu hỏi thường gặp</FooterLink>
          <FooterLink href="#">Vận chuyển & Đổi trả</FooterLink>
          <FooterLink href="#">Liên hệ</FooterLink>
          <FooterLink href="#">Điều khoản & Điều kiện</FooterLink>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Liên hệ</FooterTitle>
          <FooterContact>Email: support@shop.com</FooterContact>
          <FooterContact>Điện thoại: 0123 456 789</FooterContact>
          <FooterContact>Địa chỉ: 123 Đường ABC, TP.HCM</FooterContact>
        </FooterColumn>
        <FooterColumn>
          <FooterTitle>Theo dõi chúng tôi</FooterTitle>
          <SocialIcons>
            <SocialIcon href="#"><FaFacebook /></SocialIcon>
            <SocialIcon href="#"><FaTwitter /></SocialIcon>
            <SocialIcon href="#"><FaInstagram /></SocialIcon>
          </SocialIcons>
        </FooterColumn>
      </FooterContainer>
      <FooterBottom>
        <FooterBottomText>© 2025 Project Shop. All Rights Reserved.</FooterBottomText>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default FooterComponent;