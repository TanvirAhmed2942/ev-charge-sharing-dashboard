"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LOTTIE_PATH = "/lottiefiles/zap.lottie";

export const ZapAnimation = () => {
    return (
        <DotLottieReact
            className="w-full h-full object-cover"
            src={LOTTIE_PATH}
            loop
            autoplay
        />
    );
};
