// 해파리 접촉피해 응급 대처법 데이터. 순수 데이터만 두고 색/스타일은 뷰에서 처리.
export type EmergencySegment = { text: string; emphasis?: "brand" | "danger" };
export type EmergencyItem = { tone: "primary" | "secondary"; segments: EmergencySegment[] };

export const EMERGENCY_GUIDE: EmergencyItem[] = [
  {
    tone: "secondary",
    segments: [
      { text: "쏘인 즉시 환자를 물 밖으로", emphasis: "brand" },
      {
        text: " 나오도록 하고, 쏘인 부위가 넓거나 환자 상태가 좋지 않으면 (호흡곤란, 의식불명) 바로 ",
      },
      { text: "구급차를 부르고 구조요원에게 도움", emphasis: "brand" },
      { text: "을 청한다." },
    ],
  },
  {
    tone: "secondary",
    segments: [
      { text: "환자의 상태를 관찰하여 " },
      { text: "호흡곤란", emphasis: "brand" },
      { text: " 등으로 인한 긴급한 구조가 필요하다고 판단되면 " },
      { text: "인공호흡을 비롯한 심폐소생술을 실시", emphasis: "brand" },
      { text: "한다." },
    ],
  },
  {
    tone: "secondary",
    segments: [
      { text: "쏘인 부위는 " },
      { text: "식염수로 세척", emphasis: "brand" },
      { text: "합니다." },
    ],
  },
  {
    tone: "primary",
    segments: [
      { text: "해파리 쏘임시에 알코올 종류의 " },
      { text: "세척제", emphasis: "danger" },
      {
        text: "는 독액의 방출을 증가시킬 수 있어서 금한다. 작은부레관해파리의 쏘임시에는 식초가 독액의 방출을 증가시킬 수 있어서 ",
      },
      { text: "식초", emphasis: "danger" },
      { text: "를 이용한 세척을 금한다." },
    ],
  },
  {
    tone: "primary",
    segments: [
      { text: "테트라싸이클린(Tetracycline)", emphasis: "brand" },
      { text: " 계열의 연고를 쏘임부위에 발라준다." },
    ],
  },
  {
    tone: "primary",
    segments: [
      { text: "열찜질 또는 냉찜질", emphasis: "brand" },
      { text: "을 하면 통증을 완화시키는데 도움을 줄 수 있다." },
    ],
  },
];
