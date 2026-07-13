import type { SVGProps } from "react";

// 위치 화면 전용 인라인 아이콘. DS에 없는 아이콘만 currentColor SVG로 직접 작성.

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M11.0502 12.0007L16 7.05093L14.5858 5.63672L8.22182 12.0007L14.5858 18.3646L16 16.9504L11.0502 12.0007Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M13 19.9381C16.6187 19.4869 19.4869 16.6187 19.9381 13H17V11H19.9381C19.4869 7.38128 16.6187 4.51314 13 4.06189V7H11V4.06189C7.38128 4.51314 4.51314 7.38128 4.06189 11H7V13H4.06189C4.51314 16.6187 7.38128 19.4869 11 19.9381V17H13V19.9381ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M11.5 10.4445L16.9445 5L18.5 6.55555L13.0555 12L18.5 17.4444L16.9445 18.9999L11.5 13.5555L6.05556 18.9999L4.5 17.4444L9.94444 12L4.5 6.55555L6.05556 5L11.5 10.4445Z"
        fill="currentColor"
      />
    </svg>
  );
}
