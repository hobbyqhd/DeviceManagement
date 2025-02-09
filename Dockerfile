# 构建阶段
FROM golang:1.21-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 Go 模块文件
COPY server/go.mod server/go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY server/ ./

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest

# 安装必要的 CA 证书
RUN apk --no-cache add ca-certificates

WORKDIR /app

# 从构建阶段复制配置文件和二进制文件
COPY --from=builder /app/config ./config
COPY --from=builder /app/main .

# 暴露应用端口
EXPOSE 8080

# 运行应用
CMD ["./main"]