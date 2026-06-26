// WebSocket 连接
let ws = null;
let playerId = null;
let currentPlayer = null;
let gameState = null;
const gameLog = [];

// 连接到服务器
function connectToServer() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('✅ 已连接到服务器');
        addLog('已连接到游戏服务器');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
    };

    ws.onerror = (error) => {
        console.error('❌ WebSocket 错误:', error);
        addLog('连接出错');
    };

    ws.onclose = () => {
        console.log('❌ 连接已断开');
        addLog('连接已断开，5秒后重新连接...');
        setTimeout(connectToServer, 5000);
    };
}

// 处理服务器消息
function handleServerMessage(data) {
    switch (data.type) {
        case 'PLAYER_LIST':
            updatePlayerList(data.players);
            break;
        case 'GAME_STATE':
            updateGameState(data);
            break;
        case 'ERROR':
            addLog(`❌ ${data.message}`);
            break;
    }
}

// 更新玩家列表
function updatePlayerList(players) {
    document.getElementById('playerCount').textContent = players.length;
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <div class="name">👤 ${player.name}</div>
            <div class="chips">💰 ${player.chips}</div>
        `;
        playersList.appendChild(playerItem);
    });
}

// 更新游戏状态
function updateGameState(data) {
    currentPlayer = data.player;
    gameState = data.game;
    
    // 更新玩家筹码
    document.getElementById('chipsDisplay').textContent = currentPlayer.chips;
    document.getElementById('currentBet').textContent = currentPlayer.bet;
    document.getElementById('playerStatus').textContent = getStatusLabel(currentPlayer.status);
    
    // 更新手牌
    displayCards(currentPlayer.hand, document.getElementById('playerHand'));
    
    // 更新社区牌
    if (gameState && gameState.communityCards) {
        displayCards(gameState.communityCards, document.getElementById('communityCards'));
    }
    
    // 更新其他玩家
    if (data.players) {
        updateOtherPlayers(data.players, currentPlayer.id);
    }
    
    // 更新底池
    if (gameState && gameState.totalPot) {
        document.getElementById('potDisplay').textContent = `底池: ${gameState.totalPot}`;
    }
    
    // 更新游戏状态
    const statusElement = document.getElementById('gameStatus');
    if (gameState) {
        statusElement.textContent = `阶段: ${getStageLabel(gameState.stage)}`;
        statusElement.classList.add('active');
    }
}

// 更新其他玩家显示
function updateOtherPlayers(players, currentPlayerId) {
    const container = document.getElementById('otherPlayersContainer');
    container.innerHTML = '';
    
    players.forEach(player => {
        if (player.id !== currentPlayerId) {
            const playerArea = document.createElement('div');
            playerArea.className = 'player-area';
            playerArea.innerHTML = `
                <div class="name">👤 ${player.name}</div>
                <div class="chips">💰 ${player.chips}</div>
                ${player.bet > 0 ? `<div class="bet">下注: ${player.bet}</div>` : ''}
                <div class="status">${getStatusLabel(player.status)}</div>
            `;
            container.appendChild(playerArea);
        }
    });
}

// 显示牌
function displayCards(cards, container) {
    const slots = container.querySelectorAll('.card-slot');
    
    slots.forEach((slot, index) => {
        slot.classList.remove('filled', 'hearts', 'diamonds', 'clubs', 'spades');
        
        if (cards[index]) {
            const card = cards[index];
            slot.classList.add('filled');
            
            // 添加花色类
            if (card.suit === '♥' || card.suit === '♦') {
                slot.classList.add('hearts');
            } else {
                slot.classList.add('spades');
            }
            
            slot.textContent = `${card.rank}${card.suit}`;
        } else {
            slot.textContent = '?';
        }
    });
}

// 发送消息到服务器
function sendToServer(action) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(action));
    }
}

// 添加日志
function addLog(message) {
    gameLog.push(message);
    const logContent = document.getElementById('gameLog');
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = message;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}

// 状态标签
function getStatusLabel(status) {
    const labels = {
        'idle': '就绪',
        'active': '活跃',
        'folded': '弃牌',
        'checked': '检查'
    };
    return labels[status] || status;
}

// 阶段标签
function getStageLabel(stage) {
    const labels = {
        'preflop': '翻牌前',
        'flop': '翻牌圈',
        'turn': '转牌圈',
        'river': '河牌圈'
    };
    return labels[stage] || stage;
}

// 事件监听器
document.getElementById('setNameBtn').addEventListener('click', () => {
    const name = document.getElementById('playerName').value.trim();
    if (name) {
        sendToServer({
            type: 'SET_NAME',
            name: name
        });
        addLog(`✓ 昵称已设置为: ${name}`);
    }
});

document.getElementById('startGameBtn').addEventListener('click', () => {
    sendToServer({
        type: 'START_GAME'
    });
    addLog('📢 开始了一个新游戏...');
});

document.getElementById('betBtn').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('betAmount').value);
    if (amount > 0 && amount <= currentPlayer.chips) {
        sendToServer({
            type: 'BET',
            amount: amount
        });
        addLog(`💰 你下注了: ${amount}`);
    } else {
        addLog('❌ 下注金额无效');
    }
});

document.getElementById('checkBtn').addEventListener('click', () => {
    sendToServer({
        type: 'CHECK'
    });
    addLog('✓ 你选择了 Check');
});

document.getElementById('foldBtn').addEventListener('click', () => {
    sendToServer({
        type: 'FOLD'
    });
    addLog('✕ 你选择了弃牌');
});

document.getElementById('raiseBtn').addEventListener('click', () => {
    const amount = parseInt(document.getElementById('betAmount').value);
    if (amount > 0 && amount <= currentPlayer.chips) {
        sendToServer({
            type: 'BET',
            amount: amount * 2
        });
        addLog(`⬆ 你加注了: ${amount * 2}`);
    }
});

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎰 Poker Master 已加载');
    connectToServer();
    addLog('🎮 欢迎来到 Poker Master！');
});
