//Hook utilizado para validar si se esta usando una version movil en el cliente

import { useState, useEffect } from "react";

export function useIsMobile(breakpoint = 768) {

    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);

    return isMobile;
}

