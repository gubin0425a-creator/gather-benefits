import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: '프로모션 코드 모음 - Gather Benefits',
  description: '테무(Temu), 알리익스프레스, 쿠팡 등 인기 브랜드의 전용 프로모션 코드를 모아두었습니다.',
};

export default function PromoCodePage() {
  const dataPath = path.join(process.cwd(), 'data/coupons.json');
  let coupons = [];
  if (fs.existsSync(dataPath)) {
    coupons = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }

  // 코드가 있는 항목만 필터링
  const promoCoupons = coupons.filter((c: any) => c.code);

  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-2 text-gray-900">프로모션 코드 모음</h1>
        <p className="text-gray-500 mb-8">결제 시 바로 적용 가능한 전용 할인 코드 리스트입니다.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoCoupons.map((coupon: any) => (
            <Link key={coupon.id} href={`/${coupon.slug}`}>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                    {coupon.brand}
                  </span>
                  <h2 className="text-md font-bold text-gray-900 line-clamp-1">{coupon.title}</h2>
                </div>
                <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="font-mono text-sm font-bold text-gray-600">{coupon.code}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
