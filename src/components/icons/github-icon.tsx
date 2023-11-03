import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const GitSVG: React.FC<SvgComponentProps> = (props) => (
  <GitHubLogoIcon className="dark:text-black text-white dark:group-hover/icons:text-white group-hover/icons:text-black" width={props.size ?? '2vw'} height={props.size ?? '2vw'} />
);

export default GitSVG;
