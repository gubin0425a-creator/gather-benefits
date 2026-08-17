import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 동적 라우팅을 위한 빌드 타임 정적 파라미터 생성
export async function generateStaticParams() {
  const dataPath = path.join(process.cwd(), 'data/coupons.json');
  if (!fs.existsSync(dataPath)) return [];
  
  const coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  return coupons.map((c: any) => ({
    slug: c.slug,
  }));
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dataPath = path.join(process.cwd(), 'data/coupons.json');
  const coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const coupon = coupons.find((c: any) => c.slug === params.slug);

  if (!coupon) return { title: '쿠폰을 찾을 수 없습니다 - Gather Benefits' };

  return {
    title: `${coupon.title} | ${coupon.brand} 할인 프로모션 코드 - Gather Benefits`,
    description: `${coupon.brand}의 특별 혜택! ${coupon.details}. 지금 바로 프로모션 코드 ${coupon.code || '확인'}하고 혜택을 누리세요!`,
    keywords: `${coupon.brand} 쿠폰, ${coupon.brand} 할인, ${coupon.brand} 프로모션 코드, ${coupon.title}, Gather Benefits`,
    openGraph: {
      title: `${coupon.title} | ${coupon.brand}`,
      description: coupon.details,
      type: 'website',
    }
  };
}

export default function CouponDetailPage({ params }: { params: { slug: string } }) {
  const dataPath = path.join(process.cwd(), 'data/coupons.json');
  const coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const coupon = coupons.find((c: any) => c.slug === params.slug);

  if (!coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">해당 혜택이 종료되었거나 찾을 수 없습니다.</h1>
          <Link href="/" className="text-indigo-600 font-bold hover:underline">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  // Next.js 서버 컴포넌트에서는 블러 로직 등을 클라이언트로 넘기거나 직접 렌더링해야 합니다.
  // 이번에는 SEO 최적화를 위해 서버 컴포넌트 내부에서 클라이언트 컴포넌트(DetailClient)를 렌더링하여 넘겨주는 방식을 씁니다.
  // 편의상 이 파일에서 바로 렌더링 후, 인터랙션은 'Client Component'로 분리하는 것이 좋습니다.
  // 빠른 구현을 위해 여기를 클라이언트 컴포넌트로 만들거나, 로컬스토리지 블러 등을 적용할 수 있습니다.
  
  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* 브레드크럼 (SEO를 위한 네비게이션) */}
        <nav className="flex text-sm text-gray-500 mb-6 font-medium">
          <Link href="/" className="hover:text-indigo-600">홈</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/promo-code" className="hover:text-indigo-600">프로모션 코드</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">{coupon.brand}</span>
        </nav>

        {/* 메인 상세 컨텐츠 */}
        <article className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-black rounded-full mb-3">
              {coupon.badge}
            </span>
            <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
              {coupon.title}
            </h1>
            <p className="text-gray-500 font-medium">브랜드: {coupon.brand}</p>
          </div>
          
          <div className="p-8">
            <h3 className="text-sm font-black text-indigo-600 mb-3">✨ 혜택 상세</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed mb-6">
              {coupon.details}
            </p>

            <div className="flex items-center gap-3 mb-8 p-4 border border-indigo-100 rounded-xl bg-white">
              <span className="text-2xl">⏳</span>
              <div>
                <h4 className="text-xs font-bold text-gray-400 mb-1">유효기간</h4>
                <p className="text-sm font-black text-gray-900">{coupon.validUntil || '상시 진행 (조기 종료 가능)'}</p>
              </div>
            </div>

            <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
              <span>💡</span> 단 1분 만에 혜택 적용하는 방법
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
              <pre className="text-sm text-gray-700 font-sans whitespace-pre-wrap leading-loose">
                {coupon.usageGuide}
              </pre>
              {coupon.code && (
                <div className="mt-5 p-4 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-gray-500">프로모션 코드</span>
                  <span className="font-mono font-black text-indigo-600 text-xl tracking-widest">{coupon.code}</span>
                </div>
              )}
            </div>
            
            <a 
              href={coupon.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 text-center rounded-xl font-black text-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all"
            >
              🎉 지금 바로 혜택 받으러 가기
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
