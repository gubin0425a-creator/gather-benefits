const fs = require('fs');
const path = require('path');

const brands = ['스타벅스', '맥도날드', '올리브영', '배달의민족', '쿠팡이츠', '야놀자', '여기어때', 'G마켓', '11번가', '무신사'];
const categories = ['외식·카페', '배달·포장', '뷰티·패션', '여행·숙박', '종합몰'];

const coupons = [];

for (let i = 1; i <= 100; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const discount = Math.floor(Math.random() * 50 + 10);
  
  coupons.push({
    id: i.toString(),
    brand: brand,
    title: `${brand} 선착순 ${discount}% 파격 할인 쿠폰`,
    category: category,
    code: `PROMO${i}${discount}`,
    url: 'https://example.com',
    isExpired: Math.random() > 0.8, // 20% chance to be expired
    badge: `${discount}% OFF`,
    validUntil: `2026-12-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
    usageGuide: `1. ${brand} 앱 접속\n2. 결제창에서 할인코드 입력\n3. 할인 확인 후 결제`,
    details: `단독 입점 기념! ${brand}에서 준비한 ${discount}% 혜택을 놓치지 마세요. 선착순으로 조기 마감될 수 있습니다.`
  });
}

// Add the original 10 premium coupons at the front
const premiumCoupons = [
  { id: 'p1', brand: '밀리의 서재', title: '첫 달 무료 + LGU+ 중복 캐시백', category: '도서·컨텐츠', code: null, url: 'https://millie.co.kr', isExpired: false, badge: '1개월 FREE', validUntil: '2026-12-31', usageGuide: '...', details: '...' },
  { id: 'p2', brand: '알리익스프레스', title: '초이스 데이 전품목 50% 할인', category: '해외직구', code: 'ALI50', url: 'https://aliexpress.com', isExpired: false, badge: '50% OFF', validUntil: '2026-08-31', usageGuide: '...', details: '...' },
  { id: 'p3', brand: 'AppSumo', title: 'WriteSonic AI 마케팅 툴 평생 소장', category: 'AI·소프트웨어', code: null, url: 'https://appsumo.com', isExpired: false, badge: '♾️ 평생 결제', validUntil: '선착순 한정', usageGuide: '...', details: '...' },
  { id: 'p4', brand: 'Gemini Advanced', title: 'Google One AI 프리미엄 2개월 무료 체험', category: 'AI·소프트웨어', code: null, url: 'https://gemini.google.com/advanced', isExpired: false, badge: '2개월 무료', validUntil: '2026-12-31', usageGuide: '...', details: '...' },
  { id: 'p5', brand: '쿠팡 (Coupang)', title: '로켓와우 멤버십 신규 가입 첫 달 무료', category: '해외직구', code: null, url: 'https://coupang.com', isExpired: false, badge: '신규 가입', validUntil: '상시 진행', usageGuide: '...', details: '...' },
  { id: 'p6', brand: 'Trip.com (트립닷컴)', title: '전 세계 항공권 및 호텔 최대 10% 추가 할인', category: '여행·숙박', code: 'TRIP10', url: 'https://kr.trip.com', isExpired: false, badge: '10% 쿠폰', validUntil: '2026-09-30', usageGuide: '...', details: '...' },
  { id: 'p7', brand: 'Notion', title: '대학생/교직원 인증 시 Plus 요금제 평생 무료', category: 'AI·소프트웨어', code: null, url: 'https://notion.so/education', isExpired: false, badge: '학생 무료', validUntil: '졸업 시까지', usageGuide: '...', details: '...' },
  { id: 'p8', brand: 'ChatGPT Plus', title: '[마감] 개발자 API 연동 크레딧 $50 리워드', category: 'AI·소프트웨어', code: null, url: '#', isExpired: true, badge: '종료됨', validUntil: '2025-12-31', usageGuide: '...', details: '...' },
  { id: 'p9', brand: '야놀자', title: '가을 호캉스 기획전! 선착순 5만원 중복 할인', category: '여행·숙박', code: 'AUTUMN50', url: 'https://yanolja.com', isExpired: false, badge: 'HOT 핫딜', validUntil: '2026-10-31', usageGuide: '...', details: '...' },
  { id: 'p10', brand: 'Temu (테무)', title: '[마감] 신규 가입 15만원 크레딧팩', category: '해외직구', code: null, url: '#', isExpired: true, badge: '종료됨', validUntil: '2026-01-01', usageGuide: '...', details: '...' },
];

const finalData = [...premiumCoupons, ...coupons].slice(0, 100);

const dataPath = path.join(__dirname, '../data/coupons.json');
fs.writeFileSync(dataPath, JSON.stringify(finalData, null, 2), 'utf-8');
console.log(`Successfully generated ${finalData.length} coupons in data/coupons.json`);
