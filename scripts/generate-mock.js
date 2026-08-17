const fs = require('fs');
const path = require('path');

const brandsData = [
  {
    brand: '배달의민족',
    category: '배달·포장',
    url: 'https://baemin.com',
    benefits: [
      { type: '무료배송', title: '알뜰배달 배달비 100% 무료 쿠폰', badge: '100% OFF', details: '배민 알뜰배달 이용 시 배달비 전액 무료 혜택!' },
      { type: '신규가입', title: '배민 첫 주문 1만원 파격 할인', badge: '10,000원', details: '아직 배민을 안 써보셨나요? 첫 주문 즉시 1만원 할인!' },
      { type: '타임세일', title: 'B마트 저녁 8시 50% 반값 타임특가', badge: '50% OFF', details: '매일 저녁 8시, B마트 인기 상품 반값 핫딜' },
      { type: '포장할인', title: '가까운 매장 방문 포장 시 3,000원 쿠폰', badge: '3,000원', details: '퇴근길 픽업하고 배달비 아끼고 3천원 더 할인받기' }
    ]
  },
  {
    brand: '스타벅스',
    category: '외식·카페',
    url: 'https://starbucks.co.kr',
    benefits: [
      { type: '1+1', title: '아이스 아메리카노 1+1 쿠폰 (사이렌오더 전용)', badge: '1+1', details: '한 잔 가격에 두 잔을! 친구와 함께 시원하게 즐기세요.' },
      { type: '굿즈할인', title: '시즌 한정 텀블러/머그 30% 장바구니 할인', badge: '30% OFF', details: 'MD 상품 장바구니 결제 시 즉시 30% 할인 적용' },
      { type: '세트할인', title: '브런치 샌드위치+제조음료 세트 2,000원 할인', badge: '2,000원', details: '든든한 아침을 위한 스타벅스 브런치 페어링 혜택' },
      { type: '리워드', title: '스타벅스 리워드 신규 가입 시 5,000원 충전', badge: '5,000원', details: '신규 가입 후 첫 골드 충전 시 5천원 추가 적립' }
    ]
  },
  {
    brand: '쿠팡',
    category: '종합몰',
    url: 'https://coupang.com',
    benefits: [
      { type: '무료체험', title: '로켓와우 멤버십 첫 달 100% 무료 체험', badge: '100% FREE', details: '무조건 무료배송, 무료반품! 쿠팡 와우 멤버십 한 달 무료' },
      { type: '직구할인', title: '로켓직구 첫 구매 10,000원 웰컴 쿠폰', badge: '10,000원', details: '복잡한 해외직구를 로켓배송으로! 첫 구매 혜택' },
      { type: '음식배달', title: '쿠팡이츠 매 주문 10% 무제한 자동 할인', badge: '10% OFF', details: '와우 회원이라면 쿠팡이츠 시킬 때마다 무조건 10% 할인' },
      { type: '특가', title: '골드박스 매일 아침 7시 최대 70% 특가', badge: '70% OFF', details: '매일 업데이트되는 묻지마 초특가 골드박스 전용 혜택' }
    ]
  },
  {
    brand: '밀리의 서재',
    category: '도서·컨텐츠',
    url: 'https://millie.co.kr',
    benefits: [
      { type: '무료체험', title: '15만권 베스트셀러 첫 달 무료', badge: '1개월 FREE', details: '가입 즉시 한 달간 무제한 독서 가능' },
      { type: '통신사', title: 'LGU+ 고객 전용 구독료 30% 중복 캐시백', badge: '30% 캐시백', details: '유플러스 고객이라면 통신요금 결제 시 30% 할인' },
      { type: '오디오북', title: '유명 셀럽이 읽어주는 오디오북 50% 특가', badge: '50% OFF', details: '눈이 피곤할 땐 듣는 독서! 오디오북 단독 할인' }
    ]
  },
  {
    brand: '야놀자',
    category: '여행·숙박',
    url: 'https://yanolja.com',
    benefits: [
      { type: '숙박할인', title: '국내 프리미엄 호텔 선착순 5만원 중복 쿠폰', badge: '50,000원', details: '호캉스 기획전 전용 파격 할인' },
      { type: '교통할인', title: 'KTX+숙소 묶음 예약 시 KTX 최대 50% 할인', badge: '50% OFF', details: '기차표와 숙소를 한 번에! 기차표 반값 혜택' },
      { type: '놀거리', title: '전국 워터파크/놀이공원 1+1 입장권', badge: '1+1', details: '주말 데이트 코스 야놀자 레저 티켓 1+1 특가' }
    ]
  },
  {
    brand: '올리브영',
    category: '뷰티·패션',
    url: 'https://oliveyoung.co.kr',
    benefits: [
      { type: '오늘드림', title: '오늘드림 첫 이용 시 배송비 100% 무료', badge: '100% OFF', details: '올리브영 매장에서 집까지 3시간 내 즉시 배송 무료' },
      { type: '정기세일', title: '올영세일 최대 70% 특가 + 5,000원 중복쿠폰', badge: '70% OFF', details: '놓칠 수 없는 올리브영 정기 빅세일 전용 혜택' },
      { type: '프리미엄', title: '프리미엄 화장품관 럭셔리 라인 20% 페이백', badge: '20% 페이백', details: '백화점 브랜드를 올리브영에서 20% 혜택받고 구매' }
    ]
  },
  {
    brand: '알리익스프레스',
    category: '해외직구',
    url: 'https://aliexpress.com',
    benefits: [
      { type: '초이스', title: '초이스 데이 5일배송 + 전품목 50% 쿠폰', badge: '50% OFF', details: '알리가 5일 만에 쏜다! 50% 할인 코드 [ALI50]' },
      { type: '천원마트', title: '단돈 천원! 3개 담으면 무료배송 핫딜', badge: '1,000원', details: '가성비 끝판왕 천원마트에서 마음껏 고르세요' }
    ]
  }
];

// 추가로 무작위 브랜드를 만들어 총 80개를 채움
const extraBrands = ['무신사', '지그재그', '에이블리', '여기어때', 'G마켓', '11번가', '토스', '네이버페이', '카카오페이', '넷플릭스', '티빙', '웨이브'];
const extraBenefits = [
  { type: '쿠폰팩', title: '전 국민 누구나 즉시 지급 3종 쿠폰팩', badge: '3종 세트', details: '조건 없이 누구에게나 드리는 파격 3종 세트' },
  { type: '결제할인', title: '현대/삼성/국민카드 결제 시 15% 청구할인', badge: '15% OFF', details: '결제 시 제휴 신용카드 선택하면 자동 청구할인' },
  { type: '리워드', title: '매일 출석체크 시 최대 10,000 포인트 당첨', badge: '10,000 P', details: '매일 앱 열고 클릭 한 번이면 포인트가 팡팡' },
  { type: '타임특가', title: '매일 정오 12시 런칭! 반값 타임특가', badge: '50% OFF', details: '선착순 한정 수량 반값 특가를 놓치지 마세요' }
];

// Helper to generate SEO slugs
const generateSlug = (str) => {
  return str.replace(/[\[\]]/g, '').replace(/[\s\+]+/g, '-').replace(/[^a-zA-Z0-9가-힣\-]/g, '').toLowerCase() + '-coupon';
};

let coupons = [];
let idCounter = 1;

// 1. 수동으로 정의된 다중 혜택 데이터 삽입
brandsData.forEach(brandObj => {
  brandObj.benefits.forEach(benefit => {
    coupons.push({
      id: `m_${idCounter++}`,
      slug: generateSlug(`${brandObj.brand}-${benefit.type}`),
      brand: brandObj.brand,
      title: benefit.title,
      category: brandObj.category,
      code: Math.random() > 0.5 ? `PROMO${Math.floor(Math.random()*1000)}` : null,
      url: brandObj.url,
      isExpired: false,
      badge: benefit.badge,
      validUntil: `2026-12-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      usageGuide: `1. ${brandObj.brand} 앱 접속\n2. [${benefit.type}] 이벤트 페이지 이동\n3. 혜택 확인 후 적용`,
      details: benefit.details
    });
  });
});

// 2. 남은 슬롯을 랜덤 혜택으로 채워서 정확히 80개로 맞춤
while (coupons.length < 80) {
  const brand = extraBrands[Math.floor(Math.random() * extraBrands.length)];
  const benefit = extraBenefits[Math.floor(Math.random() * extraBenefits.length)];
  const discount = Math.floor(Math.random() * 40 + 10);
  
  const title = `[${brand}] ${benefit.title.replace('15%', `${discount}%`).replace('반값', `${discount}%`)}`;
  
  coupons.push({
    id: `r_${idCounter++}`,
    slug: generateSlug(`${brand}-${discount}percent-off`),
    brand: brand,
    title: title,
    category: '종합몰',
    code: `CODE${discount}`,
    url: 'https://example.com',
    isExpired: Math.random() > 0.8,
    badge: benefit.badge.includes('%') ? `${discount}% OFF` : benefit.badge,
    validUntil: `2026-12-31`,
    usageGuide: `1. ${brand} 앱 접속\n2. 결제창에서 자동 적용`,
    details: benefit.details
  });
}

// 80개 초과시 자르기
coupons = coupons.slice(0, 80);

// 순서 무작위로 섞기 (한 앱의 혜택이 몰려있지 않게 분산)
for (let i = coupons.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [coupons[i], coupons[j]] = [coupons[j], coupons[i]];
}

const dataPath = path.join(__dirname, '../data/coupons.json');
fs.writeFileSync(dataPath, JSON.stringify(coupons, null, 2), 'utf-8');
console.log(`[Multi-Benefit Algorithm] Successfully generated ${coupons.length} distinct coupons across multiple apps.`);
