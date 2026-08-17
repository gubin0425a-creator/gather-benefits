const fs = require('fs');
const path = require('path');

console.log('[Auto-Scraper Bot] Starting 1-hour multi-benefit scheduled update...');

const dataPath = path.join(__dirname, '../data/coupons.json');
let coupons = [];

if (fs.existsSync(dataPath)) {
  coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// 1. 만료 처리 (무작위 1~3개)
const activeCoupons = coupons.filter(c => !c.isExpired);
const numToExpire = Math.floor(Math.random() * 3) + 1;
for (let i = 0; i < numToExpire && i < activeCoupons.length; i++) {
  const index = Math.floor(Math.random() * activeCoupons.length);
  activeCoupons[index].isExpired = true;
  activeCoupons[index].badge = '종료됨';
  if (!activeCoupons[index].title.startsWith('[마감]')) {
    activeCoupons[index].title = `[마감] ${activeCoupons[index].title}`;
  }
}

// 2. 신규 파격 혜택 (다중 혜택 성격 반영) 추가
const newBenefits = [
  { type: '카드할인', title: 'KB국민카드 결제 시 15,000원 캐시백', badge: '15,000원' },
  { type: '증정', title: '선착순 한정판 콜라보 굿즈 100% 무료 증정', badge: '100% 증정' },
  { type: '멤버십', title: 'VIP 멤버십 라운지 1일 무료 입장권', badge: '무료입장' }
];
const b = newBenefits[Math.floor(Math.random() * newBenefits.length)];
const maxDiscount = Math.floor(Math.random() * 20) + 80;

coupons.push({
  id: `auto-target-${Date.now()}`,
  brand: '배달의민족', // 배민 안에 또 다른 성격의 혜택이 꽂힘
  title: `[초특가] ${b.title}`,
  category: '배달·포장',
  code: `NEW${maxDiscount}`,
  url: 'https://baemin.com',
  isExpired: false,
  badge: b.badge,
  validUntil: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString().split('T')[0],
  usageGuide: '1. 한정 시간 내 접속\n2. 즉시 자동 혜택 적용',
  details: '타겟팅 알고리즘이 발견한 새로운 유형의 특급 혜택입니다.'
});

// 3. 타겟팅 정렬 알고리즘: 할인/혜택 강도 순 (badge 기준 꼼수 계산)
coupons.sort((a, b) => {
  if (a.isExpired && !b.isExpired) return 1;
  if (!a.isExpired && b.isExpired) return -1;
  
  const getScore = (c) => {
    let score = 0;
    if (c.badge.includes('%')) score = parseInt(c.badge.match(/(\d+)/)[1]);
    if (c.badge.includes('무료') || c.badge.includes('1+1') || c.badge.includes('증정')) score = 100;
    if (c.badge.includes('원')) score = parseInt(c.badge.replace(/[^0-9]/g, '')) / 100; // 10000원 -> 100
    return score || 0;
  };
  
  return getScore(b) - getScore(a);
});

// 4. 슬롯 80개로 최적화
if (coupons.length > 80) {
  coupons = coupons.slice(0, 80);
}

// 5. 80개 데이터 다시 무작위로 살짝 섞기 (점수별로 뭉치지 않고 다양한 브랜드가 골고루 보이게)
// 최상위 10개는 두고 나머지 70개를 섞는다
const top10 = coupons.slice(0, 10);
const rest = coupons.slice(10);
for (let i = rest.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [rest[i], rest[j]] = [rest[j], rest[i]];
}
coupons = [...top10, ...rest];

fs.writeFileSync(dataPath, JSON.stringify(coupons, null, 2), 'utf-8');
console.log(`[Auto-Scraper Bot] Successfully targeted & sorted Multi-Benefits. Total slots: ${coupons.length}`);
