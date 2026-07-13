import type { SVGProps } from "react";

// Figma 원본 SVG(디자인 시스템 asset)를 currentColor 틴트가 가능하도록 인라인한 사이드바 아이콘.
type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M3 21C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3ZM7 10H4V19H7V10ZM20 10H9V19H20V10ZM20 5H4V8H20V5Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function ReportIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function TipOffIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11.2929 12.1213L15.5355 7.87868L16.9497 9.29289L11.2929 14.9497L7.40381 11.0607L8.81802 9.64645L11.2929 12.1213Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function NotificationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M9 17C9 17 16 18 19 21H20C20.5523 21 21 20.5523 21 20V13.937C21.8626 13.715 22.5 12.9319 22.5 12C22.5 11.0681 21.8626 10.285 21 10.063V4C21 3.44772 20.5523 3 20 3H19C16 6 9 7 9 7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H6L7 22H9V17ZM11 8.6612C11.6833 8.5146 12.5275 8.31193 13.4393 8.04373C15.1175 7.55014 17.25 6.77262 19 5.57458V18.4254C17.25 17.2274 15.1175 16.4499 13.4393 15.9563C12.5275 15.6881 11.6833 15.4854 11 15.3388V8.6612ZM5 9H9V15H5V9Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M4 18H6V20H18V4H6V6H4V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V18ZM6 11H13V13H6V16L1 12L6 8V11Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M6.17071 18C6.58254 16.8348 7.69378 16 9 16C10.3062 16 11.4175 16.8348 11.8293 18H22V20H11.8293C11.4175 21.1652 10.3062 22 9 22C7.69378 22 6.58254 21.1652 6.17071 20H2V18H6.17071ZM12.1707 11C12.5825 9.83481 13.6938 9 15 9C16.3062 9 17.4175 9.83481 17.8293 11H22V13H17.8293C17.4175 14.1652 16.3062 15 15 15C13.6938 15 12.5825 14.1652 12.1707 13H2V11H12.1707ZM6.17071 4C6.58254 2.83481 7.69378 2 9 2C10.3062 2 11.4175 2.83481 11.8293 4H22V6H11.8293C11.4175 7.16519 10.3062 8 9 8C7.69378 8 6.58254 7.16519 6.17071 6H2V4H6.17071ZM9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6ZM15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13ZM9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M13.1715 12.0007L8.22168 7.05093L9.6359 5.63672L15.9999 12.0007L9.6359 18.3646L8.22168 16.9504L13.1715 12.0007Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8.00003 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M11.5 10.4445L16.9445 5L18.5 6.55555L13.0555 12L18.5 17.4444L16.9445 18.9999L11.5 13.5555L6.05556 18.9999L4.5 17.4444L9.94444 12L4.5 6.55555L6.05556 5L11.5 10.4445Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M7 6V3C7 2.44772 7.44772 2 8 2H20C20.5523 2 21 2.44772 21 3V15C21 15.5523 20.5523 16 20 16H17V19C17 19.5523 16.5523 20 16 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6H7ZM5 8V18H15V8H5ZM9 6H17V14H19V4H9V6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M11.5 4C14.2486 4 16.6749 5.38626 18.1156 7.5H15.5V9.5H21.5V3.5H19.5V5.99936C17.6762 3.57166 14.7724 2 11.5 2C5.97715 2 1.5 6.47715 1.5 12H3.5C3.5 7.58172 7.08172 4 11.5 4ZM19.5 12C19.5 16.4183 15.9183 20 11.5 20C8.75144 20 6.32508 18.6137 4.88443 16.5H7.5V14.5H1.5V20.5H3.5V18.0006C5.32381 20.4283 8.22764 22 11.5 22C17.0228 22 21.5 17.5228 21.5 12H19.5Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M9 2V4H15V2H17V4H21C21.5523 4 22 4.44772 22 5V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V5C2 4.44772 2.44772 4 3 4H7V2H9ZM20 12H4V20H20V12ZM7 6H4V10H20V6H17V8H15V6H9V8H7V6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}
