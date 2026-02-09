import { Github } from "lucide-react";
import * as React from "react";

interface SvgComponentProps {
    fill?: string;
    size?: string;
}

const GitSVG: React.FC<SvgComponentProps> = (props) => (
  <Github className="dark:text-black text-white dark:group-hover/icons:text-white group-hover/icons:text-black" width={props.size ?? '3vh'} height={props.size ?? '3vh'} />
);

export default GitSVG;
