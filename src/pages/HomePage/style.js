import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: 44px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &.ant-btn {
    color: rgb(11, 116, 229);
    background: transparent;
    border: 1px solid rgb(11, 116, 229);
    transition: all 0.3s ease;

    span {
      color: rgb(11, 116, 229);
    }

    &:hover:not(:disabled) {
      background: rgb(13, 92, 182);
      color: #fff;
      span {
        color: #fff;
      }
    }

    &:disabled {
      background: #ccc;
      border-color: #ccc;
      color: #fff;
      span {
        color: #fff;
      }
    }
  }

  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
`;