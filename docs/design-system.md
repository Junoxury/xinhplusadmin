# 성형관리 플랫폼 디자인 시스템

## 테마 설정

### 다크 테마 기본 색상
```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        // 배경색 계열
        background: {
          DEFAULT: "#0B0F1E",  // 메인 배경
          secondary: "#111827", // 카드 배경
          tertiary: "#1F2937",  // 강조 배경
        },
        // 보라색 계열 (primary)
        primary: {
          DEFAULT: "#7C3AED",  // 주요 버튼, 강조
          light: "#A78BFA",    // 밝은 보라
          dark: "#5B21B6",     // 진한 보라
          foreground: "#FFFFFF",
        },
        // 핑크색 계열 (secondary)
        secondary: {
          DEFAULT: "#EC4899",  // 보조 액션
          light: "#F9A8D4",    // 밝은 핑크
          dark: "#BE185D",     // 진한 핑크
          foreground: "#FFFFFF",
        },
        // 그래프 색상
        chart: {
          purple: "#A78BFA",
          pink: "#F9A8D4",
          blue: "#60A5FA",
          green: "#34D399",
        },
        // 텍스트 색상
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
        // 테두리 색상
        border: {
          DEFAULT: "#374151",
          light: "#4B5563",
        },
        // 상태 표시 색상
        status: {
          success: "#34D399",
          warning: "#FBBF24",
          error: "#EF4444",
          info: "#60A5FA",
        }
      },
    },
  },
}
destructive: {
  DEFAULT: "#EF4444",  // 삭제, 경고 액션
  foreground: "#FFFFFF",
},
muted: {
  DEFAULT: "#F1F5F9",  // 비활성화, 배경
  foreground: "#64748B",
},
accent: {
  DEFAULT: "#F8FAFC",  // 강조, 포인트
  foreground: "#0F172A",
},
card: {
  DEFAULT: "#FFFFFF",  // 카드 배경
  foreground: "#0F172A",
},
```

### 상태 색상
- Success: "#22C55E"
- Warning: "#F59E0B"
- Error: "#EF4444"
- Info: "#3B82F6"

## 타이포그래피

### 폰트 패밀리
```css
--font-sans: "Pretendard Variable", "Noto Sans KR", -apple-system, sans-serif;
```

### 폰트 크기
```typescript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
}
```

### 폰트 가중치
- Thin: 100
- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600
- Bold: 700
- ExtraBold: 800

## 컴포넌트 스타일 가이드

### 카드 컴포넌트
```typescript
// 카드 기본 스타일
card: {
  base: "bg-background-secondary rounded-xl border border-border overflow-hidden",
  header: "p-6 flex items-center justify-between",
  title: "text-lg font-semibold text-text-primary",
  content: "p-6",
}

// 사용 예시
<Card className="hover:border-border-light transition-colors">
  <CardHeader>
    <CardTitle>월간 통계</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 콘텐츠 */}
  </CardContent>
</Card>
```

### 데이터 표시 컴포넌트
```typescript
// 통계 카드
statsCard: {
  base: "bg-background-secondary p-6 rounded-xl border border-border",
  label: "text-sm text-text-secondary mb-2",
  value: "text-2xl font-bold text-text-primary",
  trend: {
    up: "text-status-success text-sm",
    down: "text-status-error text-sm",
  }
}

// 사용 예시
<div className="statsCard.base">
  <div className="statsCard.label">총 방문자</div>
  <div className="statsCard.value">50.8K</div>
  <div className="statsCard.trend.up">+28.4%</div>
</div>
```

### 차트 컴포넌트
```typescript
// 차트 공통 스타일
chart: {
  background: "bg-background-secondary",
  grid: {
    stroke: "#374151",
    strokeWidth: 1,
  },
  text: {
    fill: "#9CA3AF",
    fontSize: 12,
  },
  tooltip: {
    background: "#1F2937",
    border: "#4B5563",
    text: "#FFFFFF",
  }
}
```

### 내비게이션
```typescript
// 사이드바 스타일
sidebar: {
  base: "bg-background-secondary w-64 p-4 border-r border-border",
  item: {
    base: "flex items-center px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-tertiary",
    active: "bg-primary/10 text-primary hover:bg-primary/20",
    icon: "w-5 h-5 mr-3",
  }
}

// 사용 예시
<nav className="sidebar.base">
  <a className="sidebar.item.base sidebar.item.active">
    <Icon className="sidebar.item.icon" />
    <span>대시보드</span>
  </a>
</nav>
```
```

### 입력 필드
```typescript
// 기본 스타일
input: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
```

### 카드
```typescript
// 기본 스타일
card: "bg-card text-card-foreground rounded-lg border shadow-sm"
```

## 간격 시스템

### 기본 간격
```typescript
spacing: {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  // ... 추가 간격
}
```

### 레이아웃 간격 가이드
- 섹션 간 간격: 2rem (32px)
- 컴포넌트 간 간격: 1rem (16px)
- 내부 요소 간 간격: 0.5rem (8px)

## 반응형 브레이크포인트
```typescript
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

## 그림자
```typescript
shadows: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}
```

## 애니메이션
```typescript
animations: {
  accordion: 'accordion-down 0.2s ease-out',
  modal: 'modal-overlay 0.3s ease-in-out',
  toast: 'toast-slide-right 0.3s ease-out',
}
```

## 컴포넌트 사용 예시

### 기본 버튼
```tsx
<Button variant="default" size="default">
  기본 버튼
</Button>
```

### 폼 입력
```tsx
<Input 
  type="text" 
  placeholder="입력해주세요"
  className="w-full"
/>
```

### 카드 컴포넌트
```tsx
<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    카드 내용
  </CardContent>
</Card>
```

## 접근성 가이드
- 모든 이미지에 alt 텍스트 제공
- 적절한 ARIA 레이블 사용
- 키보드 네비게이션 지원
- 충분한 색상 대비 보장
