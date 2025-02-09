import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Table, Space, Select, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import DeviceOverview from './components/DeviceOverview';
import DeviceForm from './components/DeviceForm';

const { Header, Content } = Layout;
const { Search } = Input;

const App = () => {
  const [isDeviceFormVisible, setIsDeviceFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [isViewDeviceFormVisible, setIsViewDeviceFormVisible] = useState(false);

  // 获取设备类型列表
  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/device-types');
      const types = await response.json();
      setDeviceTypes(types);
    } catch (error) {
      console.error('获取设备类型失败:', error);
    }
  };

  // 组件加载时获取设备类型数据
  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  // 获取设备列表
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/devices');
      const devices = await response.json();
      setData(devices.map(device => ({
        key: device.code,
        name: device.name,
        type: device.type,
        status: device.status,
        location: device.location,
        owner: device.owner,
        department: device.department ? device.department.name : ''
      })));
    } catch (error) {
      console.error('获取设备列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/departments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('获取部门列表失败:', error);
      message.error('获取部门列表失败');
    }
  };

  // 组件加载时获取部门列表和设备列表
  useEffect(() => {
    fetchDepartments();
    fetchDevices();
  }, []);

  // 处理部门选择
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    filterData(searchKeyword, selectedDeviceType, selectedStatus, value);
  };

  // 处理搜索和筛选
  const handleSearch = (value) => {
    setSearchKeyword(value);
    filterData(value, selectedDeviceType, selectedStatus);
  };

  // 处理设备类型选择
  const handleDeviceTypeChange = (value) => {
    setSelectedDeviceType(value);
    filterData(searchKeyword, value, selectedStatus);
  };

  // 处理状态选择
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    filterData(searchKeyword, selectedDeviceType, value);
  };

  // 综合筛选函数
  const filterData = (keyword, type, status) => {
    let filtered = data;

    // 关键字筛选
    if (keyword) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.key.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 设备类型筛选
    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter(item => item.status === status);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 重置页码
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchDevices();
  }, []);

  // 当原始数据更新时，更新过滤后的数据
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: '设备编号',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let style = {};
        
        switch(status) {
          case '运行中':
            color = 'green';
            style = { backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '2px', padding: '0 7px' };
            break;
          case '使用中':
            color = 'green';
            style = { backgroundColor: '#e6ffed', border: '1px solid #b7eb8f', borderRadius: '2px', padding: '0 7px' };
            break;
          case '维修中':
            color = 'gold';
            break;
          case '报废':
            color = 'default';
            style = { backgroundColor: '#f0f0f0', border: '1px solid #d9d9d9', borderRadius: '2px', padding: '0 7px' };
            break;
          case '闲置':
            color = 'blue';
            style = { backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '2px', padding: '0 7px' };
            break;
          case '待采购':
            color = 'purple';
            style = { backgroundColor: '#f9f0ff', border: '1px solid #d3adf7', borderRadius: '2px', padding: '0 7px' };
            break;
          default:
            color = 'red';
        }
        
        return <Tag color={color} style={style}>{status}</Tag>;
      }
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleView(record)}>查看</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record.key)}>删除</a>
        </Space>
      )
    }
  ];

  // 处理删除设备
  const handleDelete = async (code) => {
    if (window.confirm('确定要删除该设备吗？')) {
      try {
        const response = await fetch(`http://localhost:8080/api/devices/${code}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // 删除成功后刷新设备列表和统计数据
          await Promise.all([fetchDevices(), fetchStats()]);
          setCurrentPage(1);
          message.success('设备删除成功');
        } else {
          message.error('删除设备失败');
        }
      } catch (error) {
        console.error('删除设备失败:', error);
        message.error('删除设备失败: ' + error.message);
      }
    }
  };

  // 处理查看设备
  const handleView = async (record) => {
    try {
      const response = await fetch(`http://localhost:8080/api/devices/${record.key}`);
      if (!response.ok) {
        message.error('获取设备信息失败');
        return;
      }
      const deviceData = await response.json();
      console.log('设备详细信息:', deviceData);
      setCurrentDevice({
        code: deviceData.code,
        name: deviceData.name,
        type: deviceData.type,
        status: deviceData.status,
        location: deviceData.location,
        owner: deviceData.owner,
        department: deviceData.department.name
      });

      
      setIsViewDeviceFormVisible(true);
    } catch (error) {
      console.error('获取设备信息失败:', error);
      message.error('获取设备信息失败');
    }
  };

  // 处理查看弹窗关闭
  const handleViewModalClose = () => {
    setIsViewDeviceFormVisible(false);
    setCurrentDevice(null); // 重置currentDevice状态
  };

  // 处理编辑设备
  const handleEdit = async (record) => {
    try {
      const response = await fetch(`http://localhost:8080/api/devices/${record.key}`);
      if (!response.ok) {
        message.error('获取设备信息失败');
        return;
      }
      const deviceData = await response.json();
      setCurrentDevice({
        code: deviceData.code,
        name: deviceData.name,
        type: deviceData.type,
        status: deviceData.status,
        location: deviceData.location,
        owner: deviceData.owner,
        department_code: deviceData.department_code,
        department: deviceData.department.name
      });
      setIsDeviceFormVisible(true);
    } catch (error) {
      console.error('获取设备信息失败:', error);
      message.error('获取设备信息失败');
    }
  };

  const [statsData, setStatsData] = useState({
    status_stats: [],
    type_stats: []
  });

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/stats');
      const stats = await response.json();
      setStatsData(stats);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 设备状态分布图表配置
  const statusOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 8,
      padding: [8, 12],
      textStyle: {
        color: '#333',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 16,
      itemWidth: 12,
      itemHeight: 12,
      icon: 'circle',
      textStyle: {
        fontSize: 14,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#666'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: statsData.status_stats.map(item => ({
          name: item.status,
          value: item.count,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: item.status === '运行中' ? '#34C759' : 
                       item.status === '维修中' ? '#FF9500' :
                       item.status === '报废' ? '#8E8E93' :
                       item.status === '闲置' ? '#007AFF' :
                       item.status === '待采购' ? '#5856D6' :
                       item.status === '使用中' ? '#95de64' : '#FF3B30'
              }, {
                offset: 1,
                color: item.status === '运行中' ? '#30AF55' :
                       item.status === '维修中' ? '#E68600' :
                       item.status === '报废' ? '#636366' :
                       item.status === '闲置' ? '#0066D6' :
                       item.status === '待采购' ? '#4A49B3' :
                       item.status === '使用中' ? '#b7eb8f' : '#D63129'
              }]
            }
          }
        }))
      }
    ]
  };

  // 设备类型分布图表配置
  const typeOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 8,
      padding: [8, 12],
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: statsData.type_stats.map(item => item.type),
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        lineStyle: {
          color: '#F0F0F0'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    },
    series: [
      {
        data: statsData.type_stats.map(item => item.count),
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#6CB2FF'
            }, {
              offset: 1,
              color: '#4B91F7'
            }]
          }
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#89C2FF'
              }, {
                offset: 1,
                color: '#6BA6F8'
              }]
            }
          }
        }
      }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px' }}>
        <h1>设备管理系统</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <DeviceOverview
          totalDevices={statsData.total_devices || 0}
          onlineDevices={statsData.online_devices || 0}
          maintenanceDevices={statsData.maintenance_devices || 0}
          purchasingDevices={statsData.purchasing_devices || 0}
        />
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Select 
              value={selectedDeviceType} 
              style={{ width: 120 }} 
              placeholder="设备类型"
              onChange={handleDeviceTypeChange}
            >
              <Select.Option value="">全部类型</Select.Option>
              {deviceTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
            <Select 
              value={selectedStatus} 
              style={{ width: 120 }} 
              placeholder="使用状态"
              onChange={handleStatusChange}
            >
              <Select.Option value="">全部状态</Select.Option>
              {[...new Set(data.map(device => device.status))].map(status => (
                <Select.Option key={status} value={status}>{status}</Select.Option>
              ))}
            </Select>
            <Select 
              value={selectedDepartment} 
              style={{ width: 120 }} 
              placeholder="所属部门"
              onChange={handleDepartmentChange}
            >
              <Select.Option value="">全部部门</Select.Option>
              {departments.map(dept => (
                <Select.Option key={dept.code} value={dept.name}>{dept.name}</Select.Option>
              ))}
            </Select>
            <Search
              placeholder="搜索设备名称、编号"
              style={{ width: 300 }}
              enterButton
              onSearch={handleSearch}
              allowClear
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsDeviceFormVisible(true)}>新增设备</Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `共 ${total} 条数据`
          }}
        />

        <div style={{ display: 'flex', marginTop: '20px', gap: '20px' }}>
          <div style={{ flex: 1, background: '#fff', padding: '20px' }}>
            <h3>设备状态分布</h3>
            <ReactECharts option={statusOption} style={{ height: '300px' }} />
          </div>
          <div style={{ flex: 1, background: '#fff', padding: '20px' }}>
            <h3>设备类型分布</h3>
            <ReactECharts option={typeOption} style={{ height: '300px' }} />
          </div>
        </div>
        <DeviceForm
          visible={isDeviceFormVisible}
          onCancel={() => {
            setIsDeviceFormVisible(false);
            setCurrentDevice(null);
          }}
          onSuccess={async () => {
            setIsDeviceFormVisible(false);
            setCurrentDevice(null);
            await Promise.all([fetchDevices(), fetchStats()]);
            setCurrentPage(1);
          }}
          initialValues={currentDevice}
        />
        <DeviceForm
          visible={isViewDeviceFormVisible}
          onCancel={handleViewModalClose}
          onSuccess={async () => {
            handleViewModalClose();
            await Promise.all([fetchDevices(), fetchStats()]);
            setCurrentPage(1);
          }}
          initialValues={currentDevice}
          readOnly={true}
          title="查看设备"
        />
      </Content>
    </Layout>
  );
};

export default App;