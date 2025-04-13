import { Table } from 'antd';
import React, { useState } from 'react'
import Loading from "../../components/LoadingComponent/Loading"

const TableComponent = (props) => {
    const { selectionType = 'checkbox',  data = [], isLoading = false, columns =[], handleDeleteMany } = props
    const [rowSelectedRowKeys, setRowSelectedKeys] = useState([])

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     name: record.name,
        // }),
    }; 

    const handleDeleteAll =  () => {
        handleDeleteMany(rowSelectedRowKeys)
    }

    return (
        <Loading isPending={isLoading}>
            {rowSelectedRowKeys.length > 0 && (
                <div style = {{
                    background: '#1d1ddd',
                    color: '#fff', 
                    fontWeight: 'bold', 
                    padding:'10px', 
                    cursor: 'pointer'
                    }}
                    onClick={handleDeleteAll}
                    >
                    Xoá tất cả
                </div>
            )}
            
            <Table
                rowSelection = {{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns = {columns}
                dataSource= {data}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent