import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { k, p, t } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: "너는 IT 팀의 성장을 돕는 전문 코치야. 사용자의 KPT 회고를 바탕으로 따뜻하지만 날카로운 분석 리포트를 작성해줘.",
      messages: [
        {
          role: "user",
          content: `다음은 이번 분기 우리 팀의 회고 내용이야. 분석해줘.\n\nKeep (유지할 점): ${k}\nProblem (문제점): ${p}\nTry (시도할 점): ${t}`
        }
      ],
    });

    // Claude의 응답 텍스트 추출
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ result: content });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
