import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import * as message from "../../components/Message/Message";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const getAllUsers = async () => {
    const token = user?.access_token;
    if (!token) {
      message.error("Vui lòng đăng nhập lại!");
      window.location.href = "/login";
      return;
    }
    try {
      const res = await UserService.getAllUser(token);
      console.log("API Response:", res);
      return res;
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      }
      throw error;
    }
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    if (!user?.access_token) {
      message.error("Vui lòng đăng nhập lại!");
      window.location.href = "/login";
      return;
    }
    setIsLoadingUpdate(true);
    try {
      const res = await UserService.getDetailsUser(rowSelected, user?.access_token);
      if (res?.data) {
        setStateUserDetails({
          name: res?.data?.name,
          email: res?.data?.email,
          phone: res?.data?.phone,
          isAdmin: res?.data?.isAdmin,
        });
      }
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết người dùng!");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [stateUserDetails]);

  const handleDetailsUser = () => {
    setIsOpenDrawer(true);
  };

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany;

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    onError: (error) => {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/login";
      } else {
        message.error("Lỗi khi lấy dữ liệu người dùng!");
      }
    },
  });

  const { isLoading: isLoadingUsers, data: users } = queryUser;

  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: "Orange", fontSize: "30px", cursor: "pointer" }} onClick={handleDetailsUser} />
        <DeleteOutlined style={{ color: "red", fontSize: "30px", cursor: "pointer" }} onClick={() => setIsModalOpenDelete(true)} />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        { text: "True", value: "TRUE" },
        { text: "False", value: "FALSE" },
      ],
      onFilter: (value, record) => record.isAdmin === value,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable = Array.isArray(users?.data)
    ? users.data.map((user) => ({
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      }))
    : [];

  console.log("Access Token:", user?.access_token);
  console.log("Users:", users);
  console.log("DataTable:", dataTable);

  useEffect(() => {
    if (isSuccessDeleted) {
      if (dataDeleted?.status === "OK") {
        message.success("Thành công!");
        handleCancelDelete();
      } else {
        message.error(dataDeleted?.message || "Có lỗi xảy ra");
      }
      mutationDeleted.reset();
    } else if (isErrorDeleted) {
      message.error(dataDeleted?.message || "Lỗi hệ thống");
      mutationDeleted.reset();
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany) {
      if (dataDeletedMany?.status === "OK") {
        message.success("Thành công!");
      } else {
        message.error(dataDeletedMany?.message || "Có lỗi xảy ra");
      }
      mutationDeletedMany.reset();
    } else if (isErrorDeleted) {
      message.error(dataDeletedMany?.message || "Lỗi hệ thống");
      mutationDeletedMany.reset();
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated) {
      if (dataUpdated?.status === "OK") {
        message.success("Thành công!");
        handleCloseDrawer();
      } else {
        message.error(dataUpdated?.message || "Có lỗi xảy ra");
      }
      mutationUpdate.reset();
    } else if (isErrorUpdated) {
      message.error(dataUpdated?.message || "Lỗi hệ thống");
      mutationUpdate.reset();
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    if (!user?.access_token) {
      message.error("Vui lòng đăng nhập lại!");
      window.location.href = "/login";
      return;
    }
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    if (!user?.access_token) {
      message.error("Vui lòng đăng nhập lại!");
      window.location.href = "/login";
      return;
    }
    console.log("Data to update:", stateUserDetails);
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          isLoading={isLoadingUsers}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <DrawerComponent title="Chi tiết người dùng" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isPending={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Nhập tên người dùng!" }]}>
              <InputComponent value={stateUserDetails["name"]} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Nhập email người dùng!" }]}>
              <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Nhập số điện thoại người dùng" }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Xoá người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isPending={isLoadingDeleted}>
          <div>Bạn muốn xoá người dùng này ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;