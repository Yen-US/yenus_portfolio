import * as React from "react";

interface SvgComponentProps {
  fill?: string;
  size?: string;
}

const JiraSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? '2vw'}
    height={props.size ?? '2vw'}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      className='dark:fill-black fill-white group-hover/icons:fill-[#2684FF]' 
      d="M15.808 7.552 8.69.667 8 0 2.642 5.183l-2.45 2.37A.623.623 0 0 0 0 8c0 .168.069.329.192.448l4.895 4.735L8 16l5.358-5.183.083-.08 2.367-2.29A.623.623 0 0 0 16 8a.623.623 0 0 0-.192-.448zM8 10.365 5.554 8 8 5.635 10.446 8 8 10.365z"
    />
    <path
      className='dark:fill-black fill-white group-hover/icons:fill-[url(#a)]' 
      d="M8 5.634A3.918 3.918 0 0 1 6.794 2.83 3.917 3.917 0 0 1 7.983.018L2.63 5.193 5.543 8.01 8 5.634z"
    />
    <path
      className='dark:fill-black fill-white group-hover/icons:fill-[url(#b)]' 
      d="M10.452 7.994 8 10.365c.383.37.686.81.893 1.293a3.87 3.87 0 0 1 0 3.05c-.207.483-.51.922-.893 1.292l5.365-5.189-2.913-2.817z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={7.563}
        x2={4.262}
        y1={3.241}
        y2={6.654}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.18} stopColor="#0052CC" />
        <stop offset={1} stopColor="#2684FF" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={216.055}
        x2={331.647}
        y1={490.616}
        y2={413.158}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.18} stopColor="#0052CC" />
        <stop offset={1} stopColor="#2684FF" />
      </linearGradient>
    </defs>
  </svg>
);

export default JiraSVG;
