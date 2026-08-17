const fs = require('fs');
const path = require('path');

console.log('[Auto-Scraper Bot] Starting 2-hour scheduled update...');

const dataPath = path.join(__dirname, '../data/coupons.json');
let coupons = [];

if (fs.existsSync(dataPath)) {
  coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// 1. 만료 처리 시뮬레이션: 무작위로 1~3개의 활성 쿠폰을 만료 처리
const activeCoupons = coupons.filter(c => !c.isExpired);
const numToExpire = Math.floor(Math.random() * 3) + 1;

for (let i = 0; i < numToExpire && i < activeCoupons.length; i++) {
  const index = Math.floor(Math.random() * activeCoupons.length);
  activeCoupons[index].isExpired = true;
  activeCoupons[index].badge = '종료됨';
  activeCoupons[index].title = `[마감] ${activeCoupons[index].title}`;
}

// 2. 신규 혜택 수집 시뮬레이션: 가장 오래된 만료 쿠폰을 지우고 새 쿠폰 추가
const newCoupon = {
  id: `auto-${Date.now()}`,
  brand: 'Netflix',
  title: '스탠다드 요금제 첫 달 50% 할인 프로모션',
  category: '도서·컨텐츠',
  code: 'NETFLIX50',
  url: 'https://netflix.com',
  isExpired: false,
  badge: '🔥 NEW',
  validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
  usageGuide: '1. 넷플릭스 신규 가입\n2. 결제 단계에서 자동 할인 적용',
  details: '단 7일간 진행되는 게릴라 혜택입니다!'
};

const expiredIndexes = coupons.map((c, i) => c.isExpired ? i : -1).filter(i => i !== -1);
if (expiredIndexes.length > 5) {
  coupons.splice(expiredIndexes[0], 1); // 오래된 것 삭제
}
coupons.unshift(newCoupon); // 맨 앞에 새 쿠폰 추가

// 100개 유지
if (coupons.length > 100) {
  coupons.pop();
}

fs.writeFileSync(dataPath, JSON.stringify(coupons, null, 2), 'utf-8');
console.log(`[Auto-Scraper Bot] Successfully updated coupons. Total: ${coupons.length}`);
