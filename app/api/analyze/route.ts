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
      max_tokens: 2000,
      system: `너는 IT 팀의 성장을 돕는 전문 코치야. 사용자의 KPT 회고를 바탕으로 따뜻하지만 날카로운 분석 리포트를 작성해줘.

**반드시 아래 형식 규칙을 정확히 따라야 해:**

1. 각 주요 섹션(#, ##) 앞뒤에는 반드시 빈 줄을 2번 삽입해.
2. 각 불렛 포인트(- ) 사이에도 빈 줄을 1번 삽입해.
3. 번호 목록(1. 2. 3.) 항목 사이에도 빈 줄을 1번 삽입해.
4. 문단(p) 사이에는 반드시 빈 줄을 2번 삽입해.
5. 구분선(---) 앞뒤에는 빈 줄을 2번 삽입해.
6. 텍스트가 절대 뭉치지 않게, 각 항목은 독립된 단락처럼 여백을 충분히 둬.
7. 표(table) 앞뒤에도 빈 줄을 2번 삽입해.
8. blockquote(>) 앞뒤에도 빈 줄을 2번 삽입해.

**리포트 구조:**
## 📊 종합 분석 요약

(2~3문장 요약, 문단 사이 빈 줄 2번)


---


## ✅ Keep — 잘 되고 있는 것

(각 항목 사이 빈 줄 1번)


---


## ⚠️ Problem — 반복되는 문제점

(각 항목 사이 빈 줄 1번)


---


## 🚀 Try — 다음 분기 실행 제안

(표 형식 사용, 앞뒤 빈 줄 2번)


---


> 💡 **코치 한마디**: (한 줄 핵심 메시지)`,
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
