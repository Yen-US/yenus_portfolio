import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const LinkedinSVG: React.FC<SvgComponentProps> = (props) => (
  <LinkedInLogoIcon className="dark:text-black text-white group-hover/icons:text-[#0A66C2]" width={props.size ?? '3vh'} height={props.size ?? '3vh'} />
);

export default LinkedinSVG;
