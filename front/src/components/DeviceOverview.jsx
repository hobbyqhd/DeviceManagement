import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DesktopOutlined, CheckCircleOutlined, ToolOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const DeviceOverview = ({ totalDevices, onlineDevices, maintenanceDevices, purchasingDevices }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总设备数"
              value={totalDevices}
              prefix={<DesktopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ color: '#52c41a', fontSize: '12px', marginTop: '4px' }}>
              较上月增长 12%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={onlineDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`占比 ${totalDevices > 0 ? ((onlineDevices / totalDevices) * 100).toFixed(1) : 0}%`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="维修中"
              value={maintenanceDevices}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待采购"
              value={purchasingDevices}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceOverview;