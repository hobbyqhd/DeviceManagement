import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/devices');
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('获取设备列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    } else {
      setSortField(null);
      setSortOrder(null);
    }
  };

  const columns = [
    {
      title: '设备编号',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortOrder: sortField === 'code' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortField === 'name' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortOrder: sortField === 'type' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortOrder: sortField === 'status' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      sorter: (a, b) => (a.location || '').localeCompare(b.location || ''),
      sortOrder: sortField === 'location' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a, b) => (a.owner || '').localeCompare(b.owner || ''),
      sortOrder: sortField === 'owner' ? sortOrder : null,
      showSorterTooltip: true,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.code)}>
          删除
        </Button>
      ),
    },
  ];

  const handleDelete = async (code) => {
    if (window.confirm('确定要删除该设备吗？')) {
      try {
        const response = await fetch(`http://localhost:8080/api/devices/${code}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          message.success('设备删除成功');
          fetchDevices(); // 刷新设备列表
        } else {
          const errorData = await response.json();
          message.error(errorData.error || '设备删除失败');
        }
      } catch (error) {
        console.error('删除设备时出错:', error);
        message.error('删除设备时出错');
      }
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={devices}
      loading={loading}
      onChange={handleTableChange}
      rowKey="code"
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};

export default DeviceList;