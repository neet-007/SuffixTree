import React, { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';
import Modal from './modal/Modal';
import { adjustDivHeigthToHeader, modalOverlayClick } from './utils/functions';

interface LcpArrayProps extends ComponentProps<'div'>{

};

const LcpArray:React.FC<LcpArrayProps> = ({...props}) => {
    const {text, suffixArray, command, skipCommands, setLcpArray, setCommand, setSuffix:setSuffix_} = useTreeContext()
    const [lcpArrayBefore, setLcpArrayBefore] = useState<number[]>([]);
    const [lcp, setLcp] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(1);
    const [suffix, setSuffix] = useState<number | undefined>(suffixArray[0]);
    const [nextSuffix, setNextSuffix] = useState<number>(-1);
    const [currModalTitle, setCurrTitle] = useState<'lcp array' | 'timer'>('lcp array');
    const [timer, setTimer] = useState<number>(2000);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const layoutRef = useRef<HTMLDivElement>(null);

    const inverseOrder = useMemo(() => {
        if (suffixArray.length === 0){
            return []
        };

        const return_value = Array(suffixArray.length).fill(0);
        for (let i = 0; i < suffixArray.length; i ++){
            return_value[suffixArray[i]] = i;
        };

        return return_value
    },[text, suffixArray.length]);

    useEffect(() => {
        if (command === -1){
            setNextSuffix(-1);
            setSuffix(undefined);
            setLcpArrayBefore([]);
            setLcp(0);
            setCurrIndex(1);
            if (layoutRef.current){
                layoutRef.current.style.height = '';
            };
        };
        if (command !== 2 && command !== 20 && command !== 2000){
            return
        };
        if (inverseOrder.length === 0){
            return
        };
        if (currIndex >= text.length){
            if (command === 20){
                setCommand(4);
            }else{
                setLcpArray(lcpArrayBefore);
                setCommand(skipCommands[2] ? 3000 : 3);
                setSuffix_(suffixArray[0]);
            };
            return;
        };
        if (command === 2000){
            function compareLCP(i:number, j:number, lcp__:number){
                let lcp_ = Math.max(0, lcp__);
                while (i + lcp_ < text.length && j + lcp_ < text.length){
                    if (text[i + lcp_] === text[j + lcp_]){
                        lcp_ += 1;
                    }else{
                        break;
                    };
                };

                return lcp_;
            };

            const lcpArray_ = Array(suffixArray.length - 1).fill(0);

            let lcp_ = 0;

            let suffix_ = suffixArray[0];
            let i = 0
            while (i < text.length){
                const currIndex_ = inverseOrder[suffix_];
                if (currIndex_ === text.length - 1){
                    lcp_ = 0;
                    suffix_ = (suffix_ + 1) % text.length;
                    continue;
                };
                const nextSuffix_ = suffixArray[currIndex_ + 1];
                lcp_ = compareLCP(suffix_, nextSuffix_, lcp_ - 1);
                lcpArray_[currIndex_] = lcp_;
                suffix_ = (suffix_ + 1) % text.length;
                i++;
            };
            setCurrIndex(i);
            setLcpArrayBefore(lcpArray_);
        }else if (suffix === undefined){
            setSuffix(suffixArray[0]);
            setLcpArrayBefore(Array(text.length - 1).fill(-1))
        }else if (nextSuffix === -1){
            const currIndex_ = inverseOrder[suffix];
            if (currIndex_ === text.length - 1){
                setLcp(0);
                setSuffix(prev => {
                    return (prev! + 1) % text.length
                });
            }else{
                setNextSuffix(suffixArray[currIndex_ + 1]);
            };
        }else if (nextSuffix === -2){
            setSuffix(prev => {
                setLcpArrayBefore(prevLcp => {
                    prevLcp[inverseOrder[prev!]] = lcp;
                    return [...prevLcp]
                });
                return (prev! + 1) % text.length
            });
            setLcp(prev => prev - 1);
            setNextSuffix(-1);
            setCurrIndex(prev => prev + 1);
        }else{
            setTimeout(() => {
                const prevLcp = Math.max(0, lcp);
                if (suffix + prevLcp < text.length && nextSuffix + prevLcp < text.length){
                    if (text[suffix + prevLcp] === text[nextSuffix + prevLcp]){
                        setLcp(prevLcp + 1);
                    }else{
                        setLcp(prevLcp);
                        setNextSuffix(-2);
                    };
                }else{
                    setLcp(prevLcp);
                    setNextSuffix(-2);
                };
            },timer);
        };
    },[currIndex, command, suffix, nextSuffix, lcp, inverseOrder.length]);

    function handleReCalculate(){
        if (!layoutRef.current){
            return
        };
        setSuffix(suffixArray[0]);
        setNextSuffix(-1);
        setLcp(0);
        setCurrIndex(1);
        setLcpArrayBefore(Array(text.length - 1).fill(-1));
        setCommand(20);
        layoutRef.current.style.height = `${layoutRef.current.offsetHeight}px`;
    };

    function hide(){
        if (!layoutRef.current){
            return
        };
        const div = layoutRef.current.children[0] as HTMLDivElement;
        adjustDivHeigthToHeader(layoutRef.current, div, isHidden);
        setIsHidden(prev => !prev);
    }

    let lcp_ = lcp < 0 ? 0 : lcp;
    return (
        <div ref={layoutRef} onClick={(e) => modalOverlayClick(e, setIsOpen)} {...props}>
            <div className='flex gap-1-rem align-items-center'>
                <h3 className='capitalize h2' style={{width:'max-content'}}>LCP for ordered suffixes</h3>
                <button className='height-max-content button' disabled={command !== 4} onClick={handleReCalculate}>recalculate</button>
                <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={() => {setIsOpen(true);setCurrTitle('timer')}}>set timer</button>
                <button className='height-max-content button' onClick={hide}>{isHidden ? 'show' : 'hide'}</button>
                <button className='height-max-content button thick-i text-transformation-none' onClick={() => {setIsOpen(true);setCurrTitle('lcp array')}}>i</button>
            </div>
            <div>{command < 2 ? 0 : currIndex} / {text.length > 0 ? text.length: 0}</div>
            <div className='flex flex-direction-column'>
                <p className='h3'>suffix: {(command === 2 || command === 20) ? text.slice(suffix, text.length).split('').map((v, i) => (
                    <span key={`lcp-arr-suffix-${v}-${i}`} className={lcp_ === i ? 'heighlited-char': lcp_ > i ? 'found-char' : ''}>{v}</span>
                )) : ''}</p>
                <p className='h3'>nextSuffix: {nextSuffix > -1 ? text.slice(nextSuffix, text.length).split('').map((v, i) => (
                    <span key={`lcp-arr-next-suffix-${v}-${i}`} className={lcp_ === i ? 'heighlited-char' : lcp_ > i ? 'found-char' : ''}>{v}</span>
                )) : ''}</p>
            </div>
            {lcpArrayBefore.map((v, i) => {
                return <div key={`lcp-arr-${i}`}>
                            {
                                v === -1 ?
                                `pending for common preffixes between ${i + 1}, ${i + 2}`
                                :
                                `${v} common preffix between ${i + 1}, ${i + 2}`
                            }
                       </div>
            })}
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={currModalTitle} setTimer={currModalTitle === 'timer' ? setTimer : undefined}/>
        </div>
    );
};

export default LcpArray