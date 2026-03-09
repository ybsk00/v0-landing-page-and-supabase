export interface DemoMessage {
    role: "customer" | "bot"
    text: string
}

export interface IndustryConfig {
    id: string
    label: string
    tagline: string
    iconName: string
    placeholder: string
    demoMessages: DemoMessage[]
}

export const INDUSTRIES: IndustryConfig[] = [
    {
        id: "hospital",
        label: "병원·의원",
        tagline: "병원 전용 AI 챗봇",
        iconName: "Stethoscope",
        placeholder: "병원명을 입력해주세요",
        demoMessages: [
            { role: "customer", text: "피부과 진료시간이 어떻게 되나요?" },
            {
                role: "bot",
                text: "피부과 진료시간 안내드립니다.\n• 평일: 오전 9시 ~ 오후 6시\n• 토요일: 오전 9시 ~ 오후 1시\n• 일요일/공휴일: 휴진\n\n예약을 도와드릴까요?",
            },
            { role: "customer", text: "네, 이번 주 토요일 오전에 예약하고 싶어요" },
            {
                role: "bot",
                text: "토요일 오전 예약 가능한 시간은\n10:00, 10:30, 11:00입니다.\n원하시는 시간을 선택해 주세요.",
            },
        ],
    },
    {
        id: "ecommerce",
        label: "쇼핑몰·커머스",
        tagline: "이커머스 AI 챗봇",
        iconName: "ShoppingBag",
        placeholder: "쇼핑몰명을 입력해주세요",
        demoMessages: [
            { role: "customer", text: "주문한 상품 배송이 언제 되나요?" },
            {
                role: "bot",
                text: "주문번호를 확인했습니다.\n• 주문일: 3월 7일\n• 배송 상태: 배송 중\n• 도착 예정: 3월 10일 (월)\n\n배송 추적 링크를 보내드릴까요?",
            },
            { role: "customer", text: "교환도 가능한가요?" },
            {
                role: "bot",
                text: "네, 수령 후 7일 이내 교환 가능합니다.\n• 택배 수거 신청\n• 매장 방문 교환\n두 가지 방법 중 선택해 주세요.",
            },
        ],
    },
    {
        id: "education",
        label: "교육·학원",
        tagline: "교육기관 AI 챗봇",
        iconName: "GraduationCap",
        placeholder: "학원/기관명을 입력해주세요",
        demoMessages: [
            { role: "customer", text: "중등 수학 수강료가 얼마인가요?" },
            {
                role: "bot",
                text: "중등 수학반 안내드립니다.\n• 기본반: 월 28만원 (주 3회)\n• 심화반: 월 35만원 (주 4회)\n• 1:1 과외: 월 50만원\n\n무료 레벨테스트를 예약하시겠어요?",
            },
            { role: "customer", text: "레벨테스트 예약하고 싶어요" },
            {
                role: "bot",
                text: "이번 주 가능한 시간대입니다.\n• 수요일 오후 4시\n• 목요일 오후 5시\n• 토요일 오전 10시\n원하시는 시간을 선택해 주세요.",
            },
        ],
    },
    {
        id: "professional",
        label: "전문서비스",
        tagline: "전문서비스 AI 챗봇",
        iconName: "Briefcase",
        placeholder: "회사명을 입력해주세요",
        demoMessages: [
            { role: "customer", text: "법인설립 절차가 어떻게 되나요?" },
            {
                role: "bot",
                text: "법인설립 절차 안내드립니다.\n1. 상호 결정 및 정관 작성\n2. 법인 인감 제작\n3. 자본금 납입\n4. 등기 신청 (약 3~5일)\n\n무료 상담을 예약하시겠어요?",
            },
            { role: "customer", text: "비용은 얼마인가요?" },
            {
                role: "bot",
                text: "법인설립 대행 비용입니다.\n• 기본 패키지: 30만원\n• 세무 연계 패키지: 50만원\n• 등록면허세, 교육세 별도\n\n상세 견적을 이메일로 보내드릴까요?",
            },
        ],
    },
]

export const PLACEHOLDERS: Record<string, string> = {
    hospital: "병원명을 입력해주세요",
    ecommerce: "쇼핑몰명을 입력해주세요",
    education: "학원/기관명을 입력해주세요",
    professional: "회사명을 입력해주세요",
    other: "회사/기관명을 입력해주세요",
}

export function getIndustryById(id: string): IndustryConfig | undefined {
    return INDUSTRIES.find((ind) => ind.id === id)
}
