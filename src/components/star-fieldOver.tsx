import { ReactNode } from "react";

interface StarFieldProps {
    children?: ReactNode;
}

export default function StarFieldOver({ children }: StarFieldProps) {
    const stars = Array.from({ length: 200 }, (_, index) => (
        <div
            key={index}
            className="dark:bg-white bg-blue-700 absolute overflow-hidden rounded-full animate-star"
            style={{
                width: `${getRandomNumber(1, 3)}px`,
                height: `${getRandomNumber(1, 3)}px`,
                left: `${getRandomNumber(0, 100)}%`,
                top: '100%',
                animationDelay: `${(index / 2).toFixed(1)}s`, // Set animation delay
            }}
        ></div>
    ));

    return (
        <div className="star-field dark:bg-radial-gradient-dark bg-radial-gradient relative overflow-hidden min-w-full min-h-full">
            {stars}
            {children}
        </div>
    );
}

const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
