# 部署使用说明 - FOS 馒化脸修复AI咨询应用

本文档详细介绍了如何在不同环境中部署和使用FOS应用程序。

## 📋 目录

- [环境要求](#环境要求)
- [本地开发部署](#本地开发部署)
- [生产环境部署](#生产环境部署)
- [Docker部署](#docker部署)
- [云平台部署](#云平台部署)
- [环境变量配置](#环境变量配置)
- [故障排除](#故障排除)
- [维护指南](#维护指南)

## 🔧 环境要求

### 最低要求
- **Node.js**: >= 16.0.0 (推荐 18.0.0+)
- **npm**: >= 7.0.0 或 **yarn**: >= 1.22.0
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **内存**: 最少 2GB RAM (推荐 4GB+)
- **磁盘空间**: 最少 1GB 可用空间

### 推荐配置
- **Node.js**: 18.x LTS 或 20.x LTS
- **包管理器**: npm 9.x 或 yarn 3.x
- **内存**: 8GB+ RAM
- **CPU**: 4核心或以上

## 🖥️ 本地开发部署

### 步骤1: 克隆项目
```bash
git clone https://github.com/sooogooo/webapp-fos.git
cd webapp-fos
```

### 步骤2: 安装依赖
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 步骤3: 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.local.example .env.local

# 编辑环境变量文件
nano .env.local  # 或使用您喜欢的编辑器
```

在 `.env.local` 文件中设置以下变量：
```env
# Gemini AI API密钥 (必需)
API_KEY=your_gemini_api_key_here

# 可选配置
VITE_APP_TITLE=馒化脸修复AI咨询
VITE_APP_VERSION=1.0.0
```

### 步骤4: 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 步骤5: 验证安装
访问 `http://localhost:5173` 并检查：
- [ ] 页面正常加载
- [ ] AI聊天功能正常工作
- [ ] 响应式设计在不同设备上正常显示

## 🌐 生产环境部署

### 方法1: 传统Web服务器部署

#### 步骤1: 构建生产版本
```bash
npm run build
```

构建完成后，将在 `dist/` 目录中生成生产文件。

#### 步骤2: 配置Web服务器

**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/webapp-fos/dist;
    index index.html;

    # 处理单页应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache配置示例：**
```apache
<VirtualHost *:80>
    DocumentRoot /path/to/webapp-fos/dist
    ServerName your-domain.com
    
    # 启用重写模块用于单页应用
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # 静态资源缓存
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

### 方法2: 使用预览服务器
```bash
npm run preview
```

## 🐳 Docker部署

### 创建Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 创建docker-compose.yml
```yaml
version: '3.8'

services:
  webapp-fos:
    build: .
    ports:
      - "80:80"
    environment:
      - API_KEY=${API_KEY}
    restart: unless-stopped
    volumes:
      - ./logs:/var/log/nginx
```

### 部署命令
```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## ☁️ 云平台部署

### Vercel部署
1. 将代码推送到GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入GitHub仓库
4. 在环境变量中设置 `API_KEY`
5. 部署完成

### Netlify部署
1. 构建项目：`npm run build`
2. 访问 [netlify.com](https://netlify.com)
3. 拖拽 `dist` 文件夹到部署区域
4. 在设置中配置环境变量

### 阿里云/腾讯云服务器部署
```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2进程管理器
npm install -g pm2

# 克隆并部署项目
git clone https://github.com/sooogooo/webapp-fos.git
cd webapp-fos
npm install
npm run build

# 使用PM2启动服务（需要配置静态文件服务器）
# 或配置Nginx作为反向代理
```

## 🔐 环境变量配置

### 必需变量
| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `API_KEY` | Gemini AI API密钥 | `AIzaSyC...` |

### 可选变量
| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | `馒化脸修复AI咨询` |
| `VITE_APP_VERSION` | 应用版本 | `1.0.0` |

### 获取Gemini API密钥
1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 注册/登录Google账户
3. 创建新的API密钥
4. 将密钥添加到 `.env.local` 文件

## 🔍 故障排除

### 常见问题

#### 1. API密钥错误
**问题**: AI聊天功能不工作，显示"API服务未初始化"
**解决方案**:
- 检查 `.env.local` 文件是否存在
- 验证API密钥格式是否正确
- 确保API密钥有效且未过期

#### 2. 依赖安装失败
**问题**: `npm install` 失败
**解决方案**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 3. 构建失败
**问题**: `npm run build` 失败
**解决方案**:
- 检查TypeScript错误：`npm run type-check`
- 确保所有依赖正确安装
- 检查环境变量配置

#### 4. 端口冲突
**问题**: 5173端口被占用
**解决方案**:
```bash
# 指定其他端口启动
npm run dev -- --port 3000
```

### 性能优化

#### 1. 启用gzip压缩
在服务器配置中启用gzip压缩以减少传输大小。

#### 2. 静态资源缓存
配置长期缓存策略for静态资源(CSS, JS, 图片)。

#### 3. CDN配置
将静态资源托管到CDN以提高加载速度。

## 🛠️ 维护指南

### 日常维护
- 定期检查应用日志
- 监控API使用情况
- 备份重要配置文件

### 更新流程
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 重新构建
npm run build

# 重启服务
# (根据部署方式而定)
```

### 备份策略
- 定期备份环境变量文件
- 备份自定义配置
- 备份用户数据(如果有)

### 监控建议
- 设置服务器监控警报
- 监控API调用频率和成本
- 设置错误日志监控

## 📞 技术支持

如遇到技术问题，请：
1. 查看上述故障排除指南
2. 检查GitHub Issues页面
3. 联系技术支持：bccsw@cqlhlg.work

---

**注意**: 本应用仅用于教育和演示目的。在生产环境中使用前，请确保遵循相关的安全最佳实践。