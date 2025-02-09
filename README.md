# 设备管理系统

一个现代化的企业设备资产管理系统，用于管理和追踪企业内部的设备资产。

## 功能特性

### 设备管理
- 设备信息的增删改查
- 设备状态追踪（在线、维修中、待采购等）
- 设备分类管理
- 设备统计分析
- 设备负责人管理

### 部门管理
- 部门信息管理
- 部门设备关联
- 部门层级结构

### 数据可视化
- 设备状态统计
- 设备类型分布
- 部门设备分布

## 技术栈

### 前端
- React 18
- Ant Design 5.x
- ECharts
- Vite

### 后端
- Go
- Gin Web Framework
- GORM
- MySQL

## 快速开始

### 环境要求
- Node.js 16+
- Go 1.16+
- MySQL 5.7+

### 数据库配置
1. 创建数据库：
```bash
mysql -u root -p
CREATE DATABASE device_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

.
├── front/                  # 前端项目目录
│   ├── src/               # 源代码
│   ├── package.json       # 依赖配置
│   └── vite.config.js     # Vite 配置
│
└── server/                # 后端项目目录
    ├── config/           # 配置文件
    ├── controllers/      # 控制器
    ├── database/         # 数据库相关
    ├── models/          # 数据模型
    └── main.go          # 入口文件





## API 文档
### 设备相关接口
- GET /api/devices - 获取设备列表
- GET /api/devices/:code - 获取单个设备详情
- POST /api/devices - 创建新设备
- PUT /api/devices/:code - 更新设备信息
- DELETE /api/devices/:code - 删除设备
### 部门相关接口
- GET /api/departments - 获取部门列表
- POST /api/departments - 创建新部门
### 统计相关接口
- GET /api/stats - 获取设备统计信息
- GET /api/device-types - 获取设备类型列表