// 홈 화면 전용 DS 아이콘(currentColor 인라인 SVG, viewBox 0 0 24 24). 부모 색상 상속.
type IconProps = {
  size?: number;
  className?: string;
};

// map-pin: 위치 행 좌측 핀 아이콘
export function MapPinIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

// down: 아래 방향 체브론(위치 행 우측)
export function ChevronDownIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5001 13.1714L16.4499 8.22168L17.8641 9.63589L11.5001 15.9999L5.13623 9.63589L6.55044 8.22168L11.5001 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}

// x: 검색어 지우기 아이콘
export function CloseIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 10.4445L16.9445 5L18.5 6.55555L13.0555 12L18.5 17.4444L16.9445 18.9999L11.5 13.5555L6.05556 18.9999L4.5 17.4444L9.94444 12L4.5 6.55555L6.05556 5L11.5 10.4445Z"
        fill="currentColor"
      />
    </svg>
  );
}

// search: 검색 필드 우측 돋보기 아이콘
export function SearchIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
        fill="currentColor"
      />
    </svg>
  );
}
