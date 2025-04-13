import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import {DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons"
import { Button, Form, Select, Space,} from "antd";
import TableComponent from "../TableComponent/TableComponent"; 
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from "../../components/LoadingComponent/Loading"
import * as message from '../../components/Message/Message'
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const user = useSelector((state) => state?.user)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: ''
    })

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: ''
    })


    const [form] = Form.useForm()


    const mutation = useMutationHooks(
        (data) => {
            const { name,
                price,
                description,
                rating,
                image,
                type,
                countInStock } = data
            const res = ProductService.createProduct({
                name,
                price,
                description,
                rating,
                image,
                type,
                countInStock
            })
            return res
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id,
                token,
                ...rests} = data
            const res = ProductService.updateProduct(
                id,
                token,
                {...rests})
            return res
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id,
                token,
            } = data
            const res = ProductService.deleteProduct(
                id,
                token)
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { token, ...ids
            } = data
            const res = ProductService.deleteManyProduct(
                ids,
                token)
            return res
        }
    )

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if(res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer ) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])
    
    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const handleDeleteManyProduct = (ids) => {
        mutationDeletedMany.mutate({ids: ids, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const {data, isLoading, isSuccess, isError} = mutation
    const {data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
    const {data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
    const {data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany

    const queryProduct = useQuery({queryKey: ['product'], queryFn: getAllProduct})
    const typeProduct = useQuery({queryKey: ['type-product'], queryFn: fetchAllTypeProduct})
    const {isLoading: isLoadingProducts, data: products} = queryProduct
    const renderAction = () => {
        return(
            <div>
                <EditOutlined style={{color: 'Orange', fontSize: '30px', cursor:'pointer'}} onClick={handleDetailsProduct} />
                <DeleteOutlined style={{color: 'red', fontSize: '30px', cursor:'pointer'}} onClick={() =>  setIsModalOpenDelete(true)} />
            </div>
        )
    }

    console.log('type', typeProduct)

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        //setSearchText(selectedKeys[0]);
        //setSearchedColumn(dataIndex);
      };
      const handleReset = (clearFilters) => {
        clearFilters();
        //setSearchText('');
      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <InputComponent
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={`${selectedKeys[0] || ''}`}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1890ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: '#ffc069',
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ''}
        //     />
        //   ) : (
        //     text
        //   ),
      });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                  text: '>= 500.000',
                  value: '>=',
                },
                {
                  text: '<= 500.000',
                  value: '<=',
                },
              ],
              onFilter: (value, record) => {
                if(value === '>=') {
                    return record.price >= 500.000
                }
                return record.price <= 500.000
              },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                  text: '>= 3',
                  value: '>=',
                },
                {
                  text: '<= 3',
                  value: '<=',
                },
              ],
              onFilter: (value, record) => {
                if(value === '>=') {
                    return Number(record.rating) >= 3
                }
                return Number(record.rating) <= 3
              },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {...product, key: product._id}
    })

    useEffect(() => {
    if (isSuccess) {
        if (data?.status === "OK") {
            message.success("Thành công!")
            handleCancel()
        } else {
            message.error(data?.message || "Có lỗi xảy ra")
        }
        mutation.reset()
    } else if (isError) {
        message.error("Lỗi hệ thống")
        mutation.reset()
    }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessDeletedMany) {
            if (dataDeletedMany?.status === "OK") {
                message.success("Thành công!")
            } else {
                message.error(data?.message || "Có lỗi xảy ra")
            }
            mutation.reset()
        } else if (isErrorDeletedMany) {
            message.error("Lỗi hệ thống")
            mutation.reset()
        }
        }, [isSuccessDeletedMany, isErrorDeletedMany])

    useEffect(() => {
        if (isSuccess) {
            if (dataDeleted?.status === "OK") {
                message.success("Thành công!")
                handleCancelDelete()
            } else {
                message.error(dataDeleted?.message || "Có lỗi xảy ra")
            }
            mutation.reset()
        } else if (isErrorDeleted) {
            message.error("Lỗi hệ thống")
            mutation.reset()
        }
        }, [isSuccessDeleted, isErrorDeleted])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false)
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: ''
        })
        form.resetFields()
    }

    useEffect(() => {
        if (isSuccessUpdated) {
            if (dataUpdated?.status === "OK") {
                message.success("Thành công!")
                handleCloseDrawer()
            } else {
                message.error(dataUpdated?.message || "Có lỗi xảy ra")
            }
            mutation.reset()
        } else if (isErrorUpdated) {
            message.error("Lỗi hệ thống")
            mutation.reset()
        }
    }, [isSuccessUpdated, isErrorUpdated])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () =>{
        mutationDeleted.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: ''
        })
        form.resetFields()
    }

    const onFinish = () => {
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm </WrapperHeader>
            <div style={{marginTop: '10px'}} >
                <Button style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize:'60px'}} /></Button>
            </div>
            <div style={{ marginTop: '20px'}}>
                <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                  return {
                    onClick: event => {
                        setRowSelected(record._id)
                    },
                  }  
                }}/>
            </div>
            <ModalComponent forceRender
                title="Tạo sản phẩm" 
                open={isModalOpen} 
                onCancel={handleCancel} 
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                      Cancel
                    </Button>
                    // Không có nút OK
                    ]}
                    >
                    {/* Form */}        
            <Loading isPending={isLoading}>
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                autoComplete="on"
                form={form}
            >
                <Form.Item 
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                >
                    <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
                </Form.Item>

                <Form.Item 
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                >
                    <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type" />
                </Form.Item>
                <Form.Item 
                    label="Count in Stock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Nhập số lượng sản phẩm' }]}
                >
                    <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
                </Form.Item>
                <Form.Item 
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                >
                    <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                </Form.Item>
                <Form.Item 
                    label="Rating"
                    name="rating"
                    rules={[{ required: true, message: 'Nhập đánh giá sản phẩm!' }]}
                >
                    <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                </Form.Item>
                <Form.Item 
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Nhập miêu tả sản phẩm!' }]}
                >
                    <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                </Form.Item>
                <Form.Item 
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Nhập ảnh của sản phẩm!' }]}
                >
                    <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                            <Button>Click to Upload</Button>
                            {stateProduct?.image && (
                            <img src={stateProduct?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px'
                            }} alt="avatar" />
                        )}
                        </WrapperUploadFile>
                </Form.Item>
                
                <Form.Item wrapperCol={{ offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
                <Loading isPending={isLoadingUpdate || isLoadingUpdated}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    onFinish={onUpdateProduct}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item 
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Nhập tên sản phẩm!' }]}
                    >
                        <InputComponent value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>

                    <Form.Item 
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Nhập loại sản phẩm!' }]}
                    >
                        {/* <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" /> */}
                        <Select
                            name="type"
                            //defaaultValue="lucy"
                            //style={{ width: 120}}
                            //onChange={handleChange}
                            options={renderOptions(typeProduct?.data?.data)}
                        />
                    </Form.Item>
                    <Form.Item 
                        label="Count in Stock"
                        name="countInStock"
                        rules={[{ required: true, message: 'Nhập số lượng sản phẩm' }]}
                    >
                        <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock"/>
                    </Form.Item>
                    <Form.Item 
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Nhập giá sản phẩm!' }]}
                    >
                        <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                    </Form.Item>
                    <Form.Item 
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Nhập đánh giá sản phẩm!' }]}
                    >
                        <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
                    </Form.Item>
                    <Form.Item 
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Nhập miêu tả sản phẩm!' }]}
                    >
                        <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                    </Form.Item>
                    <Form.Item 
                        label="Image"
                        name="image"
                        rules={[{ required: true, message: 'Nhập ảnh của sản phẩm!' }]}
                    >
                        <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1} showUploadList={false}>
                                <Button>Click to Upload</Button>
                                {stateProductDetails?.image && (
                                <img src={stateProductDetails?.image} style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: '10px'
                                }} alt="avatar" />
                            )}
                            </WrapperUploadFile>
                    </Form.Item>
                    
                    <Form.Item wrapperCol={{ offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender title="Xoá sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >   
            <Loading isPending={isLoadingDeleted}>
                <div>Bạn muốn xoá sản phẩm này ?</div>
            </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct


