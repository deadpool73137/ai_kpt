import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/app/page';

describe('KPT Analyzer 메인 페이지 검증', () => {
  it('모든 입력창(Keep, Problem, Try)이 렌더링되어야 한다', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText(/Keep 내용을 입력하세요/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Problem 내용을 입력하세요/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Try 내용을 입력하세요/i)).toBeDefined();
  });

  it('입력값이 비어있을 때 분석 버튼을 누르면 경고창이 떠야 한다', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<Home />);
    const button = screen.getByText(/AI 리포트 생성하기/i);
    fireEvent.click(button);
    expect(alertMock).toHaveBeenCalledWith('모든 항목을 입력해주세요!');
    alertMock.mockRestore();
  });
});
