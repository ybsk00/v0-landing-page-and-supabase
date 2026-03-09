# RAG 챗봇 랜딩페이지 구현 계획

> LumiBreeze 범용 AI 챗봇 광고 랜딩페이지  
> 기존 병원 전용 → 다업종 확장 리뉴얼  
> 작성일: 2026-03-09

---

## 1. 프로젝트 개요

### 1.1 목표
기존 `healthcare-application2.vercel.app` 병원 전용 랜딩페이지를 **다업종 대응 범용 랜딩페이지**로 리뉴얼하여 광고 타겟 풀을 확대한다.

### 1.2 현재 상태
- **프론트엔드**: Next.js + React (TypeScript), Vercel 배포
- **백엔드/DB**: Convex (클라우드)
- **기존 테이블**: `hospital_chatbot_leads` (contact_name, email, hospital_name, phone, privacy_consent)
- **GitHub**: `ybsk00/v0-landing-page-and-supabase` (v0.app 자동 싱크)

### 1.3 변경 범위
| 항목 | AS-IS | TO-BE |
|------|-------|-------|
| 타겟 | 병원·클리닉 단일 | 병원, 쇼핑몰, 교육, 전문서비스 4개 업종 |
| 히어로 메시지 | "환자가 질문하면 AI가 우리 병원 정보로만 답변합니다" | "고객이 물어보면, 우리 데이터로 답합니다" |
| 챗봇 데모 | 정적 스크린샷 | **타이핑 애니메이션 + 업종별 탭 전환** |
| 디자인 | 다크 모드 (파란 웨이브 배경) | **다크 모드 + Three.js 3D 파티클 네트워크** |
| 상담 폼 | 병원 전용 필드 | 범용 필드 + 업종 선택 |
| DB 테이블 | `hospital_chatbot_leads` | **`leads` (범용)** |

---

## 2. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| 프레임워크 | Next.js 14+ (App Router) | 기존 유지 |
| 언어 | TypeScript | 기존 유지 |
| 스타일링 | Tailwind CSS + 인라인 스타일 | 기존 Tailwind 유지 |
| 3D 배경 | Three.js (r128+) | 신규 추가, `npm install three @types/three` |
| 애니메이션 | CSS Keyframes + requestAnimationFrame | Three.js 파티클 + 타이핑 애니메이션 |
| DB/백엔드 | Convex | 기존 유지 |
| 배포 | Vercel | 기존 유지 (v0.app 싱크) |
| 폰트 | Pretendard Variable | CDN import |

---

## 3. Convex DB 스키마 설계

### 3.1 기존 테이블 (유지)

```
hospital_chatbot_leads
├── _id: Id
├── contact_name: string
├── email: string
├── hospital_name: string
├── phone: string
├── privacy_consent: boolean
└── _creationTime: number
```

### 3.2 신규 테이블: `leads`

범용 상담 신청을 수집하는 통합 테이블. 기존 `hospital_chatbot_leads`는 과거 데이터 보존을 위해 삭제하지 않고, 신규 유입은 `leads` 테이블로 받는다.

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 기존 테이블 유지
  hospital_chatbot_leads: defineTable({
    contact_name: v.string(),
    email: v.string(),
    hospital_name: v.string(),
    phone: v.string(),
    privacy_consent: v.boolean(),
  }),

  consultations: defineTable({
    // 기존 구조 유지
  }),

  inquiries: defineTable({
    // 기존 구조 유지
  }),

  // 신규: 범용 리드 테이블
  leads: defineTable({
    contact_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company_name: v.string(),        // "상호" (병원명, 쇼핑몰명 등)
    industry: v.string(),            // "hospital" | "ecommerce" | "education" | "professional" | "other"
    privacy_consent: v.boolean(),
    utm_source: v.optional(v.string()),   // 광고 소스 추적
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
  }).index("by_industry", ["industry"])
    .index("by_creation", ["_creationTime"]),
});
```

### 3.3 Convex 뮤테이션

```typescript
// convex/leads.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitLead = mutation({
  args: {
    contact_name: v.string(),
    email: v.string(),
    phone: v.string(),
    company_name: v.string(),
    industry: v.string(),
    privacy_consent: v.boolean(),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.privacy_consent) {
      throw new Error("개인정보 제공에 동의해야 합니다.");
    }
    const leadId = await ctx.db.insert("leads", {
      ...args,
      // _creationTime은 Convex가 자동 생성
    });
    return leadId;
  },
});

// 관리자용: 리드 조회
export const getLeads = query({
  args: {
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.industry) {
      return await ctx.db
        .query("leads")
        .withIndex("by_industry", (q) => q.eq("industry", args.industry))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("leads").order("desc").collect();
  },
});
```

---

## 4. 페이지 구조 및 컴포넌트 설계

### 4.1 디렉토리 구조

```
app/
├── page.tsx                    # 메인 랜딩페이지 (리뉴얼)
├── layout.tsx                  # 루트 레이아웃 (Convex Provider)
└── globals.css                 # 전역 스타일

components/
├── landing/
│   ├── ParticleBG.tsx          # Three.js 3D 파티클 네트워크 배경
│   ├── Navbar.tsx              # 고정 네비게이션 바
│   ├── HeroSection.tsx         # 히어로 (카피 + 챗봇 데모)
│   ├── ChatDemo.tsx            # 타이핑 애니메이션 챗봇 데모
│   ├── ChatBubble.tsx          # 개별 채팅 버블
│   ├── ProblemSection.tsx      # 문제 → 솔루션 카드
│   ├── HowItWorks.tsx          # 3단계 프로세스
│   ├── UseCases.tsx            # 업종별 활용 사례
│   ├── CTASection.tsx          # 최종 CTA
│   ├── ConsultForm.tsx         # 상담 신청 폼 (Convex 연동)
│   ├── Counter.tsx             # 숫자 카운팅 애니메이션
│   └── Footer.tsx              # 푸터
└── ui/                         # shadcn/ui 컴포넌트 (기존)

convex/
├── schema.ts                   # 스키마 (leads 테이블 추가)
├── leads.ts                    # 리드 CRUD 뮤테이션/쿼리
└── _generated/                 # Convex 자동 생성

hooks/
└── useScrollY.ts               # 스크롤 위치 훅

lib/
└── industries.ts               # 업종 데이터 + 대화 스크립트
```

### 4.2 컴포넌트 상세

#### ParticleBG.tsx
- Three.js로 220개 파티클 + 근접 파티클 간 라인 연결
- 마우스 위치에 따른 카메라 패럴랙스 반응
- `useEffect` cleanup으로 메모리 누수 방지
- `"use client"` 필수 (Three.js는 클라이언트 전용)

#### ChatDemo.tsx
- 업종별 탭 전환 시 대화 리셋
- `genRef`로 비동기 타이밍 충돌 방지
- 완료된 메시지는 `completedCount`로 정적 표시
- 현재 타이핑 중인 메시지만 커서 애니메이션
- 루프 재시작 시 `opacity` 페이드 전환 (깜빡임 방지)
- 봇 응답 전 타이핑 인디케이터(점 3개) 표시

#### ConsultForm.tsx
- Convex `useMutation(api.leads.submitLead)` 연동
- URL 파라미터에서 UTM 자동 추출
- 업종 선택 드롭다운 추가 (병원/쇼핑몰/교육/전문서비스/기타)
- "상호" 필드의 placeholder를 업종에 따라 동적 변경
- 제출 후 성공 토스트 + 폼 리셋

---

## 5. 상담 신청 폼 필드 설계

### 5.1 폼 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| 개인정보 동의 | radio (예/아니오) | ✅ | "예" 선택 시만 제출 가능 |
| 업종 | select | ✅ | 병원·클리닉 / 쇼핑몰·커머스 / 교육·학원 / 전문서비스 / 기타 |
| 상호 | text | ✅ | placeholder 업종에 따라 동적 변경 |
| 성명 | text | ✅ | 담당자 이름 |
| 전화번호 | tel | ✅ | 010-0000-0000 형식 |
| 이메일 | email | ✅ | example@company.com |

### 5.2 업종별 placeholder 매핑

```typescript
const PLACEHOLDERS: Record<string, string> = {
  hospital: "병원명을 입력해주세요",
  ecommerce: "쇼핑몰명을 입력해주세요",
  education: "학원/기관명을 입력해주세요",
  professional: "회사명을 입력해주세요",
  other: "회사/기관명을 입력해주세요",
};
```

### 5.3 UTM 파라미터 자동 수집

```typescript
// ConsultForm.tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setUtmSource(params.get("utm_source") || undefined);
  setUtmMedium(params.get("utm_medium") || undefined);
  setUtmCampaign(params.get("utm_campaign") || undefined);
}, []);
```

업종별 광고 소재에서 UTM을 다르게 세팅하여 전환 추적:
- Meta 광고: `?utm_source=meta&utm_medium=paid&utm_campaign=hospital_chatbot`
- Google 광고: `?utm_source=google&utm_medium=cpc&utm_campaign=ecommerce_cs`

---

## 6. 광고 운영 전략

### 6.1 UTM 기반 탭 자동 선택

URL 파라미터로 랜딩페이지 진입 시 해당 업종 탭이 기본 활성화:

```
https://healthcare-application2.vercel.app/?tab=ecommerce&utm_source=meta
```

```typescript
// page.tsx
const searchParams = useSearchParams();
const tabParam = searchParams.get("tab");
const defaultTab = INDUSTRIES.findIndex(i => i.id === tabParam);
const [activeTab, setActiveTab] = useState(defaultTab >= 0 ? defaultTab : 0);
```

### 6.2 업종별 광고 카피 예시

| 업종 | Meta 광고 카피 | 랜딩 URL |
|------|---------------|----------|
| 병원 | "진료시간 문의, AI가 24시간 대신 답변합니다" | `?tab=hospital&utm_campaign=hospital` |
| 쇼핑몰 | "CS 문의 70% 줄이는 AI 챗봇, 2주 만에 도입" | `?tab=ecommerce&utm_campaign=ecommerce` |
| 교육 | "수강 상담, AI가 자동으로 예약까지 잡아줍니다" | `?tab=education&utm_campaign=education` |
| 전문서비스 | "반복 상담 질문, AI가 대신 응대합니다" | `?tab=professional&utm_campaign=professional` |

---

## 7. 구현 순서 (Phase)

### Phase 1: DB 스키마 + 폼 (1일)
1. `convex/schema.ts`에 `leads` 테이블 추가
2. `convex/leads.ts` 뮤테이션/쿼리 작성
3. `npx convex deploy`로 스키마 반영
4. 기존 `hospital_chatbot_leads` 데이터 보존 확인

### Phase 2: 랜딩페이지 프론트엔드 (2~3일)
1. `components/landing/` 디렉토리 생성
2. `ParticleBG.tsx` — Three.js 3D 배경 구현
3. `ChatDemo.tsx` + `ChatBubble.tsx` — 타이핑 애니메이션 챗봇
4. 각 섹션 컴포넌트 구현 (Hero, Problem, HowItWorks, UseCases, CTA)
5. `ConsultForm.tsx` — Convex 연동 상담 폼
6. `page.tsx` 조립 + UTM 탭 자동선택

### Phase 3: 디자인 QA + 반응형 (1일)
1. 모바일 breakpoint 테스트 (360px, 390px, 768px)
2. Three.js 모바일 성능 최적화 (파티클 수 축소)
3. 폰트 로딩 FOUT 방지
4. Lighthouse 성능 점검 (LCP, CLS)

### Phase 4: 광고 세팅 + 배포 (1일)
1. UTM 파라미터 동작 테스트
2. Meta Pixel / Google Ads 전환 태그 설정
3. 상담 신청 완료 이벤트 전환 추적 코드
4. Vercel 배포 + 도메인 연결

---

## 8. 주의사항

### 8.1 Three.js 성능
- 모바일에서는 파티클 수를 220 → 80으로 축소
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`로 고해상도 디바이스 부하 제한
- 컴포넌트 언마운트 시 `renderer.dispose()` 필수

### 8.2 Convex 주의점
- `leads` 테이블에 인덱스 `by_industry`, `by_creation` 반드시 설정
- 뮤테이션에서 `privacy_consent === false`면 에러 throw
- 클라이언트에서 `ConvexProvider`가 `layout.tsx`에 감싸져 있는지 확인

### 8.3 SEO / 메타 태그
- `page.tsx`에 `metadata` export 추가
- Open Graph 이미지 제작 (다크 배경 + "AI 챗봇" 카피)
- `robots.txt`에 광고 랜딩 경로 크롤링 허용

### 8.4 기존 데이터 마이그레이션
- `hospital_chatbot_leads` 테이블은 **삭제하지 않음**
- 필요 시 기존 리드를 `leads` 테이블로 마이그레이션하는 일회성 스크립트 작성

```typescript
// convex/migrations.ts (일회성 실행)
export const migrateHospitalLeads = mutation({
  handler: async (ctx) => {
    const oldLeads = await ctx.db.query("hospital_chatbot_leads").collect();
    for (const lead of oldLeads) {
      await ctx.db.insert("leads", {
        contact_name: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        company_name: lead.hospital_name,
        industry: "hospital",
        privacy_consent: lead.privacy_consent,
      });
    }
    return { migrated: oldLeads.length };
  },
});
```

---

## 9. 성과 측정 KPI

| 지표 | 측정 방법 | 목표 |
|------|----------|------|
| 상담 전환율 | 폼 제출 수 / 페이지 방문 수 | 기존 대비 +30% |
| 업종별 리드 비율 | `leads` 테이블 `industry` 필드 집계 | 비병원 리드 40% 이상 |
| 평균 체류 시간 | Google Analytics | 2분 이상 |
| 이탈률 | Google Analytics | 60% 이하 |
| CPA (상담 신청 당 비용) | 광고 비용 / 상담 신청 수 | 업종별 추적 |

---

## 10. 파일 체크리스트

```
[ ] convex/schema.ts          — leads 테이블 추가
[ ] convex/leads.ts           — submitLead, getLeads
[ ] lib/industries.ts         — 업종 데이터 + 대화 스크립트
[ ] components/landing/ParticleBG.tsx
[ ] components/landing/ChatDemo.tsx
[ ] components/landing/ChatBubble.tsx
[ ] components/landing/ConsultForm.tsx
[ ] components/landing/HeroSection.tsx
[ ] components/landing/ProblemSection.tsx
[ ] components/landing/HowItWorks.tsx
[ ] components/landing/UseCases.tsx
[ ] components/landing/CTASection.tsx
[ ] components/landing/Navbar.tsx
[ ] components/landing/Footer.tsx
[ ] components/landing/Counter.tsx
[ ] app/page.tsx               — 조립 + UTM 탭 자동선택
[ ] package.json              — three, @types/three 추가
```
