import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const JavaSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? '2vw'}
    height={props.size ?? '2vw'}
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      className='fill-white dark:fill-black group-hover/icons:fill-[#E76F00]'
      d="M16.05 8.44C22.638 3.327 19.257 0 19.257 0c.503 5.287-5.444 6.536-7.038 10.17-1.088 2.479.745 4.65 3.829 7.385-.273-.606-.694-1.194-1.12-1.79-1.451-2.034-2.964-4.152 1.122-7.324Z"
    />
    <path
      className='fill-white dark:fill-black group-hover/icons:fill-[#E76F00]'
      d="M17.102 18.677s1.982-1.6.412-3.376c-5.32-6.03 5.82-8.765 5.82-8.765-6.802 3.277-5.787 5.221-4.077 7.584 1.83 2.534-2.155 4.557-2.155 4.557Z"
    />
    <path
      className='fill-white dark:fill-black group-hover/icons:fill-[#5382A1]'
      d="M22.937 23.446c6.105-3.12 3.282-6.118 1.312-5.714-.483.099-.698.184-.698.184s.18-.276.522-.396c3.898-1.347 6.895 3.975-1.259 6.083 0 0 .095-.083.123-.157ZM10.233 19.497c-3.82-.502 2.095-1.883 2.095-1.883s-2.297-.152-5.122 1.19c-3.34 1.59 8.262 2.312 14.268.759.624-.42 1.487-.783 1.487-.783s-2.457.431-4.905.634c-2.995.247-6.21.295-7.823.083ZM11.686 22.476c-2.13-.217-.735-1.232-.735-1.232-5.512 1.799 3.067 3.839 10.769 1.624-.819-.284-1.34-.803-1.34-.803-3.764.713-5.939.69-8.694.41ZM12.614 25.7c-2.128-.241-.885-.953-.885-.953-5.003 1.375 3.044 4.215 9.414 1.53-1.043-.398-1.79-.859-1.79-.859-2.842.529-4.16.57-6.739.281Z"
    />
    <path
      className='fill-white dark:fill-black group-hover/icons:fill-[#5382A1]'
      d="M25.939 27.339s.92.745-1.014 1.322c-3.677 1.096-15.304 1.426-18.534.044-1.161-.497 1.016-1.186 1.701-1.33.714-.153 1.123-.125 1.123-.125-1.292-.894-8.347 1.757-3.584 2.516 12.988 2.071 23.677-.933 20.308-2.427Z"
    />
    <path
      className='fill-white dark:fill-black group-hover/icons:fill-[#5382A1]'
      d="M28 28.968c-.213 2.727-9.212 3.3-15.073 2.931-3.823-.24-4.589-.843-4.6-.852 3.659.593 9.828.701 14.83-.224C27.59 30.002 28 28.968 28 28.968Z"
    />
  </svg>
);

export default JavaSVG;
