'use client';

import { useState, useEffect } from 'react';
import MOCK_COUPONS from '../../data/coupons.json';

export default function GatherBenefitsMain() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [hideExpired, setHideExpired] = useState(true);
  
  // 상태 관리 (UI)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // 상태 관리 (비즈니스 로직 - 로컬 스토리지 연동)
  const [viewCount, setViewCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [lotteryWinner, setLotteryWinner] = useState('가입자');

  // 초기 로드 시 로컬 스토리지에서 데이터 복원 및 시간 초기화
  useEffect(() => {
    const savedCount = localStorage.getItem('couponViewCount');
    const savedTime = localStorage.getItem('lastResetTime');
    const premium = localStorage.getItem('isPremium') === 'true';
    
    setIsPremium(premium);
    
    const now = Date.now();
    if (savedTime && now - parseInt(savedTime) > 1000 * 60 * 60) {
      // 1시간이 지났으면 리셋
      localStorage.setItem('couponViewCount', '0');
      localStorage.setItem('lastResetTime', now.toString());
      setViewCount(0);
    } else {
      if (savedCount) setViewCount(parseInt(savedCount));
      if (!savedTime) localStorage.setItem('lastResetTime', now.toString());
    }

    // 로또 당첨자 랜덤 세팅 (100분 주기 시뮬레이션용)
    const randomUsers = ['김*수', '이*지', 'Park**', '유*진', '최*호'];
    setLotteryWinner(randomUsers[Math.floor(Math.random() * randomUsers.length)]);
  }, []);

  const filteredCoupons = MOCK_COUPONS.filter((coupon) => {
    const matchCat = activeCategory === '전체' || coupon.category === activeCategory;
    const matchStatus = hideExpired ? !coupon.isExpired : true;
    return matchCat && matchStatus;
  });

  const openModal = (coupon: any) => {
    if (coupon.isExpired) return;
    
    // 열람 제한 로직 (프리미엄이 아니고 3회 이상 본 경우)
    if (!isPremium && viewCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    // 조회수 증가
    if (!isPremium) {
      const newCount = viewCount + 1;
      setViewCount(newCount);
      localStorage.setItem('couponViewCount', newCount.toString());
    }

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

  const handleShare = () => {
    alert('🔗 링크가 복사되었습니다! (+4,500원 즉시 적립 완료 & 열람 한도 1회 복구)');
    // 공유 보상: 열람 횟수 1 차감 (추가 열람 1회 부여)
    const newCount = Math.max(0, viewCount - 1);
    setViewCount(newCount);
    localStorage.setItem('couponViewCount', newCount.toString());
    setShowLimitModal(false);
  };

  const upgradePremium = () => {
    alert('프리미엄 결제가 완료되었습니다! (시뮬레이션)');
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    setShowLimitModal(false);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative overflow-x-hidden">
      
      {/* 100분 추첨 로또 전광판 (Marquee) */}
      <div className="bg-red-500 text-white text-xs font-bold py-1.5 w-full overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          🎉 [실시간 100분 룰렛 당첨] 방금 {lotteryWinner}님이 100% 전액 할인 혜택에 당첨되셨습니다! 축하합니다! 🎉 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
          🎉 [실시간 100분 룰렛 당첨] 방금 {lotteryWinner}님이 100% 전액 할인 혜택에 당첨되셨습니다! 축하합니다! 🎉
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>

      {/* 글로벌 네비게이션(GNB) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">Gather Benefits</h1>
          <div className="flex items-center gap-3">
            {!isPremium && (
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                남은 열람: <span className="text-indigo-600">{Math.max(0, 3 - viewCount)}</span>회
              </span>
            )}
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold hidden md:block">
              매 1시간 타겟팅 알고리즘 봇 가동 중 🚀
            </span>
          </div>
        </div>
      </header>

      {/* 프리미엄 플랜 배너 */}
      {!isPremium && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div 
            onClick={upgradePremium}
            className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl cursor-pointer hover:scale-[1.01] transition-transform"
          >
            <div>
              <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded mb-2 inline-block">PREMIUM PLAN</span>
              <h2 className="text-xl font-bold mb-1">하루 무제한 열람권 + 초특가 알고리즘 독점</h2>
              <p className="text-indigo-200 text-sm">지금 가입하고 열람 제한 없이 모든 혜택을 쓸어 담으세요.</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <span className="text-gray-400 line-through text-sm">월 14,900원</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-yellow-400">-33%</span>
                <span className="text-2xl font-black">월 9,900원</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['전체', '종합몰', 'AI·소프트웨어', '해외직구', '여행·숙박', '외식·카페', '배달·포장', '뷰티·패션', '도서·컨텐츠'].map((cat) => (
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

        {/* 쿠폰 그리드 렌더링 (최정예 80개) */}
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
                ⏳ 유효기간: {coupon.validUntil || '상시 진행'}
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

      {/* [제한 초과 모달] */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center relative">
            <button onClick={() => setShowLimitModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 text-2xl font-bold">&times;</button>
            
            <div className="text-4xl mb-4 mt-4">🔒</div>
            <h3 className="font-black text-gray-900 text-xl mb-2">열람 한도 초과!</h3>
            <p className="text-gray-500 text-sm mb-6">
              시간당 3개의 혜택만 열람할 수 있습니다.<br/>(다음 1시간 뒤에 리셋됩니다)
            </p>
            
            <button 
              onClick={handleShare}
              className="w-full mb-3 py-3 rounded-xl font-bold text-white bg-[#FEE500] !text-black border border-yellow-400 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
            >
              🔗 카톡 공유하고 1회 추가 + 4,500원 받기
            </button>
            
            <button 
              onClick={upgradePremium}
              className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              👑 프리미엄 구독하고 무제한 열람하기
            </button>
          </div>
        </div>
      )}

      {/* [상세 및 면책 조항 모달] */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 text-lg">{selectedCoupon.brand} 혜택 안내</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 text-xl font-bold">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto">
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

              <div className="mb-6">
                <h4 className="text-sm font-black text-indigo-600 mb-2">✨ 이런 혜택이 기다리고 있어요!</h4>
                <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50/50 p-4 rounded-xl">
                  {selectedCoupon.details}
                </p>
              </div>

              <div className="mb-6 flex items-center gap-2">
                <span className="text-xl">⏳</span>
                <div>
                  <h4 className="text-xs font-bold text-gray-500">유효기간</h4>
                  <p className="text-sm font-black text-gray-900">{selectedCoupon.validUntil || '상시 진행'}</p>
                </div>
              </div>

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

            <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-3">
              <button 
                onClick={handleShare}
                className="w-full py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
              >
                🔗 공유하고 4,500원 적립 & 열람 1회 추가
              </button>

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
