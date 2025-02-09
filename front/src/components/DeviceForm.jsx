import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Modal, message } from 'antd';

const DeviceForm = ({ visible, onCancel, onSuccess, initialValues, readOnly, title }) => {
  const [departments, setDepartments] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // 使用状态管理编辑模式标志位

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/departments');
      const data = await response.json();
      // 使用Map根据部门编码去重，保留最新的部门信息
      const departmentMap = new Map();
      data.forEach(dept => {
        departmentMap.set(dept.code, dept);
      });
      setDepartments(Array.from(departmentMap.values()));
    } catch (error) {
      console.error('获取部门列表失败:', error);
      message.error('获取部门列表失败');
    }
  };

  // 组件加载时获取部门列表
  useEffect(() => {
    fetchDepartments();
  }, []);
  const [form] = Form.useForm();

  // 监听initialValues和visible变化，更新表单数据
  React.useEffect(() => {
    if (visible) {
      // 每次打开表单时先重置所有字段
      form.resetFields();
      
      // 根据initialValues判断是否为编辑模式
      const editMode = !!initialValues?.code;
      setIsEdit(editMode);
      
      console.log('Edit Mode:', editMode);
      if (editMode) {
        // 编辑模式：使用initialValues设置表单值
        const formValues = {
          ...initialValues,
          department: initialValues.department_code || initialValues.department
        };
        form.setFieldsValue(formValues);
      } else {
        
        // 新增模式：清空所有字段，只设置状态默认值
        form.setFieldsValue({
          status: '使用中'
        });
      }
    }
  }, [initialValues, form, visible]);

  const handleSubmit = async () => {
    if (readOnly) {
      onCancel();
      return;
    }

    try {
      const values = await form.validateFields();
      const url = initialValues?.code
        ? `http://localhost:8080/api/devices/${initialValues.code}`
        : 'http://localhost:8080/api/devices';
      const method = initialValues?.code ? 'PUT' : 'POST';
      
      // 构建提交到后端的数据格式
      const formattedValues = {
        code: values.code,
        name: values.name,
        type: values.type,
        status: values.status,
        location: values.location,
        owner: values.owner,
        department_code: values.department  // 使用选中的部门编码作为department_code
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (response.ok) {
        message.success(initialValues?.code ? '设备更新成功' : '设备添加成功');
        form.resetFields();
        setIsEdit(false); // 操作成功后重置编辑模式
        onSuccess();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || '操作失败');
      }
    } catch (error) {
      console.error('表单提交错误:', error);
      message.error('表单验证失败，请检查输入');
    }
  };

  // 添加表单关闭时的处理函数
  const handleCancel = () => {
    setIsEdit(false); // 关闭表单时重置编辑模式
    form.resetFields(); // 重置所有字段
    form.setFieldsValue({
      status: '使用中' // 只设置状态的默认值
    });
    onCancel();
  };

  return (
    <Modal
      title={title || (readOnly ? "查看设备" : (isEdit ? "编辑设备" : "新增设备"))}
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={600}
      okText={readOnly ? "关闭" : "确定"}
      cancelText={readOnly ? null : "取消"}
      cancelButtonProps={{ style: { display: readOnly ? 'none' : 'inline' } }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {
          status: '使用中',
        }}
      >
        <Form.Item
          name="code"
          label="设备编号"
          rules={[{ required: true, message: '请输入设备编号' }]}
        >
          <Input placeholder="请输入设备编号" disabled={readOnly || !!initialValues?.code} />
        </Form.Item>

        <Form.Item
          name="name"
          label="设备名称"
          rules={[{ required: true, message: '请输入设备名称' }]}
        >
          <Input placeholder="请输入设备名称" disabled={readOnly} />
        </Form.Item>

        <Form.Item
          name="type"
          label="设备类型"
          rules={[{ required: true, message: '请选择设备类型' }]}
        >
          <Select placeholder="请选择设备类型" disabled={readOnly}>
            <Select.Option value="服务器">服务器</Select.Option>
            <Select.Option value="网络设备">网络设备</Select.Option>
            <Select.Option value="工作站">工作站</Select.Option>
            <Select.Option value="办公设备">办公设备</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="设备状态"
          rules={[{ required: true, message: '请选择设备状态' }]}
        >
          <Select placeholder="请选择设备状态" disabled={readOnly}>
            <Select.Option value="使用中">使用中</Select.Option>
            <Select.Option value="闲置">闲置</Select.Option>
            <Select.Option value="维修中">维修中</Select.Option>
            <Select.Option value="待采购">待采购</Select.Option>
            <Select.Option value="报废">报废</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          label="设备位置"
          rules={[{ required: true, message: '请输入设备位置' }]}
        >
          <Input placeholder="请输入设备位置" disabled={readOnly} />
        </Form.Item>

        <Form.Item
          name="owner"
          label="负责人"
          rules={[{ required: true, message: '请输入负责人' }]}
        >
          <Input placeholder="请输入负责人" disabled={readOnly} />
        </Form.Item>

        <Form.Item
          name="department"
          label="所属部门"
          rules={[{ required: true, message: '请选择所属部门' }]}
        >
          <Select placeholder="请选择所属部门" disabled={readOnly}>
            {departments.map(dept => (
              <Select.Option key={dept.code} value={dept.code}>{dept.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeviceForm;