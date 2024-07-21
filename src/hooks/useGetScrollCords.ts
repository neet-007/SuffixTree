import { useEffect, useState } from "react";
export function useGetScrollCords(){
    const [windowScroll, setWindowScroll] = useState<{x:number, y:number}>({x:0, y:0});

    useEffect(() => {
        function updateWindowScroll(){
            setWindowScroll(prev => {
                if (Math.abs(prev.x - window.scrollX) > 100 || Math.abs(prev.y - window.scrollY) > 100){
                    return {x:window.scrollX, y:window.scrollY};
                };
                return prev
            });
        };

        window.addEventListener('scroll', updateWindowScroll);
        updateWindowScroll();

        return () => window.removeEventListener('scroll', updateWindowScroll);
    },[]);

    return windowScroll;
};