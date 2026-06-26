// 牌型定义
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// 手牌评级
const HAND_RANKS = {
  HIGH_CARD: 1,
  ONE_PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL_FLUSH: 10
};

// 创建牌组
function createDeck() {
  const deck = [];
  for (let suit of SUITS) {
    for (let rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return shuffle(deck);
}

// 洗牌
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 发牌
function dealCards(deck, count) {
  return deck.splice(0, count);
}

// 评估手牌
function evaluateHand(cards) {
  if (cards.length < 5) return { rank: HAND_RANKS.HIGH_CARD, value: 0 };

  const sorted = cards.sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
  const ranks = sorted.map(c => RANK_VALUES[c.rank]);
  const suits = sorted.map(c => c.suit);

  // 检查同花
  const isFlush = suits.slice(0, 5).every(s => s === suits[0]);

  // 检查顺子
  const isStraight = checkStraight(ranks);

  // 检查对子、三条、四条
  const counts = {};
  ranks.forEach(r => counts[r] = (counts[r] || 0) + 1);
  const groupedByCount = {};
  Object.entries(counts).forEach(([rank, count]) => {
    groupedByCount[count] = (groupedByCount[count] || []).concat(parseInt(rank));
  });

  // 判断手牌类型
  if (isStraight && isFlush) {
    return {
      rank: ranks[0] === 14 ? HAND_RANKS.ROYAL_FLUSH : HAND_RANKS.STRAIGHT_FLUSH,
      value: Math.max(...ranks)
    };
  }
  if (groupedByCount[4]) {
    return { rank: HAND_RANKS.FOUR_OF_A_KIND, value: groupedByCount[4][0] };
  }
  if (groupedByCount[3] && groupedByCount[2]) {
    return { rank: HAND_RANKS.FULL_HOUSE, value: groupedByCount[3][0] };
  }
  if (isFlush) {
    return { rank: HAND_RANKS.FLUSH, value: Math.max(...ranks) };
  }
  if (isStraight) {
    return { rank: HAND_RANKS.STRAIGHT, value: Math.max(...ranks) };
  }
  if (groupedByCount[3]) {
    return { rank: HAND_RANKS.THREE_OF_A_KIND, value: groupedByCount[3][0] };
  }
  if (groupedByCount[2]?.length === 2) {
    return {
      rank: HAND_RANKS.TWO_PAIR,
      value: Math.max(...groupedByCount[2])
    };
  }
  if (groupedByCount[2]) {
    return { rank: HAND_RANKS.ONE_PAIR, value: groupedByCount[2][0] };
  }

  return { rank: HAND_RANKS.HIGH_CARD, value: Math.max(...ranks) };
}

// 检查顺子
function checkStraight(ranks) {
  const uniqueRanks = [...new Set(ranks)].sort((a, b) => b - a);
  if (uniqueRanks.length < 5) return false;

  for (let i = 0; i <= uniqueRanks.length - 5; i++) {
    if (uniqueRanks[i] - uniqueRanks[i + 4] === 4) {
      return true;
    }
  }

  // 检查 A-2-3-4-5 的情况
  if (uniqueRanks.includes(14) && uniqueRanks.includes(2) && uniqueRanks.includes(3) && uniqueRanks.includes(4) && uniqueRanks.includes(5)) {
    return true;
  }

  return false;
}

// 获取获胜者
function getWinner(player1Hand, player2Hand) {
  const hand1 = evaluateHand(player1Hand);
  const hand2 = evaluateHand(player2Hand);

  if (hand1.rank !== hand2.rank) {
    return hand1.rank > hand2.rank ? 1 : 2;
  }
  return hand1.value >= hand2.value ? 1 : 2;
}

module.exports = {
  createDeck,
  dealCards,
  evaluateHand,
  getWinner,
  HAND_RANKS
};
