import React, { ComponentProps, useState } from 'react'
import Node from './Node'
import Modal from './modal/Modal'
import { useTreeContext } from './TreeContext'
import { modalOverlayClick } from './utils/functions'

const SuffixTree:React.FC<ComponentProps<'div'>> = ({...props}) => {
    const {text, suffix, suffixTree, command, setCommand} = useTreeContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currModalTitle, setCurrTitle] = useState<'suffix tree' | 'timer'>('suffix tree');
    const [isHidden, setIsHidden] = useState<boolean>(false);

    function reDrawTree(){
        setCommand(30);
      };

    return (
        <div {...props} onClick={(e) => modalOverlayClick(e, setIsOpen)}>
        <div className='flex gap-2-rem align-items-center'>
            <h3>Suffix Tree</h3>
            <button className='height-max-content button' disabled={command !== 4} onClick={reDrawTree}>redraw tree</button>
            <button className='height-max-content button' disabled={command !== 0 && command !== 4} onClick={() => {setIsOpen(true); setCurrTitle('timer')}}>set timer</button>
            <button className='height-max-content button' onClick={() => setIsHidden(prev => !prev)}>{isHidden ? 'show' : 'hide'}</button>
            <button className='height-max-content button thick-i text-transformation-none' onClick={() => {setIsOpen(true); setCurrTitle('suffix tree')}}>i</button>
        </div>
        <div className='h3'>current suffix: {text.slice(suffix, text.length)}</div>
        {!isHidden &&
        <div className='height-100 width-100 flex flex-direction-column align-items-center'>
            <Node node={suffixTree[0]} adjustedHeight={0}/>
        </div>
        }
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={currModalTitle}/>
        </div>
    )
}

export default SuffixTree