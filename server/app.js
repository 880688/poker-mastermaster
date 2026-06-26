const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// 游戏状态管理
const gameState = {
  players: new Map(),
  currentGame: null,
  gameId: 0
};

// 工具函数
const { createDeck, dealCards, evaluateHand, getWinner } = require('./utils/gameLogic');

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('新玩家连接');
  const playerId = Date.now().toString();
  
  gameState.players.set(playerId, {
    id: playerId,
    ws: ws,
    name: `Player_${playerId.slice(-4)}`,
    chips: 1000,
    hand: [],
    status: 'idle',
    bet: 0
  });

  // 广播玩家列表
  broadcastPlayerList();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleGameAction(playerId, data);
    } catch (error) {
      console.error('消息处理错误:', error);
    }
  });

  ws.on('close', () => {
    console.log('玩家断开连接:', playerId);
    gameState.players.delete(playerId);
    broadcastPlayerList();
  });
});

// 处理游戏操作
function handleGameAction(playerId, action) {
  const player = gameState.players.get(playerId);
  if (!player) return;

  switch (action.type) {
    case 'SET_NAME':
      player.name = action.name.slice(0, 20);
      broadcastPlayerList();
      break;

    case 'START_GAME':
      if (gameState.players.size >= 2) {
        startNewGame();
      } else {
        sendToPlayer(playerId, {
          type: 'ERROR',
          message: '需要至少2个玩家开始游戏'
        });
      }
      break;

    case 'BET':
      if (player.chips >= action.amount) {
        player.chips -= action.amount;
        player.bet += action.amount;
        if (!gameState.currentGame) gameState.currentGame = {};
        gameState.currentGame.totalPot = (gameState.currentGame.totalPot || 0) + action.amount;
        broadcastGameState();
      }
      break;

    case 'FOLD':
      player.status = 'folded';
      broadcastGameState();
      break;

    case 'CHECK':
      player.status = 'checked';
      broadcastGameState();
      break;
  }
}

// 开始新游戏
function startNewGame() {
  gameState.gameId++;
  gameState.currentGame = {
    id: gameState.gameId,
    deck: createDeck(),
    stage: 'preflop',
    pot: 0,
    communityCards: [],
    hands: new Map()
  };

  // 为每个玩家发牌
  const players = Array.from(gameState.players.values());
  players.forEach(player => {
    player.status = 'active';
    player.bet = 0;
    player.hand = dealCards(gameState.currentGame.deck, 2);
    gameState.currentGame.hands.set(player.id, player.hand);
  });

  broadcastGameState();
}

// 广播游戏状态
function broadcastGameState() {
  gameState.players.forEach((player) => {
    if (player.ws.readyState === WebSocket.OPEN) {
      const gameInfo = gameState.currentGame ? {
        ...gameState.currentGame,
        hands: undefined // 不发送其他玩家的手牌
      } : null;

      player.ws.send(JSON.stringify({
        type: 'GAME_STATE',
        player: {
          id: player.id,
          name: player.name,
          chips: player.chips,
          hand: player.hand,
          bet: player.bet,
          status: player.status
        },
        game: gameInfo,
        players: Array.from(gameState.players.values()).map(p => ({
          id: p.id,
          name: p.name,
          chips: p.chips,
          status: p.status,
          bet: p.bet,
          cardCount: p.hand.length
        }))
      }));
    }
  });
}

// 广播玩家列表
function broadcastPlayerList() {
  const playerList = Array.from(gameState.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    chips: p.chips,
    status: p.status
  }));

  gameState.players.forEach((player) => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify({
        type: 'PLAYER_LIST',
        players: playerList
      }));
    }
  });
}

// 发送消息给单个玩家
function sendToPlayer(playerId, message) {
  const player = gameState.players.get(playerId);
  if (player && player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(message));
  }
}

// REST API 端点
app.get('/api/stats', (req, res) => {
  res.json({
    activePlayers: gameState.players.size,
    currentGame: gameState.currentGame ? gameState.currentGame.id : null,
    totalGames: gameState.gameId
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎰 Poker Master Server 运行在 http://localhost:${PORT}`);
});

module.exports = { app, wss };
