'use client';

import { useState } from 'react';

import MOCK_COUPONS from '../../data/coupons.json';

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
