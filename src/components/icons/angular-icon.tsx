import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const AngularSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width={props.size ?? '2vw'}
  height={props.size ?? '2vw'}
  fill="none"
  viewBox="0 0 32 32"
  {...props}
>
  <path className="dark:fill-black fill-white group-hover/icons:fill-[#DD0031]" d="M16 2 3 7l2 17 11 6 11-6 2-17-13-5Z" />
  <path className="dark:fill-black fill-white group-hover/icons:fill-[#DD0031]" d="M16 2v28l11-6 2-17-13-5Z" />
  <path
    className='dark:fill-white fill-black group-hover/icons:fill-white'
    d="m16 5.094-8.127 18.27h3.03l1.634-4.088h6.898l1.634 4.088h3.03l-8.1-18.27Zm2.374 11.662h-4.748L16 11.03l2.374 5.726Z"
  />
</svg>
);

export default AngularSVG;
