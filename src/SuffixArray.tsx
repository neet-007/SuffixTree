import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';
import Modal from './modal/Modal';
import { adjustDivHeigthToHeader, modalOverlayClick } from './utils/functions';

interface SuffixArrayProps extends ComponentProps<'div'>{

};

const SuffixArray:React.FC<SuffixArrayProps> = ({...props}) => {
    const {text, setSuffixArray, ALPHABET, command, skipCommands, setCommand} = useTreeContext()
    const [length, setLength] = useState(0);
    const [order, setOrder] = useState<number[]>(Array(text.length).fill(0));
    const [eqvClasses, setEqvClasses] = useState<number[]>(Array(text.length).fill(0));
    const [currModalTitle, setCurrTitle] = useState<'suffix array' | 'timer'>('suffix array');
    const [timer, setTimer] = useState<number>(2000);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const layoutRef = useRef<HTMLDivElement>(null);

    function hide(){
        if (!layoutRef.current){
            return
        };
        const div = layoutRef.current.children[0] as HTMLDivElement;
        adjustDivHeigthToHeader(layoutRef.current, div, isHidden);
        setIsHidden(prev => !prev);
    }

    useEffect(() => {
        if (command === -1){
            setLength(0);
            setOrder(Array(text.length).fill(0));
            setEqvClasses(Array(text.length).fill(0));
            if (layoutRef.current){
                layoutRef.current.style.height = '';
            };
        };
        if (command !== 1 && command !== 10 && command !== 1000){
            return
        };
        if (text !== '' && length > text.length){
            if (command === 10){
                setCommand(4);
            }else{
                setSuffixArray(order);
                setCommand(skipCommands[1] ? 2000 : 2);
            };
            return
        }else if (length === 0){
            if (command === 1000){
                function sortChars(){
                    const order_ = Array(text.length).fill(-1);
                    const count = Array(ALPHABET.length).fill(0);

                    for (let i = 0; i < text.length; i ++){
                        count[ALPHABET.indexOf(text[i].toLowerCase())] += 1;
                    };

                    for (let j = 1; j < count.length; j ++){
                        count[j] += count[j - 1];
                    };

                    for (let i = text.length - 1; i >= 0; i --){
                        count[ALPHABET.indexOf(text[i].toLowerCase())] -= 1;
                        order_[count[ALPHABET.indexOf(text[i].toLowerCase())]] = i;
                    };

                    return order_;
                };

                function computeClasses(order_:number[]){
                    const classes = Array(order_.length).fill(0);

                    for (let i = 1; i < text.length; i ++){
                        if (text[order_[i]] !== text[order_[i - 1]]){
                            classes[order_[i]] = classes[order_[i - 1]] + 1;
                        }else{
                            classes[order_[i]] = classes[order_[i - 1]];
                        };
                    };

                    return classes;
                };

                function sortingDoubles(l:number, order_:number[], classes:number[]){
                    const newOrder = Array(text.length).fill(0);
                    const count = Array(text.length).fill(0);

                    for (let i = 0; i < text.length; i ++){
                        count[classes[i]] += 1;
                    };

                    for (let j = 1; j < text.length; j ++){
                        count[j] += count[j - 1];
                    };

                    for (let i = text.length - 1; i >= 0; i --){
                        const start = (order_[i] - l + text.length) % text.length;
                        const cl = classes[start];
                        count[cl] -= 1;
                        newOrder[count[cl]] = start;
                    };

                    return newOrder;
                };

                function updateClasses(l:number, newOrder:number[], classes:number[]){
                    const newClasses = Array(text.length).fill(0);

                    for (let i = 1; i < text.length; i ++){
                        const curr = newOrder[i];
                        const prev = newOrder[i - 1];
                        const currMid = (curr + l) % text.length;
                        const prevMid = (prev + l) % text.length;

                        if (classes[curr] !== classes[prev] || classes[currMid] !== classes[prevMid]){
                            newClasses[curr] = newClasses[prev] + 1;
                        }else{
                            newClasses[curr] = newClasses[prev];
                        };
                    };
                    return newClasses;
                };
                    let order_ = sortChars();
                    let classes = computeClasses(order_);
                    let l = 1;

                    while (l < text.length){
                        order_ = sortingDoubles(l, order_, classes);
                        classes = updateClasses(l, order_, classes);
                        l *= 2;
                    };

                    setOrder(order_);
                    setLength(text.length + 1);
            }else{
                setTimeout(() => {
                    setOrder(prev => {
                        if (prev.length === 0){
                            prev = Array(text.length).fill(0);
                        };
                        const count = Array(ALPHABET.length).fill(0);

                        for (let i = 0; i < text.length; i ++){
                            count[ALPHABET.indexOf(text[i].toLowerCase())] += 1;
                        };

                        for (let j = 1; j < count.length; j ++){
                            count[j] += count[j - 1];
                        };

                        for (let i = text.length - 1; i >= 0; i --){
                            count[ALPHABET.indexOf(text[i].toLowerCase())] -= 1;
                            prev[count[ALPHABET.indexOf(text[i].toLowerCase())]] = i;
                        };

                        setEqvClasses(prev_ => {
                            if (prev_.length === 0){
                                prev_ = Array(text.length).fill(0);
                            };
                            for (let i = 1; i < text.length; i ++){
                                if (text[prev[i]] !== text[prev[i - 1]]){
                                    prev_[prev[i]] = prev_[prev[i - 1]] + 1;
                                }else{
                                    prev_[prev[i]] = prev_[prev[i - 1]];
                                };
                            };
                            return [...prev_]
                        });

                        setLength(1);
                        return [...prev]
                    });
                },timer);
            };
        }else{
            setTimeout(() => {
                setOrder(prevOrder => {
                    const newOrder = Array(text.length).fill(0);
                    const count = Array(text.length).fill(0);

                    for (let i = 0; i < text.length; i ++){
                        count[eqvClasses[i]] += 1;
                    };

                    for (let j = 1; j < text.length; j ++){
                        count[j] += count[j - 1];
                    };

                    for (let i = text.length - 1; i >= 0; i --){
                        const start = (prevOrder[i] - length + text.length) % text.length;
                        const cl = eqvClasses[start];
                        count[cl] -= 1;
                        newOrder[count[cl]] = start;
                    };

                    const newClasses = Array(text.length).fill(0);

                    for (let i = 1; i < text.length; i ++){
                        const curr = newOrder[i];
                        const prev = newOrder[i - 1];
                        const currMid = (curr + length) % text.length;
                        const prevMid = (prev + length) % text.length;

                        if (eqvClasses[curr] !== eqvClasses[prev] || eqvClasses[currMid] !== eqvClasses[prevMid]){
                            newClasses[curr] = newClasses[prev] + 1;
                        }else{
                            newClasses[curr] = newClasses[prev];
                        };
                    };

                    setEqvClasses(newClasses);
                    return newOrder
                });
                setLength(prev => prev * 2);
            },timer);
        };
    },[length, command])

    function handleReCalculate(){
        if (!layoutRef.current){
            return
        };
        setLength(0);
        setCommand(10);
        layoutRef.current.style.height = `${layoutRef.current.offsetHeight}px`;
    };
    return (
        <div ref={layoutRef} onClick={(e) => modalOverlayClick(e, setIsOpen)}>
            <div className='flex gap-1-rem align-items-center'>
                <h3 className='capitalize h2'>ordered suffixes</h3>
                <button className='height-max-content button' disabled={command !== 4} onClick={handleReCalculate}>recalculate</button>
                <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={() => {setIsOpen(true);setCurrTitle('timer')}}>set timer</button>
                <button className='height-max-content button' onClick={hide}>{isHidden ? 'show' : 'hide'}</button>
                <button className='height-max-content button thick-i text-transformation-none' onClick={() => {setIsOpen(true);setCurrTitle('suffix array')}}>i</button>
            </div>
            {order[0] !== -1 &&
            <div {...props}>
                {order.map((v, i) => {
                    return <div key={`suff-arr-${i}`}>
                            {text.slice(v, v + (length))}
                           </div>
                })}
            </div>
            }
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={currModalTitle} setTimer={currModalTitle === 'timer' ? setTimer : undefined}/>
        </div>
    )
}

export default SuffixArray