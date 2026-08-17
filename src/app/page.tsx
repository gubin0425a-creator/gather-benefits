'use client';

import { useState } from 'react';

const MOCK_COUPONS = [
  { id: '1', brand: '밀리의 서재', title: '첫 달 무료 + LGU+ 중복 캐시백', category: '도서·컨텐츠', code: null, url: 'https://millie.co.kr', isExpired: false, badge: '1개월 FREE' },
  { id: '2', brand: '알리익스프레스', title: '초이스 데이 전품목 반값 할인', category: '해외직구', code: 'ALI50', url: 'https://aliexpress.com', isExpired: false, badge: '50% OFF' },
  { id: '3', brand: 'AppSumo', title: 'WriteSonic AI 마케팅 툴 평생 소장', category: 'AI·소프트웨어', code: null, url: 'https://appsumo.com', isExpired: false, badge: '♾️ 평생 결제' },
  { id: '4', brand: 'Temu (테무)', title: '[마감] 신규 15만원 크레딧팩', category: '해외직구', code: null, url: '#', isExpired: true, badge: '종료됨' },
];

export default function GatherBenefitsMain() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [hideExpired, setHideExpired] = useState(true);

  const filteredCoupons = MOCK_COUPONS.filter((coupon) => {
    const matchCat = activeCategory === '전체' || coupon.category === activeCategory;
    const matchStatus = hideExpired ? !coupon.isExpired : true;
    return matchCat && matchStatus;
  });

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
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
            {['전체', 'AI·소프트웨어', '해외직구', '도서·컨텐츠'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors {
                  activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 text-sm font-medium shadow-sm">
            <button onClick={() => setHideExpired(true)} className={px-4 py-1.5 rounded-md transition-all {hideExpired ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}}>
              사용 가능만
            </button>
            <button onClick={() => setHideExpired(false)} className={px-4 py-1.5 rounded-md transition-all {!hideExpired ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-600'}}>
              종료 포함
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCoupons.map((coupon) => (
            <article 
              key={coupon.id} 
              onClick={() => !coupon.isExpired && window.open(coupon.url, '_blank')}
              className={g-white rounded-2xl p-5 border transition-all flex flex-col {
                coupon.isExpired ? 'border-gray-200 opacity-50 grayscale' : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer'
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-400">{coupon.brand}</span>
                <span className={px-2 py-1 rounded-md text-[10px] font-black {coupon.isExpired ? 'bg-gray-800 text-white' : 'bg-red-500 text-white animate-pulse'}}>
                  {coupon.badge}
                </span>
              </div>
              <h2 className={	ext-lg font-bold mb-4 flex-grow line-clamp-2 {coupon.isExpired ? 'text-gray-400 line-through' : 'text-gray-900'}}>
                {coupon.title}
              </h2>
              <button disabled={coupon.isExpired} className={w-full py-2.5 rounded-xl font-bold text-sm transition-colors {
                coupon.isExpired ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }}>
                {coupon.isExpired ? '만료됨' : coupon.code ? [ {coupon.code} ] 복사 : '혜택 받으러 가기'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
