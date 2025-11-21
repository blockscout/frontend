# Blockscout Local Deployment

本地部署 Blockscout Frontend 和 Backend 的 Docker Compose 配置。

## 前置要求

- Docker 和 Docker Compose
- 已构建的 `zkmelabs/blockscout-frontend:latest` 镜像，或使用 `build` 选项自动构建

## 快速开始

### 1. 配置环境变量

`local.env` 文件已包含适合本地调试的默认配置。如需修改：

```bash
cd /home/lsl/github/zkme/frontend/deployment/local
# 编辑 local.env 文件，根据需要修改配置
vim local.env
```

### 2. 启动服务

```bash
# 使用 localup.sh 脚本（推荐）
./localup.sh start

# 或使用 docker compose 直接启动
docker compose up -d
```

### 3. 访问应用

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:4000

> **注意**: PostgreSQL、MongoDB 和 Redis 端口未暴露到主机，仅通过 Docker 网络在容器间访问。

## 服务说明

### Frontend 服务
- **容器名**: `blockscout-frontend`
- **端口**: `3001:3000` （主机端口 3001 映射到容器端口 3000)
- **镜像**: `zkmelabs/blockscout-frontend:latest`
- **健康检查**: `http://localhost:3000/api/healthz` （容器内部）

### Blockscout Backend 服务
- **容器名**: `blockscout-backend`
- **端口**: `4000:4000`
- **镜像**: `blockscout/blockscout:6.10.0`
- **健康检查**: `http://localhost:4000/api/v1/health/liveness`
- **数据库**: PostgreSQL

### PostgreSQL 服务
- **容器名**: `blockscout-postgres`
- **端口**: 未暴露（仅容器间访问）
- **镜像**: `postgres:15-alpine`
- **数据库**: `blockscout`
- **用户**: `blockscout`
- **密码**: `blockscout`

### MongoDB 服务
- **容器名**: `blockscout-mongodb`
- **端口**: 未暴露（仅容器间访问）
- **镜像**: `mongo:7.0`
- **数据持久化**: Docker volume `mongodb_data`

### Redis 服务
- **容器名**: `blockscout-redis`
- **端口**: 未暴露（仅容器间访问）
- **镜像**: `redis:7-alpine`
- **数据持久化**: Docker volume `redis_data`

## localup.sh 使用说明

`localup.sh` 是统一的管理脚本，提供以下命令：

### 命令列表

```bash
# 检查配置
./localup.sh init

# 启动所有服务
./localup.sh start

# 停止所有服务
./localup.sh stop

# 重置服务（停止并重新启动）
./localup.sh reset

# 查看服务状态
./localup.sh status

# 查看日志
./localup.sh logs              # 所有服务
./localup.sh logs frontend      # Frontend 服务
./localup.sh logs blockscout    # Backend 服务
./localup.sh logs postgres      # PostgreSQL 服务
```

## 配置说明

### 环境变量

主要环境变量在 `local.env` 文件中配置：

#### App 配置
- `NEXT_PUBLIC_APP_HOST`: 应用主机地址（默认：`localhost:3001`）
- `NEXT_PUBLIC_APP_PROTOCOL`: 协议（`http` 或 `https`）
- `NEXT_PUBLIC_APP_PORT`: 端口（默认：`3001`）

#### 数据库配置
- `NEXT_PUBLIC_DATABASE_URL`: MongoDB 连接字符串（Frontend 使用）
- `DATABASE_URL`: PostgreSQL 连接字符串（Backend 使用，在 docker-compose.yml 中自动配置）

#### 网络配置
- `NEXT_PUBLIC_NETWORK_ID`: 链 ID（默认：`222888`）
- `NEXT_PUBLIC_NETWORK_NAME`: 网络名称（默认：`MOCA Chain`）
- `NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL`: 货币符号（默认：`MOCA`）

#### API 配置
- `NEXT_PUBLIC_API_HOST`: 后端 API 地址（默认：`localhost:4000`）
- `NEXT_PUBLIC_API_PROTOCOL`: API 协议（默认：`http`）

#### RPC 配置
- `ETHEREUM_JSONRPC_HTTP_URL`: 以太坊 RPC 节点地址
  - 如果 RPC 节点在主机上：使用 `http://172.17.0.1:8545` (Linux) 或 `http://host.docker.internal:8545` (Mac/Windows)
  - 如果 RPC 节点在远程服务器：使用实际 IP 地址，如 `http://15.235.212.51:8545`
- `ETHEREUM_JSONRPC_FALLBACK_HTTP_URL`: 备用 RPC 节点地址
- `ETHEREUM_JSONRPC_TRACE_URL`: Trace RPC 节点地址
- `ETHEREUM_JSONRPC_FALLBACK_TRACE_URL`: 备用 Trace RPC 节点地址
- `ETHEREUM_JSONRPC_VARIANT`: RPC 变体（默认：`geth`）
- `ETHEREUM_JSONRPC_TRANSPORT`: RPC 传输方式（默认：`http`）

## 常用命令

### 启动服务
```bash
./localup.sh start
# 或
docker compose up -d
```

### 停止服务
```bash
./localup.sh stop
# 或
docker compose down
```

### 查看日志
```bash
# 所有服务
./localup.sh logs

# 特定服务
docker logs -f blockscout-frontend
docker logs -f blockscout-backend
docker logs -f blockscout-postgres
```

### 重启服务
```bash
./localup.sh reset
# 或
docker compose restart frontend
docker compose restart blockscout
```

### 重建镜像
```bash
docker compose build --no-cache frontend
docker compose up -d
```

### 清理数据
```bash
# 停止并删除容器、网络
./localup.sh stop
docker compose down

# 同时删除 volumes（会删除所有数据库数据）
docker compose down -v
```

## 构建镜像

如果需要从源码构建 Frontend 镜像：

```bash
cd /home/lsl/github/zkme/frontend

# 构建镜像
docker build -t zkmelabs/blockscout-frontend:latest \
  --build-arg GIT_COMMIT_SHA=$(git rev-parse HEAD) \
  --build-arg GIT_TAG=$(git describe --tags --always) \
  --build-arg ENVS_PRESET=me \
  -f Dockerfile .

# 或者使用 docker-compose 构建
cd deployment/local
docker compose build frontend
```

## 故障排查

### 1. 端口被占用
如果端口被占用，可以修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "3001:3000"  # 使用 3001 端口
```

### 2. 数据库连接失败
检查数据库容器是否正常运行：
```bash
./localup.sh status
docker logs blockscout-postgres
docker logs blockscout-mongodb
```

### 3. Backend 无法启动
查看 backend 日志：
```bash
docker logs -f blockscout-backend
```

Backend 启动需要运行数据库迁移，可能需要几分钟时间。

### 4. Frontend 无法启动
查看 frontend 日志：
```bash
docker logs -f blockscout-frontend
```

### 5. 环境变量未生效
确保 `local.env` 文件存在且格式正确：
```bash
cat local.env
```

### 6. 镜像构建失败
检查 Dockerfile 和构建上下文：
```bash
cd /home/lsl/github/zkme/frontend
docker build -t zkmelabs/blockscout-frontend:latest .
```

## 与 K8s 配置的对应关系

此 docker-compose 配置基于 `testnet_config.yaml` 中的配置：

| K8s 配置 | Docker Compose |
|---------|----------------|
| `frontend.image.repository` | `zkmelabs/blockscout-frontend` |
| `frontend.image.tag` | `latest` |
| `frontend.envFromSecret` | `local.env` 文件 |
| `blockscout.image.repository` | `blockscout/blockscout` |
| `blockscout.image.tag` | `6.10.0` |
| `blockscout.envFromSecret` | `local.env` 文件 |

## 注意事项

1. **生产环境**: 此配置仅用于本地开发，生产环境请使用 K8s 部署
2. **安全性**: `local.env` 文件包含配置信息，不要提交敏感信息到版本控制
3. **数据持久化**: 数据库数据存储在 Docker volumes 中，删除 volume 会丢失数据
4. **网络配置**: 确保 `ETHEREUM_JSONRPC_HTTP_URL` 指向正确的 RPC 节点地址
5. **启动顺序**: 服务启动顺序为 PostgreSQL → Redis → MongoDB → Backend → Frontend

## 相关文档

- [Blockscout Frontend ENVS.md](../../docs/ENVS.md)
- [Blockscout Frontend README](../../README.md)
- [Blockscout Backend 文档](https://docs.blockscout.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
