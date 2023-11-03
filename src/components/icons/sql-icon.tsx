import * as React from "react";

interface SvgComponentProps {
  fill?: string;
  size?: string;
}

const SQLSVG: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size ?? '2vw'}
    height={props.size ?? '2vw'}
    viewBox="-8.78 0 70 70"
    {...props}
  >
    <path
      className='dark:fill-black fill-white group-hover/icons:fill-[#00bcf2]' 
      d="M22.065 69.955c-6.553-.472-13.029-2.121-17-4.33-2.263-1.257-3.986-2.803-4.663-4.18L0 60.625V9.21l.318-.646c1.423-2.89 5.965-5.494 12.304-7.056C14.774.976 17.881.447 20.415.18c2.588-.272 9.448-.23 12.03.073 6.86.806 12.699 2.611 16.297 5.038 1.387.936 2.811 2.433 3.294 3.464l.413.884-.035 25.63-.036 25.63-.332.675c-.182.371-.734 1.1-1.225 1.622-2.992 3.171-9.41 5.517-17.827 6.517-1.715.204-9.169.369-10.93.242zM34.14 47.927c-.025-.066-1.005-.938-2.177-1.94-1.172-1-2.181-1.866-2.243-1.924-.062-.057.155-.26.481-.452.327-.191.952-.724 1.39-1.183 1.28-1.342 1.884-3.001 1.884-5.174 0-2.138-.651-3.864-1.956-5.181-1.316-1.328-2.826-1.899-5.025-1.899-3.39 0-5.994 1.978-6.825 5.185-.286 1.104-.284 3.333.003 4.31.75 2.552 2.79 4.405 5.33 4.84.86.147.977.21 1.563.852.348.38 1.063 1.14 1.588 1.689l.955.996h2.539c1.396 0 2.518-.053 2.493-.12zm-8.707-7.109c-.61-.318-.842-.566-1.19-1.274-.27-.547-.316-.859-.319-2.152-.003-1.314.039-1.598.32-2.17.46-.933 1.094-1.375 2.074-1.446 1.364-.099 2.152.57 2.565 2.18.506 1.973-.05 4.071-1.265 4.767-.637.366-1.587.407-2.185.095zM14.18 44.481c2.662-.505 4.173-2.053 4.173-4.275 0-1.971-.976-3.12-3.672-4.323-1.543-.69-2.102-1.122-2.102-1.627 0-.42.53-.878 1.148-.993.603-.113 2.202.165 3.147.546l.792.32v-3.505l-.86-.19c-.53-.118-1.647-.189-2.921-.185-1.805 0-2.159.044-2.838.314-1.985.787-2.926 2.13-2.911 4.148.014 1.89 1.01 3.069 3.492 4.13 1.464.625 2.05 1.101 2.05 1.664 0 1.197-1.993 1.344-4.104.304l-1.154-.57c-.056-.029-.103.79-.103 1.819 0 1.862.002 1.871.34 2 1.27.483 4.076.698 5.523.423zm30.43-1.728v-1.58H39.8V30.311H35.537v14.022h9.074v-1.58zM29.764 15.048c4.235-.293 7.41-.848 10.202-1.782 2.783-.93 4.427-2.056 4.794-3.283.142-.473.132-.652-.066-1.17-.888-2.325-5.847-4.111-13.425-4.835-3.242-.31-9.137-.21-12.228.208-4.716.637-8.543 1.82-10.245 3.168-3.442 2.726.198 5.724 8.664 7.135 3.671.612 8.427.828 12.304.56z"
    />
  </svg>
);

export default SQLSVG;
