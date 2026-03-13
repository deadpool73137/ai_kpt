import type { KptEntry } from '@/types/kpt';

export function buildAnalyzePrompt(entry: KptEntry): string {
  return `당신은 팀 회고 분석 전문가입니다. 아래의 KPT 회고 데이터를 분석하고 팀 성장을 위한 인사이트를 제공해주세요.

분기: ${entry.quarter}

Keep (잘 되고 있는 것):
${entry.keep.map((k, i) => `${i + 1}. ${k}`).join('\n')}

Problem (문제점):
${entry.problem.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Try (시도할 것):
${entry.try.map((t, i) => `${i + 1}. ${t}`).join('\n')}

다음 형식으로 JSON 응답을 제공해주세요:
{
  "summary": "전체 회고에 대한 1-2문장 요약",
  "commonIssues": ["반복되는 문제점 1", "반복되는 문제점 2"],
  "suggestions": ["구체적인 개선 제안 1", "구체적인 개선 제안 2"]
}`;
}
