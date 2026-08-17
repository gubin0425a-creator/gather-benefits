'use client';

import { useState } from 'react';

const MOCK_COUPONS = [
  { 
    id: '1', brand: '밀리의 서재', title: '첫 달 무료 + LGU+ 중복 캐시백', category: '도서·컨텐츠', code: null, url: 'https://millie.co.kr', isExpired: false, badge: '1개월 FREE',
    validUntil: '2026-12-31', usageGuide: '1. 아래 링크로 밀리의 서재 접속\n2. 회원가입 시 첫 달 무료 자동 적용\n3. 결제 수단에서 LGU+ 통신사 결제 선택 시 추가 캐시백', details: '독서의 계절, 15만 권의 베스트셀러를 무제한으로 즐겨보세요! 통신사 중복 할인까지 적용되어 가장 저렴하게 시작할 수 있는 완벽한 기회입니다.'
  },
  { 
    id: '2', brand: '알리익스프레스', title: '초이스 데이 전품목 50% 할인', category: '해외직구', code: 'ALI50', url: 'https://aliexpress.com', isExpired: false, badge: '50% OFF',
    validUntil: '2026-08-31', usageGuide: '1. 장바구니에 초이스(Choice) 상품 담기\n2. 결제 단계에서 프로모션 코드 [ALI50] 입력\n3. 즉시 50% 할인된 가격 확인 후 결제', details: '장바구니에 담아두셨던 위시리스트를 반값에 득템할 수 있는 절호의 찬스! 전 세계 최저가 혜택을 놓치지 마세요.'
  },
  { 
    id: '3', brand: 'AppSumo', title: 'WriteSonic AI 마케팅 툴 평생 소장', category: 'AI·소프트웨어', code: null, url: 'https://appsumo.com', isExpired: false, badge: '♾️ 평생 결제',
    validUntil: '선착순 한정', usageGuide: '1. 앱수모 공식 홈페이지 접속\n2. WriteSonic 딜 페이지에서 Buy Now 클릭\n3. 1회 결제로 매월 구독료 없이 평생 사용', details: '더 이상 매월 비싼 구독료를 내지 마세요! 단 한 번의 결제로 강력한 AI 카피라이팅 툴을 평생 소장할 수 있는 역대급 딜입니다.'
  },
  { 
    id: '4', brand: 'Gemini Advanced', title: 'Google One AI 프리미엄 2개월 무료 체험', category: 'AI·소프트웨어', code: null, url: 'https://gemini.google.com/advanced', isExpired: false, badge: '2개월 무료',
    validUntil: '2026-12-31', usageGuide: '1. 아래 버튼을 눌러 구글 One 페이지 접속\n2. 2개월 무료 체험 시작하기 클릭\n3. 구글의 가장 강력한 AI 모델인 Gemini 1.5 Pro를 무료로 경험', details: 'Google의 최상위 AI 모델을 2개월 동안 0원에 써볼 수 있는 환상적인 기회! 업무 효율을 200% 끌어올려 보세요.'
  },
  { 
    id: '5', brand: '쿠팡 (Coupang)', title: '로켓와우 멤버십 신규 가입 첫 달 무료', category: '해외직구', code: null, url: 'https://coupang.com', isExpired: false, badge: '신규 가입',
    validUntil: '상시 진행', usageGuide: '1. 쿠팡 앱 설치 또는 웹사이트 접속\n2. 로켓와우 멤버십 가입 페이지 이동\n3. 첫 달 무료 혜택 받고 묻지도 따지지도 않는 무료반품 경험하기', details: '무조건 무료 배송에 무료 반품까지! 대한민국 1등 멤버십의 압도적인 편리함을 한 달 동안 무료로 맘껏 누려보세요.'
  },
  { 
    id: '6', brand: 'Trip.com (트립닷컴)', title: '전 세계 항공권 및 호텔 최대 10% 추가 할인', category: '여행·숙박', code: 'TRIP10', url: 'https://kr.trip.com', isExpired: false, badge: '10% 쿠폰',
    validUntil: '2026-09-30', usageGuide: '1. 여행할 도시와 날짜 선택\n2. 결제창에서 할인 코드 [TRIP10] 입력\n3. 즉시 10% 추가 할인 혜택 적용', details: '꿈꾸던 해외여행, 더 늦기 전에 떠나보세요! 트립닷컴이 제공하는 최저가에 10% 추가 할인을 얹어 가장 스마트하게 여행을 준비할 수 있습니다.'
  },
  { 
    id: '7', brand: 'Notion', title: '대학생/교직원 인증 시 Plus 요금제 평생 무료', category: 'AI·소프트웨어', code: null, url: 'https://notion.so/education', isExpired: false, badge: '학생 무료',
    validUntil: '졸업 시까지', usageGuide: '1. 노션 가입 시 학교 이메일(.edu 또는 .ac.kr) 사용\n2. 설정 > 업그레이드 탭에서 학생 인증 버튼 클릭\n3. 무제한 파일 업로드가 가능한 Plus 요금제 무료 활성화', details: '과제 정리부터 취업 포트폴리오까지 노션 하나면 끝! 학생이라면 이 강력한 툴을 돈 한 푼 내지 않고 무제한으로 쓸 수 있습니다.'
  },
  { 
    id: '8', brand: 'ChatGPT Plus', title: '[마감] 개발자 API 연동 크레딧 $50 리워드', category: 'AI·소프트웨어', code: null, url: '#', isExpired: true, badge: '종료됨',
    validUntil: '2025-12-31', usageGuide: '프로모션이 종료되었습니다.', details: '해당 프로모션은 선착순 소진으로 조기 마감되었습니다. 다음 혜택을 기대해 주세요!'
  },
  { 
    id: '9', brand: '야놀자', title: '가을 호캉스 기획전! 선착순 5만원 중복 할인', category: '여행·숙박', code: 'AUTUMN50', url: 'https://yanolja.com', isExpired: false, badge: 'HOT 핫딜',
    validUntil: '2026-10-31', usageGuide: '1. 야놀자 앱에서 호캉스 기획전 배너 클릭\n2. 원하는 프리미엄 호텔 선택\n3. 결제 시 쿠폰함에서 5만원 할인 쿠폰 [AUTUMN50] 적용', details: '지친 일상에 완벽한 힐링을 선물하세요! 선착순 한정 5만원 파격 할인으로 특급 호텔을 모텔 가격에 예약할 수 있는 기회입니다.'
  },
  { 
    id: '10', brand: 'Temu (테무)', title: '[마감] 신규 가입 15만원 크레딧팩', category: '해외직구', code: null, url: '#', isExpired: true, badge: '종료됨',
    validUntil: '2026-01-01', usageGuide: '프로모션이 종료되었습니다.', details: '해당 프로모션은 종료되었습니다.'
  },
];

export default function GatherBenefitsMain() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [hideExpired, setHideExpired] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);

  const filteredCoupons = MOCK_COUPONS.filter((coupon) => {
    const matchCat = activeCategory === '전체' || coupon.category === activeCategory;
    const matchStatus = hideExpired ? !coupon.isExpired : true;
    return matchCat && matchStatus;
  });

  const openModal = (coupon: any) => {
    if (coupon.isExpired) return;
    setSelectedCoupon(coupon);
    setIsDisclaimerChecked(false);
  };

  const closeModal = () => {
    setSelectedCoupon(null);
    setIsDisclaimerChecked(false);
  };

  const handleRedirect = () => {
    if (isDisclaimerChecked && selectedCoupon) {
      window.open(selectedCoupon.url, '_blank');
      closeModal();
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative">
      {/* 글로벌 네비게이션(GNB) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">Gather Benefits</h1>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold hidden md:block">
            매일 오전/오후 7시 자동 업데이트 봇 가동 중 🚀
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['전체', 'AI·소프트웨어', '해외직구', '여행·숙박', '도서·컨텐츠'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 text-sm font-medium shadow-sm">
            <button onClick={() => setHideExpired(true)} className={`px-4 py-1.5 rounded-md transition-all ${hideExpired ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
              사용 가능만
            </button>
            <button onClick={() => setHideExpired(false)} className={`px-4 py-1.5 rounded-md transition-all ${!hideExpired ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}`}>
              종료 포함
            </button>
          </div>
        </div>

        {/* 쿠폰 그리드 렌더링 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCoupons.map((coupon) => (
            <article 
              key={coupon.id} 
              onClick={() => openModal(coupon)}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col ${
                coupon.isExpired ? 'border-gray-200 opacity-50 grayscale' : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-400">{coupon.brand}</span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-black ${coupon.isExpired ? 'bg-gray-800 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
                  {coupon.badge}
                </span>
              </div>
              <h2 className={`text-lg font-bold mb-2 flex-grow line-clamp-2 ${coupon.isExpired ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {coupon.title}
              </h2>
              
              <div className="mt-2 mb-4 text-xs font-medium text-gray-500">
                ⏳ 유효기간: {coupon.validUntil}
              </div>

              <button disabled={coupon.isExpired} className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                coupon.isExpired ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}>
                {coupon.isExpired ? '만료됨' : '상세보기 및 혜택 받기'}
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* [핵심 기능] 혜택 상세 및 면책 조항 모달 */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
          >
            {/* 헤더 */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 text-lg">{selectedCoupon.brand} 혜택 안내</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="p-6 overflow-y-auto">
              
              {/* 면책 조항 (가장 위에 짧게 체크 필수) */}
              <label className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl cursor-pointer mb-6 hover:bg-red-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  checked={isDisclaimerChecked}
                  onChange={(e) => setIsDisclaimerChecked(e.target.checked)}
                />
                <span className="text-sm font-bold text-red-700 leading-tight">
                  [필수 확인] 본 혜택은 제휴사 사정에 따라 사전 예고 없이 변경되거나 조기 종료될 수 있으며, 사이트는 이에 대한 법적 책임을 지지 않음에 동의합니다.
                </span>
              </label>

              {/* 매력적인 상세 조건 */}
              <div className="mb-6">
                <h4 className="text-sm font-black text-indigo-600 mb-2">✨ 이런 혜택이 기다리고 있어요!</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50/50 p-4 rounded-xl">
                  {selectedCoupon.details}
                </p>
              </div>

              {/* 유효 기간 */}
              <div className="mb-6 flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-500">유효기간</h4>
                  <p className="text-sm font-black text-gray-900">{selectedCoupon.validUntil}</p>
                </div>
              </div>

              {/* 아주 자세한 사용법 설명 */}
              <div className="mb-6">
                <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span> 단 1분 만에 혜택 적용하는 방법
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <pre className="text-sm text-gray-700 font-sans whitespace-pre-wrap leading-loose">
                    {selectedCoupon.usageGuide}
                  </pre>
                  {selectedCoupon.code && (
                    <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">적용할 할인 코드</span>
                      <span className="font-mono font-black text-indigo-600 text-lg tracking-widest">{selectedCoupon.code}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 하단 플로팅 고정 영역 (버튼) */}
            <div className="p-5 border-t border-gray-100 bg-white">
              <button 
                onClick={handleRedirect}
                disabled={!isDisclaimerChecked}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                  isDisclaimerChecked 
                    ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDisclaimerChecked ? '🎉 지금 바로 혜택 받으러 가기' : '위 필수 항목에 체크해 주세요'}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
