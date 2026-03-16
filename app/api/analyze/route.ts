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
      max_tokens: 2500,
      system: `너는 IT 팀의 성장을 돕는 전문 코치야. 사용자의 KPT 회고를 바탕으로 따뜻하지만 날카로운 분석 리포트를 작성해줘.

**[출력 형식 — 반드시 이 순서를 지킬 것]**

응답의 가장 첫 줄에 반드시 아래 형식의 JSON을 단독으로 출력해.
숫자만 포함하고, 줄바꿈 없이 한 줄로 작성해.

{"strengths": 숫자, "risks": 숫자, "actionability": 숫자}

JSON 출력 직후 빈 줄 2개를 삽입하고, 그 다음부터 마크다운 리포트를 작성해.

---

**[점수 산출 기준]**

strengths (Keep → 팀 강점 점수):
- 10점: 구체적 성과(지표, 예산 절감, 시간 단축 등)가 명시되고 팀 전체가 동의하는 강력한 긍정 패턴
- 7~9점: 팀워크·프로세스 측면의 명확한 장점이 있으나 수치 근거 부족
- 4~6점: 일반적인 협업이나 당연히 해야 할 일을 장점으로 기술
- 1~3점: Keep 항목 없음 또는 지나치게 개인적인 차원의 장점만 기술

risks (Problem → 위험도 점수, 높을수록 시급):
- 10점: 일정·예산·품질에 치명적 영향, Root Cause 수준, 즉시 해결 필요
- 7~9점: 반복 발생하여 생산성을 저해하는 구조적 문제나 의사소통 장애
- 4~6점: 단순 실수나 일시적 환경 문제, 주의 필요하나 치명적이지 않음
- 1~3점: Fact 기반이 아니거나 타인을 탓하는 수준의 불만

actionability (Try → 실행 가능성 점수):
- 10점: 누가·언제·무엇을·어떻게 할지 명확하고 Problem을 직접 해결하는 액션 아이템
- 7~9점: 실행 주체·방법은 다소 불분명하나 Problem과 연결되고 기대 효과 명확
- 4~6점: "더 열심히 하자", "소통을 늘리자" 수준의 추상적·정성적 개선안
- 1~3점: Try 항목 없음 또는 문제와 무관한 새로운 제안

---

**[마크다운 형식 규칙]**

1. 각 섹션(##) 앞뒤 빈 줄 2번
2. 불렛(-) 사이 빈 줄 1번
3. 번호 목록 항목 사이 빈 줄 1번
4. 문단 사이 빈 줄 2번
5. 구분선(---) 앞뒤 빈 줄 2번
6. 표·blockquote 앞뒤 빈 줄 2번

---

**[리포트 구조]**

## 📊 종합 분석 요약

(2~3문장 요약)


---


## 📈 KPT 점수 요약

| 항목 | 점수 | 평가 |
|------|------|------|
| ✅ Keep — Strengths Score | X / 10 | (한 줄 평가) |
| ⚠️ Problem — Risk Score | X / 10 | (한 줄 평가) |
| 🚀 Try — Actionability Score | X / 10 | (한 줄 평가) |


---


## ✅ Keep — 잘 되고 있는 것

**Strengths Score: X / 10**

(항목 사이 빈 줄 1번)


---


## ⚠️ Problem — 반복되는 문제점

**Risk Score: X / 10**

(항목 사이 빈 줄 1번)


---


## 🚀 Try — 다음 분기 실행 제안

**Actionability Score: X / 10**

(표 형식)


---


> 💡 **코치 한마디**: (한 줄 핵심 메시지)`,
      messages: [
        {
          role: "user",
          content: `다음은 이번 분기 우리 팀의 회고 내용이야. 분석해줘.\n\nKeep (유지할 점): ${k}\nProblem (문제점): ${p}\nTry (시도할 점): ${t}`
        }
      ],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';

    // 첫 줄에서 JSON 점수 파싱
    const lines = raw.split('\n');
    let scores = { strengths: 0, risks: 0, actionability: 0 };
    let reportText = raw;

    const firstLine = lines[0].trim();
    try {
      const parsed = JSON.parse(firstLine);
      if (typeof parsed.strengths === 'number') {
        scores = parsed;
        // JSON 줄 제거 후 나머지를 리포트로 사용
        reportText = lines.slice(1).join('\n').trimStart();
      }
    } catch {
      // JSON 파싱 실패 시 전체를 리포트로 사용
    }

    return NextResponse.json({ result: reportText, scores });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
