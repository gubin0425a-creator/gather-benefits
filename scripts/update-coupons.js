const fs = require('fs');
const path = require('path');

console.log('[Auto-Scraper Bot] Starting 1-hour scheduled targeting update...');

const dataPath = path.join(__dirname, '../data/coupons.json');
let coupons = [];

if (fs.existsSync(dataPath)) {
  coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// 1. 만료 처리 (무작위)
const activeCoupons = coupons.filter(c => !c.isExpired);
const numToExpire = Math.floor(Math.random() * 3) + 1;
for (let i = 0; i < numToExpire && i < activeCoupons.length; i++) {
  const index = Math.floor(Math.random() * activeCoupons.length);
  activeCoupons[index].isExpired = true;
  activeCoupons[index].badge = '종료됨';
  activeCoupons[index].title = `[마감] ${activeCoupons[index].title}`;
}

// 2. 신규 파격 혜택(0원에 가장 가까운) 수집 시뮬레이션
const maxDiscount = Math.floor(Math.random() * 20) + 80; // 80% ~ 99% 할인
const newCoupon = {
  id: `auto-target-${Date.now()}`,
  brand: 'VIP Special',
  title: `[긴급] 0원에 수렴하는 ${maxDiscount}% 파격 할인`,
  category: '종합몰',
  code: `VIP${maxDiscount}`,
  url: 'https://example.com/vip',
  isExpired: false,
  badge: `${maxDiscount}% OFF`,
  validUntil: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString().split('T')[0],
  usageGuide: '1. 한정 시간 내 결제\n2. 즉시 자동 할인',
  details: '타겟팅 알고리즘이 찾아낸 가장 0원에 가까운 극강의 혜택입니다.'
};

coupons.push(newCoupon);

// 3. 타겟팅 정렬 알고리즘: 할인율(badge의 숫자)이 높을수록(0원에 가까울수록) 위로 배치
coupons.sort((a, b) => {
  // 만료된 것은 맨 아래로
  if (a.isExpired && !b.isExpired) return 1;
  if (!a.isExpired && b.isExpired) return -1;
  
  // badge에서 숫자만 추출 (ex: "50% OFF" -> 50)
  const getDiscount = (c) => {
    const match = c.badge.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };
  
  return getDiscount(b) - getDiscount(a);
});

// 4. 슬롯 80개로 최적화 (가장 안 좋은 하위 데이터 삭제)
if (coupons.length > 80) {
  coupons = coupons.slice(0, 80);
}

fs.writeFileSync(dataPath, JSON.stringify(coupons, null, 2), 'utf-8');
console.log(`[Auto-Scraper Bot] Successfully targeted & sorted. Total slots: ${coupons.length}`);
