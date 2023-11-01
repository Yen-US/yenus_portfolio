import * as React from "react";

interface SvgComponentProps {
    fill?: string;
}

const LinuxSVG: React.FC<SvgComponentProps> = (props) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 32 32"
    {...props}
  >
    <title>{"linux"}</title>
    <path d="M14.923 8.08c-.025.072-.141.061-.207.082-.059.031-.107.085-.175.085-.062 0-.162-.025-.17-.085-.012-.082.11-.166.187-.166a.391.391 0 0 1 .326-.005l-.003-.001a.06.06 0 0 1 .038.055l-.001.008v.025h.004zm.688 0v-.027c-.008-.025.016-.052.036-.062a.396.396 0 0 1 .327.006l-.002-.001c.079 0 .2.084.187.169-.007.061-.106.082-.169.082-.069 0-.115-.054-.176-.085-.065-.023-.182-.01-.204-.081zm1.352 1.978a4.608 4.608 0 0 1-1.835.666l-.024.003a2.933 2.933 0 0 1-1.607-.588l.007.005c-.192-.167-.35-.335-.466-.419-.205-.167-.18-.416-.092-.416.136.02.161.167.249.25.12.082.269.25.45.416.397.328.899.541 1.45.583l.009.001a3.915 3.915 0 0 0 1.763-.592l-.016.01c.244-.169.556-.417.81-.584.195-.17.186-.334.349-.334.16.02.043.167-.184.415a9.973 9.973 0 0 1-.818.56l-.044.025zM8.017 21.397h.012c.069 0 .137.007.203.019l-.007-.001c.544.14.992.478 1.273.931l.005.009 1.137 2.079.004.004c.457.773.948 1.442 1.497 2.059l-.011-.013c.49.52.82 1.196.909 1.946l.002.016v.008a1.662 1.662 0 0 1-1.396 1.616l-.009.001a4.594 4.594 0 0 1-3.014-.592l.021.012a10.049 10.049 0 0 0-3.555-.752h-.015a1.214 1.214 0 0 1-.901-.496l-.002-.003a2.016 2.016 0 0 1 .159-1.548l-.005.011v-.005l.003-.004a3.031 3.031 0 0 0-.039-1.418l.005.021a1.956 1.956 0 0 1 .058-1.189l-.004.014c.2-.417.495-.5.862-.666a3.51 3.51 0 0 0 1.151-.593l-.008.006h.002v-.003c.32-.335.556-.751.835-1.047.195-.249.492-.41.827-.42h.002zm13.514-.061-.001.059c0 .743.449 1.381 1.091 1.658l.012.005a2.72 2.72 0 0 0 2.235-.952l.003-.004.264-.012a1.29 1.29 0 0 1 1.059.336l-.001-.001.004.004c.249.301.422.673.487 1.082l.002.013c.055.505.238.96.517 1.34l-.005-.008c.416.356.705.85.793 1.411l.002.013.004-.009v.022l-.004-.015c-.019.327-.231.495-.622.744a10.428 10.428 0 0 0-3.077 1.968l.007-.006a3.875 3.875 0 0 1-2.523 1.486l-.021.002a1.872 1.872 0 0 1-1.963-1.11l-.005-.012-.006-.004a3.126 3.126 0 0 1-.146-.956c0-.416.079-.813.224-1.178l-.008.022c.234-.668.435-1.466.568-2.288l.011-.083c.016-.812.104-1.593.258-2.35l-.014.083a1.81 1.81 0 0 1 .794-1.225l.007-.004.056-.027zM18.8 10.142a29.697 29.697 0 0 0 2.247 5.757l-.079-.167a12.82 12.82 0 0 1 1.363 3.695l.014.084h.031c.217 0 .427.029.627.084l-.017-.004a4.97 4.97 0 0 0 .173-1.316 5.07 5.07 0 0 0-1.533-3.639l-.001-.001c-.275-.25-.29-.419-.154-.419a7.246 7.246 0 0 1 2.045 3.394l.012.051a4.395 4.395 0 0 1 .021 2.117l.006-.03c.074.038.16.067.251.083l.006.001c1.29.667 1.766 1.172 1.537 1.921v-.054c-.075-.004-.15 0-.225 0h-.02c.189-.584-.227-1.031-1.331-1.53-1.143-.5-2.057-.42-2.212.581a.999.999 0 0 0-.022.165v.003c-.073.03-.16.058-.25.078l-.011.002c-.508.336-.87.859-.989 1.469l-.002.014c-.148.695-.241 1.5-.256 2.323v.016a9.39 9.39 0 0 1-.418 1.753l.02-.066a5.725 5.725 0 0 1-3.634 1.29 5.732 5.732 0 0 1-3.073-.887l.024.014a3.333 3.333 0 0 0-.503-.667l.001.001a1.83 1.83 0 0 0-.342-.415l-.002-.001c.207 0 .407-.031.596-.088l-.015.004a.779.779 0 0 0 .391-.412l.002-.005a1.648 1.648 0 0 0-.432-1.454l.001.001a7.992 7.992 0 0 0-2.196-1.88l-.038-.02a3.196 3.196 0 0 1-1.43-1.722l-.007-.022a3.954 3.954 0 0 1-.013-2.083l-.006.027a12.157 12.157 0 0 1 1.62-3.496l-.028.043c.134-.081.046.169-.51 1.217a4.575 4.575 0 0 0-.757 2.533c0 .84.224 1.627.616 2.306l-.012-.022c.052-1.309.345-2.537.834-3.659l-.025.065a21.101 21.101 0 0 0 2.275-6.452l.02-.131c.06.045.271.169.361.252.272.166.475.416.737.581.267.26.633.42 1.035.42l.063-.001h-.003c.049.004.094.008.137.008a2.657 2.657 0 0 0 1.259-.342l-.013.007c.362-.167.65-.417.925-.5h.006a2.423 2.423 0 0 0 1.3-.869l.004-.006zm-3.499-2.677h.009c.569 0 1.094.187 1.517.503l-.007-.005c.378.234.814.433 1.275.574l.04.01h.004c.246.11.449.281.594.494l.003.005v-.164a.71.71 0 0 1 .019.592l.002-.005a2.237 2.237 0 0 1-1.313 1.048l-.016.004v.002c-.335.169-.626.416-.968.581-.35.21-.771.334-1.222.334h-.045.002a1.407 1.407 0 0 1-.57-.087l.01.003a4.53 4.53 0 0 1-.417-.257l.014.01a7.16 7.16 0 0 0-.739-.565l-.026-.016v-.006h-.006a1.97 1.97 0 0 1-.852-.876l-.005-.012a.626.626 0 0 1 .239-.748l.002-.001c.28-.169.475-.339.604-.42.13-.092.179-.127.22-.164h.002v-.004a2.314 2.314 0 0 1 1.032-.746l.016-.005a2.21 2.21 0 0 1 .581-.081h.001zm-1.712-2.132h.045a.875.875 0 0 1 .501.17l-.002-.002c.179.159.325.352.425.57l.004.011c.113.245.183.53.191.83v.008a1.804 1.804 0 0 1-.003.34l.001-.008v.1c-.037.009-.07.022-.104.03a3.4 3.4 0 0 0-.505.258l.014-.008a1.293 1.293 0 0 0 .003-.34l.001.006v-.019a1.668 1.668 0 0 0-.107-.428l.004.011a.77.77 0 0 0-.207-.333.31.31 0 0 0-.209-.081l-.021.001h.001-.026a.293.293 0 0 0-.232.163l-.001.002a.694.694 0 0 0-.15.334v.004a1.128 1.128 0 0 0-.028.418v-.005.019c.016.154.052.296.104.428l-.004-.011a.792.792 0 0 0 .207.335.16.16 0 0 0 .042.03h.001a1.488 1.488 0 0 0-.221.171l.001-.001c-.045.04-.1.07-.161.084l-.003.001a3.24 3.24 0 0 1-.335-.486l-.008-.016a2.18 2.18 0 0 1-.194-.83v-.004a2.216 2.216 0 0 1 .104-.851l-.004.016c.074-.258.195-.481.356-.671l-.002.003a.703.703 0 0 1 .522-.25h.001zm3.702-.074h.02c.275 0 .527.093.729.249l-.003-.002c.229.177.413.4.542.655l.005.011c.121.266.196.575.207.901v.004c0-.025.007-.05.007-.075v.131l-.005-.026-.005-.03c-.003.32-.071.622-.193.897l.006-.014a1.201 1.201 0 0 1-.266.419.774.774 0 0 0-.104-.05l-.006-.002a1.422 1.422 0 0 1-.36-.169l.005.003a1.61 1.61 0 0 0-.264-.081l-.011-.002c.081-.076.156-.157.225-.243l.004-.005c.063-.148.102-.319.11-.499V7.278c0-.17-.028-.333-.08-.485l.003.011a1.849 1.849 0 0 0-.232-.421l.004.005a.57.57 0 0 0-.331-.165h-.027a.399.399 0 0 0-.322.164l-.001.001a.993.993 0 0 0-.254.41l-.002.007a1.435 1.435 0 0 0-.112.496v.027c.002.12.011.236.027.349l-.002-.015c-.241-.084-.547-.169-.759-.252a1.814 1.814 0 0 1-.022-.247v-.028l-.001-.066a2.2 2.2 0 0 1 .194-.908l-.006.014c.106-.279.293-.508.532-.663l.005-.003a1.22 1.22 0 0 1 .742-.25zm-.661-4.255c-.194 0-.394.01-.6.026-5.281.416-3.88 6.007-3.961 7.87a6.716 6.716 0 0 1-1.325 3.792l.013-.018a18.584 18.584 0 0 0-3.351 5.523l-.043.127a6.585 6.585 0 0 0-.408 2.302c0 .285.018.566.052.841l-.003-.033a.531.531 0 0 0-.136.166l-.001.003c-.325.335-.562.75-.829 1.048a3 3 0 0 1-.975.494l-.021.005a1.854 1.854 0 0 0-1.075.841L3.962 24a1.652 1.652 0 0 0-.165.725v.029-.001c.002.238.026.469.073.693l-.004-.023a3.058 3.058 0 0 1 .047 1.23l.002-.018a2.3 2.3 0 0 0-.264 1.08c0 .278.048.544.137.791l-.005-.016c.273.388.686.662 1.164.749l.011.002c1.274.107 2.451.373 3.561.78l-.094-.03c.698.415 1.539.66 2.436.66.294 0 .582-.026.862-.077l-.029.004a2.226 2.226 0 0 0 1.504-1.169l.006-.013c.734-.004 1.537-.336 2.824-.417.873-.072 1.967.334 3.22.25a2.1 2.1 0 0 0 .148.429l-.006-.013.004.004a2.351 2.351 0 0 0 2.364 1.338l-.01.001a4.382 4.382 0 0 0 2.813-1.623l.007-.009a10.149 10.149 0 0 1 2.905-1.853l.067-.025c.432-.191.742-.585.81-1.059l.001-.007a2.51 2.51 0 0 0-.888-1.716l-.004-.003v-.121l-.004-.004a2.8 2.8 0 0 1-.421-1.142l-.002-.015a2.168 2.168 0 0 0-.615-1.307h-.004c-.074-.067-.154-.084-.235-.169a.442.442 0 0 0-.237-.08h-.001a6.601 6.601 0 0 0 .308-2.013c0-.94-.193-1.835-.541-2.647l.017.044a15.73 15.73 0 0 0-2.732-4.369l.014.017A6.519 6.519 0 0 1 21.058 8.7l-.001-.021c.033-2.689.295-7.664-4.429-7.671z" />
  </svg>
);

export default LinuxSVG;
