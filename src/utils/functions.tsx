export function modalOverlayClick(e:React.MouseEvent<HTMLDivElement, MouseEvent>, handler:React.Dispatch<React.SetStateAction<boolean>>){
    const element = e.target as HTMLDivElement
    if (element.id === 'modal-overlay'){
        handler(false);
    };
};

export function adjustDivHeigthToHeader(div:HTMLDivElement | null, child:HTMLDivElement | null, hidden:boolean){
    if (!div || !child){
        return
    };
    if (hidden){
        div.style.height = ``;
        div.style.overflow = 'visible';
        return
    };
    div.style.height = `${child.offsetHeight}px`;
    div.style.overflow = 'hidden';
};