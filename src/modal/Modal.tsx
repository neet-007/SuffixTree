import React, { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import ModalContent from './ModalContent';
import { LCP_CONTENT, SA_CONTENT, ST_CONTENT } from './content';

interface ModalProps extends ComponentProps<'div'>{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    title: 'suffix array' | 'lcp array' | 'suffix tree' | 'timer';
    setTimer?:React.Dispatch<React.SetStateAction<number>>;
}

const Modal:React.FC<ModalProps> = ({isOpen, setIsOpen, title, setTimer, ...props}) => {
    if (!isOpen) {
        return null
    };
    return (
        createPortal(
            <>
                <div id='modal-overlay' className='position-fixed all-dir-0 z-index-100' style={{backgroundColor:'rgba(0,0,0,0.75)'}} {...props}>
                </div>
                <div style={{position:'fixed', left:'50%', top:'50%', transform:'translate(-50%, -50%)',
                            minHeight:'20rem', minWidth:'40rem', backgroundColor:'white', borderRadius:'1rem',
                            display:'flex', flexDirection:'column', padding:'1rem', zIndex:'1000'
                        }}>
                    <div className='flex justify-content-between align-items-center'>
                        <p className='capitalize h3'>{title}</p>
                        <button className='height-max-content invisible-button' style={{fontSize:'1em'}} onClick={() => setIsOpen(false)}>&#10006;</button>
                    </div>
                    {(title === 'timer' && setTimer) ?
                    <div className='flex gap-2-rem'>
                        <input type="number" className='b-1-black b-1-radius'/>
                        <button
                            className='button height-max-content'
                            onClick={(e) => {
                            const elem = e.currentTarget.previousSibling as HTMLInputElement
                            setTimer(Number(elem.value))
                            }}>set</button>
                    </div>
                    :
                        <ModalContent passedContent={
                            title === 'suffix array' ?
                            SA_CONTENT :
                            title === 'lcp array' ?
                            LCP_CONTENT :
                            ST_CONTENT
                        }/>
                    }
                </div>
            </>
        , document.getElementById('modal-div')!)
    )
}

export default Modal