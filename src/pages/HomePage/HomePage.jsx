import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import slider4 from "../../assets/images/slider4.webp";
import slider5 from "../../assets/images/slider5.webp";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(6);
  const [TypeProducts, setTypeProducts] = useState([]);

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const { isLoading, data: products, isPreviousData } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <>
      <Loading isPending={isLoading || loading}>
        <div style={{ width: "1270px", margin: "0 auto" }}>
          <WrapperTypeProduct>
            {TypeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </div>
        <div className="body" style={{ width: "100%", backgroundColor: "#efefef" }}>
          <div id="container" style={{ height: "1000px", width: "1270px", margin: "0 auto" }}>
            <SliderComponent arrImages={[slider1, slider2, slider3, slider4, slider5]} />
            <WrapperProducts>
              {products?.data?.map((product) => (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              ))}
            </WrapperProducts>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <WrapperButtonMore
                textbutton={isPreviousData ? "Load more" : "Xem thêm"}
                type="outline"
                styleButton={{
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                onClick={() => setLimit((prev) => prev + 7)}
              />
            </div>
          </div>
        </div>
      </Loading>
      <FooterComponent /> 
    </>
  );
};

export default HomePage;