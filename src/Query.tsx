import React, { ComponentProps, useRef } from 'react'
import { useTreeContext } from './TreeContext';
import DynamicHeightInput from './DynamicHeightInput';

export type QueryType = {char:string, className: 'heighlited-char' | 'found-char' | 'unmatching-char' | ''}

interface QueryProps extends ComponentProps<'div'>{

}

const Query:React.FC<QueryProps> = ({...props}) => {
    const {command, text, query, qResults, handleQuery} = useTreeContext();

    const queryRef = useRef<HTMLDivElement>(null);

    function onChangeHandler(str:string, setState:React.Dispatch<React.SetStateAction<string>>){
        if (!queryRef.current){
            return
        };

        const textarea = queryRef.current.children[1] as HTMLTextAreaElement;
        if (str.length >= text.length - 1){
            textarea.maxLength = textarea.textLength;
        }else{
            setState(str);
            textarea.removeAttribute('maxLength');
        };
    };

    function handleClickQuery(){
        if (!queryRef.current){
          return
        };
        const inputElem = queryRef.current.children[1] as HTMLTextAreaElement
        const q = inputElem.value.toLowerCase().replace(/\s+/g, '').split('').reduce((prev:QueryType[], curr:string) => {
            prev.push({char:curr.toLocaleLowerCase(), className:prev.length === 0 ? 'heighlited-char' : ''});
            return prev
        },[]);
        handleQuery(q);
      };

    return (
        <div className='flex flex-direction-column' {...props}>
        <div className='flex align-items-center gap-2-rem'>
            <DynamicHeightInput passedLabel='query' passedPlaceHolder='query should be shorter than the text' ref={queryRef} onChangeHandler={onChangeHandler}/>
            <button className='height-max-content button' disabled={command !== 4} onClick={handleClickQuery}>query</button>
        </div>
        <div className='h3'>query: {query.map((v, i) => (
            <span key={`query-text-${v.char}-${i}`} className={v.className}>{v.char}</span>
            ))}
        </div>
        <p>results: {qResults === undefined ? '' : qResults ? 'found' : 'not found'}</p>
    </div>
    )
}

export default Query