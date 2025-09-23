# 馒化脸修复 AI 咨询应用 (FOS - Face Over-filling Syndrome Consultation)

一款专业的AI驱动医美咨询应用，专注于"馒化脸"（面部过度填充综合征）的识别、咨询和修复方案推荐。

## 📚 多语言文档 | Multilingual Documentation

- **中文版本** | Chinese Version: [README.md](README.md) (当前文件)
- **English Version**: [README.en.md](README.en.md)
- **部署指南** | Deployment Guide (Chinese): [DEPLOYMENT.zh.md](DEPLOYMENT.zh.md)
- **Deployment Guide (English)**: [DEPLOYMENT.en.md](DEPLOYMENT.en.md)

## 🎯 项目概述

本应用结合了现代Web技术和AI人工智能，为用户提供：
- 专业的"馒化脸"知识科普
- 三种不同人格的AI智能咨询（专业顾问、技术专家、亲切伙伴）
- 在线预约咨询服务
- 响应式设计，适配各种设备

## 🛠️ 技术栈

- **前端框架**: React 19.1.0 + TypeScript
- **构建工具**: Vite 6.2.0
- **AI服务**: Google Gemini API
- **样式**: Tailwind CSS
- **图标**: Heroicons

## 📁 项目结构

```
.
├── components/          # React 组件
│   ├── ActionButton.tsx # 操作按钮组件
│   ├── FeatureCard.tsx  # 功能卡片组件
│   ├── Footer.tsx       # 页脚组件
│   ├── Header.tsx       # 页头组件
│   ├── IconComponents.tsx # 图标组件
│   └── Section.tsx      # 区块组件
├── App.tsx              # 主应用组件
├── constants.ts         # 常量配置
├── index.html           # HTML 入口文件
├── index.tsx            # React 入口文件
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
└── README.md            # 项目说明
```

## 🚀 快速开始

> 💡 **详细部署说明**: 完整的部署和使用指南请参考 [DEPLOYMENT.zh.md](DEPLOYMENT.zh.md) | For detailed deployment instructions, see [DEPLOYMENT.en.md](DEPLOYMENT.en.md)

### 前提条件

- Node.js (推荐版本 16+)
- npm 或 yarn
- Gemini API Key

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/sooogooo/webapp-fos.git
   cd webapp-fos
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.local.example .env.local
   ```
   
   编辑 `.env.local` 文件，添加您的 Gemini API Key：
   ```
   API_KEY=your_gemini_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

## 🔧 可用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

## 🤖 AI 功能说明

应用集成了三种不同的AI咨询角色：

1. **专业顾问** - 提供专业、权威的医美咨询
2. **技术专家** - 提供技术性和临床细节解释
3. **亲切伙伴** - 提供温暖、友好的建议和支持

用户可以在界面中切换不同的AI角色，获得个性化的咨询体验。

## 📱 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ AI智能聊天咨询
- ✅ 聊天记录本地存储
- ✅ 专业医美知识科普
- ✅ 在线预约表单
- ✅ 企业微信二维码集成
- ✅ SEO优化

## 🎨 设计理念

- **简洁优雅**: 采用现代化的设计语言，注重用户体验
- **专业可信**: 色彩搭配体现医美行业的专业性
- **温馨友好**: 界面设计兼顾专业性和亲和力

## 🔒 隐私与安全

- 聊天记录仅存储在用户本地浏览器
- API调用采用安全的HTTPS协议
- 不收集用户个人敏感信息

## 📄 许可证

本项目仅供学习和研究使用。

## 👥 贡献

欢迎提交Issue和Pull Request来改进本项目。

## 📞 联系方式

- **公司**: 重庆联合丽格科技有限公司
- **地址**: 重庆市渝中区临江支路28号
- **邮箱**: bccsw@cqlhlg.work
- **电话**: 023-68726872

---

*本应用旨在提供医美咨询信息，不构成具体的医疗建议。如需专业治疗，请咨询qualified医疗专业人士。*
