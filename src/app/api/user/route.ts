import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) {
    // 신규 유저 생성
    user = await prisma.user.create({
      data: { id: userId }
    });
  } else {
    // 1시간 경과 체크 (리셋 로직)
    const now = new Date();
    const lastReset = new Date(user.lastResetTime);
    if (now.getTime() - lastReset.getTime() > 1000 * 60 * 60) {
      user = await prisma.user.update({
        where: { id: userId },
        data: { viewCount: 0, lastResetTime: now }
      });
    }
  }

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, action } = body;

  if (!userId || !action) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (action === 'VIEW') {
    if (!user.isPremium) {
      user = await prisma.user.update({
        where: { id: userId },
        data: { viewCount: user.viewCount + 1 }
      });
    }
  } else if (action === 'SHARE') {
    user = await prisma.user.update({
      where: { id: userId },
      data: { viewCount: Math.max(0, user.viewCount - 1) }
    });
  } else if (action === 'PREMIUM') {
    user = await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true }
    });
  }

  return NextResponse.json(user);
}
