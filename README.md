# Poker Master Game 🎰

一个完整的前后端扑克游戏，包含实时游戏服务器和交互式网页界面。

## 功能特性

- ♠️ 完整的德州扑克游戏逻辑
- 🎯 实时多人游戏支持
- 💰 虚拟筹码系统
- 📊 游戏统计和历史记录
- 🎨 响应式网页设计
- ⚡ WebSocket 实时通信

## 项目结构

```
poker-mastermaster/
├── server/              # 后端服务
│   ├── app.js          # Express 主应用
│   ├── package.json    # 依赖配置
│   ├── routes/         # API 路由
│   ├── models/         # 数据模型
│   └── utils/          # 游戏逻辑工具
├── client/             # 前端应用
│   ├── index.html      # 主页面
│   ├── css/            # 样式文件
│   ├── js/             # 脚本文件
│   └── assets/         # 资源文件
└── README.md           # 项目说明
```

## 快速开始

### 安装依赖
```bash
cd server
npm install
```

### 启动服务器
```bash
npm start
```

服务器将运行在 `http://localhost:3000`

### 访问游戏
打开浏览器访问 `http://localhost:3000`

## 部署

### GitHub Pages 部署（前端）
```bash
npm run build
```

### 云服务部署（后端）
支持部署到：
- Heroku
- Railway
- Render
- AWS

## 游戏规则

- 标准德州扑克规则
- 自动检测最强手牌
- 支持翻牌、转牌、河牌阶段
- 实时更新玩家状态

## 技术栈

**前端：**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API / WebSocket

**后端：**
- Node.js
- Express.js
- WebSocket (ws)

## 许可证

MIT License

## 贡献

欢迎提交 PR 和 Issue！
