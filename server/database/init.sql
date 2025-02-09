-- 创建部门表
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    name VARCHAR(100) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 创建设备表
CREATE TABLE IF NOT EXISTS devices (
    code VARCHAR(50) PRIMARY KEY CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    name VARCHAR(100) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    type VARCHAR(50) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    status VARCHAR(20) NOT NULL CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    location VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    owner VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    department_code VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (department_code) REFERENCES departments(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入测试数据
INSERT INTO departments (code, name, description) VALUES
('IT', 'IT部', 'IT部门负责公司技术基础设施维护'),
('DEV', '研发部', '负责产品研发和技术创新'),
('DESIGN', '设计部', '负责产品设计和用户体验'),
('ADMIN', '行政部', '负责日常行政事务管理');

-- 插入设备测试数据
INSERT INTO devices (code, name, type, status, location, owner, department_code) VALUES
('DEV001', '数据库服务器', '服务器', '使用中', '机房A-01', '张三', 'IT'),
('DEV002', '核心交换机', '网络设备', '使用中', '机房A-02', '李四', 'IT'),
('DEV003', '设计工作站', '工作站', '使用中', '设计部A区', '王五', 'DESIGN'),
('DEV004', '彩色打印机', '办公设备', '维修中', '办公室B-02', '赵六', 'ADMIN'),
('DEV005', '备份服务器', '服务器', '使用中', '机房B-01', '孙七', 'IT'),
('DEV006', '防火墙', '网络设备', '维修中', '机房A-01', '张三', 'IT'),
('DEV007', '开发工作站', '工作站', '闲置', '研发部C区', '李四', 'DEV'),
('DEV008', '会议室投影仪', '办公设备', '已报废', '会议室A', '王五', 'ADMIN'),
('DEV009', '存储服务器', '服务器', '使用中', '机房B-02', '赵六', 'IT'),
('DEV010', '无线AP', '网络设备', '闲置', '办公区D', '孙七', 'IT'),
('DEV011', '高性能服务器', '服务器', '待采购', '机房C-01', '张三', 'IT'),
('DEV012', '安全网关', '网络设备', '待采购', '机房C-02', '李四', 'IT');