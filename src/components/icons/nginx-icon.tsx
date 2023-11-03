import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const NginxSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? '3vh'}
    height={props.size ?? '3vh'}
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      d="M15.948 2h.065a10.418 10.418 0 0 1 .972.528l10.858 6.246a.792.792 0 0 1 .414.788c-.008 4.389 0 8.777-.005 13.164a.813.813 0 0 1-.356.507q-5.773 3.324-11.547 6.644a.587.587 0 0 1-.657.037q-5.78-3.314-11.549-6.64a.7.7 0 0 1-.4-.666V9.445a.693.693 0 0 1 .387-.67q5.422-3.118 10.844-6.24c.322-.184.638-.379.974-.535"
      className='dark:fill-black fill-white group-hover/icons:fill-[#019639]'
    />
    <path
      d="M8.767 10.538v10.859a1.509 1.509 0 0 0 .427 1.087 1.647 1.647 0 0 0 2.06.206 1.564 1.564 0 0 0 .685-1.293c0-2.62-.005-5.24 0-7.86q3.583 4.29 7.181 8.568a2.833 2.833 0 0 0 2.6.782 1.561 1.561 0 0 0 1.251-1.371q.008-5.541 0-11.081a1.582 1.582 0 0 0-3.152 0c0 2.662-.016 5.321 0 7.982-2.346-2.766-4.663-5.556-7-8.332a2.817 2.817 0 0 0-2.649-1.052 1.579 1.579 0 0 0-1.403 1.505Z"
      className='dark:fill-white fill-black group-hover/icons:fill-white'
    />
  </svg>
);

export default NginxSVG;
