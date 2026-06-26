# 🎰 Poker Master - 专业德州扑克游戏

一个完整的、生产级别的前后端德州扑克游戏平台，采用现代化技术栈，提供流畅的用户体验和完整的游戏逻辑。

## ✨ 核心特性

- ♠️ **完整德州扑克规则** - 标准 Texas Hold'em 游戏逻辑
- 🎯 **实时多人游戏** - WebSocket 驱动的实时同步
- 💰 **虚拟筹码系统** - 完整的筹码管理和下注机制
- 📊 **游戏数据统计** - 实时的玩家和游戏统计
- 🎨 **现代化 UI** - 响应式设计、流畅动画
- ⚡ **高性能通信** - 优化的 WebSocket 消息系统
- 🔄 **自动手牌评估** - 智能的最强手牌识别
- 📱 **全平台适配** - 桌面和移动端完美支持

## 🏗️ 项目结构

```
poker-mastermaster/
├── server/                 # Node.js 后端服务
│   ├── app.js             # Express + WebSocket 主应用
│   ├── package.json       # 依赖配置
│   ├── utils/
│   │   ├── gameLogic.js   # 核心游戏逻辑
│   │   ├── cardEvaluator.js   # 手牌评估
│   │   └── gameManager.js     # 游戏状态管理
│   └── middleware/
│       └── errorHandler.js    # 错误处理
├── client/                 # 前端应用
│   ├── index.html         # 主页面
│   ├── css/
│   │   ├── style.css      # 主样式
│   │   └── animations.css # 动画效果
│   └── js/
│       ├── game.js        # 游戏主逻辑
│       ├── ui.js          # UI 控制器
│       ├── websocket.js   # WebSocket 管理
│       └── utils.js       # 工具函数
└── README.md
```

## 🚀 快速开始

### 前置要求
- Node.js 16+ 
- npm 或 yarn
- 现代浏览器（支持 WebSocket）

### 本地运行

#### 1️⃣ 克隆仓库
```bash
git clone https://github.com/880688/poker-mastermaster.git
cd poker-mastermaster
```

#### 2️⃣ 安装依赖
```bash
cd server
npm install
```

#### 3️⃣ 启动服务
```bash
npm start
```

服务运行在 `http://localhost:3000`

#### 4️⃣ 打开游戏
在浏览器中访问 `http://localhost:3000`

## 🎮 游戏规则

### 基础玩法
1. **设置昵称** - 在侧边栏输入你的昵称
2. **加入游戏** - 等待其他玩家加入（至少 2 人）
3. **开始游戏** - 点击"开始游戏"按钮
4. **下注** - 输入金额并选择行动（下注、Check、Fold、Raise）
5. **揭示** - 手牌被揭示，最强手牌赢得底池

### 德州扑克阶段
- **翻牌前（Preflop）** - 所有玩家看到 2 张私人底牌
- **翻牌圈（Flop）** - 3 张社区牌展开
- **转牌圈（Turn）** - 第 4 张社区牌展开
- **河牌圈（River）** - 第 5 张社区牌展开
- **摊牌（Showdown）** - 玩家展示手牌，最强手牌获胜

### 手牌排名（从高到低）
1. 🏆 **皇家同花顺** - A K Q J 10 同花
2. **同花顺** - 5 张连续同花牌
3. **四条** - 4 张相同点数
4. **葫芦** - 3 条 + 1 对
5. **同花** - 5 张同花牌
6. **顺子** - 5 张连续牌
7. **三条** - 3 张相同点数
8. **两对** - 2 个不同的对
9. **一对** - 2 张相同点数
10. **高牌** - 最高的牌

## 🛠️ 技术栈

### 后端
- **Node.js** - 运行环境
- **Express.js** - Web 框架
- **WebSocket (ws)** - 实时通信
- **CORS** - 跨域资源共享

### 前端
- **HTML5** - 标记语言
- **CSS3** - 样式（含响应式设计、动画）
- **Vanilla JavaScript** - 交互逻辑
- **WebSocket API** - 实时通信

## 📡 API 文档

### WebSocket 消息格式

#### 客户端发送

```javascript
// 设置玩家昵称
{
  type: 'SET_NAME',
  name: '玩家昵称'  // 字符串，最多 20 字
}

// 开始新游戏
{
  type: 'START_GAME'
}

// 玩家下注
{
  type: 'BET',
  amount: 100  // 下注金额
}

// Check（过牌）
{
  type: 'CHECK'
}

// Fold（弃牌）
{
  type: 'FOLD'
}

// Raise（加注）
{
  type: 'RAISE',
  amount: 200
}
```

#### 服务器广播

```javascript
// 玩家列表更新
{
  type: 'PLAYER_LIST',
  players: [
    {
      id: 'player_id',
      name: '玩家昵称',
      chips: 1000,
      status: 'idle' | 'active' | 'folded'
    }
  ]
}

// 游戏状态更新
{
  type: 'GAME_STATE',
  player: {
    id: 'your_id',
    name: '你的昵称',
    chips: 900,
    hand: [{rank: 'A', suit: '♠'}, {rank: 'K', suit: '♥'}],
    bet: 100,
    status: 'active'
  },
  game: {
    id: 1,
    stage: 'preflop' | 'flop' | 'turn' | 'river',
    totalPot: 200,
    communityCards: [],
    deck: 48  // 剩余牌数
  },
  players: [/* 所有玩家列表 */]
}

// 错误消息
{
  type: 'ERROR',
  message: '错误描述'
}
```

## 🌐 部署指南

### Heroku 部署

```bash
# 1. 创建 Heroku 应用
heroku create your-app-name

# 2. 设置环境变量
heroku config:set NODE_ENV=production

# 3. 推送并部署
git push heroku main

# 4. 查看日志
heroku logs --tail
```

### Railway 部署

1. 连接你的 GitHub 账号
2. 选择此仓库
3. 自动检测到 Node.js
4. 配置环境变量
5. 点击部署

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server/app.js"]
```

## 🎯 开发指南

### 添加新功能

#### 添加新的 WebSocket 消息类型

1. **后端** (`server/app.js`):
```javascript
case 'YOUR_ACTION':
  handleYourAction(playerId, action);
  break;
```

2. **前端** (`client/js/websocket.js`):
```javascript
case 'YOUR_MESSAGE_TYPE':
  handleYourMessage(data);
  break;
```

### 调试

**服务器日志：**
```bash
cd server
npm run dev  # 使用 nodemon 自动重启
```

**浏览器控制台：**
- F12 打开开发者工具
- 查看 Console 标签的日志和错误
- 查看 Network 标签的 WebSocket 通信

## 🐛 常见问题

### Q: 无法连接到服务器？
**A:** 
- 检查服务器是否正在运行
- 确认端口 3000 未被占用
- 查看浏览器控制台错误信息

### Q: WebSocket 连接失败？
**A:**
- 确保使用 `ws://` (本地) 或 `wss://` (HTTPS)
- 检查防火墙设置
- 尝试刷新浏览器

### Q: 游戏逻辑错误？
**A:**
- 查看服务器日志
- 检查手牌评估算法
- 提交 Issue 并附加具体情况

## 📈 性能优化

- ✅ 消息压缩 - 减少 WebSocket 传输
- ✅ 状态同步优化 - 仅发送变化的数据
- ✅ 客户端缓存 - 减少重复计算
- ✅ 渐进式加载 - UI 快速响应

## 🔒 安全性

- ✅ 输入验证 - 所有用户输入都被验证
- ✅ 速率限制 - 防止滥用
- ✅ WebSocket 认证 - 连接验证
- ✅ 筹码校验 - 防止作弊

## 📝 更新日志

### v1.0.0 (2026-06-26)
- ✨ 初始发布
- 🎮 完整的德州扑克游戏
- 💻 前后端分离架构
- 🔄 实时多人同步

## 🚧 未来计划

- [ ] 数据库集成（PostgreSQL）
- [ ] 玩家账户系统
- [ ] 排行榜和统计
- [ ] 游戏回放功能
- [ ] AI 对手
- [ ] 移动应用
- [ ] 语音聊天
- [ ] 自定义房间设置

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 💬 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 Email: contact@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/880688/poker-mastermaster/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/880688/poker-mastermaster/discussions)

---

**Made with ❤️ by Poker Master Team**

⭐ 如果对你有帮助，请给个星星吧！
