import * as React from "react";

interface SvgComponentProps {
  fill?: string;
  size?: string;
}

const JSSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="JavaScript"
    viewBox="-40 -45 600 600"
    width={props.size ?? '2vw'}
    height={props.size ?? '2vw'}
    {...props}
  >
    <rect width={512} height={512} className='dark:fill-black fill-white group-hover/icons:fill-[#f7df1e]' rx="15%" />
    <path className='dark:fill-white fill-black group-hover/icons:fill-black' 
    d="M324 370c10 17 24 29 47 29 20 0 33-10 33-24 0-16-13-22-35-32l-12-5c-35-15-58-33-58-72 0-36 27-64 70-64 31 0 53 11 68 39l-37 24c-8-15-17-21-31-21s-23 9-23 21c0 14 9 20 30 29l12 5c41 18 64 35 64 76 0 43-34 67-80 67-45 0-74-21-88-49zm-170 4c8 13 14 25 31 25 16 0 26-6 26-30V203h48v164c0 50-29 72-72 72-39 0-61-20-72-44z" />
  </svg>
);

export default JSSVG;
