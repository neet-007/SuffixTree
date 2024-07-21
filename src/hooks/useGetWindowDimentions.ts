import { useEffect, useRef, useState } from "react";

const WIDTH_THRESH_HOLD = 50;
const HEIGHT_THRESH_HOLD = Math.floor(WIDTH_THRESH_HOLD / 2)

export function useGetWindowDimentions(){
    const [windowDimentions, setWindowDimentions] = useState<{height:number, width:number}>({height:0, width:0});
    const prevDimentios = useRef<{height:number, width:number}>({height:window.innerWidth, width:window.innerHeight});
    useEffect(() => {
        function updateWindowDimentions(){
            if (Math.abs(prevDimentios.current.width - window.innerWidth) > WIDTH_THRESH_HOLD || Math.abs(prevDimentios.current.height - window.innerHeight) > HEIGHT_THRESH_HOLD){
                setWindowDimentions(prev => {
                    prevDimentios.current = {...prev};
                    return {height:window.innerHeight, width:window.innerWidth}
                });
            };
        };

        window.addEventListener('resize', updateWindowDimentions);
        updateWindowDimentions();

        return () => window.removeEventListener('resize', updateWindowDimentions);
    },[]);

    return windowDimentions;
};