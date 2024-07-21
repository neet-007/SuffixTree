import { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';
import { useGetWindowDimentions } from './hooks/useGetWindowDimentions';

const CHARDIST = 30;

const CONVERTE_TO_PX = parseFloat(getComputedStyle(document.documentElement).fontSize);

const GAP = 2;

const CONVERTED_GAP = (GAP * CONVERTE_TO_PX);
const CONVERTED_GAP_OVER_2 = CONVERTED_GAP / 2;
const DEG_TO_RAD = 180/Math.PI;
const RAD_TO_DEG = Math.PI/180;

export type NodeChildrenType = {
    index:number;
    currChar:number;
    className:'heighlited-char' | 'found-char' | 'unmatching-char' | '';
};

export type NodeType = {
    parent:number,
    stringDepth:number,
    edgeStart:number,
    edgeEnd:number,
    children:NodeChildrenType[],
    nodeClassName:'heighlited-node' | 'found-node' | 'unmatching-node' | '',
};

type RectType = {
    x1:number,
    x2:number,
    y1:number,
    y2:number,
    width:number,
    height:number,
    angle:number
};

interface NodeProps extends ComponentProps<'div'>{
    node:NodeType;
    adjustedHeight:number;
};

const NodeTest = forwardRef<HTMLDivElement, NodeProps>(({node, adjustedHeight, ...props}, ref) => {
    const {text, suffixTree, ALPHABET} = useTreeContext();
    const [nodeChildrenDimentions, setNodeChildrenDimentions] = useState<RectType[]>(Array(ALPHABET.length).fill({x1:0, y1:0, x2:0, y2:0, width:0, height:0, angle:0}));
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const childrenRef = useRef<Map<any, any> | null>(null);
    const windowDimentions = useGetWindowDimentions()

    useEffect(() => {
        if (nodeRef.current){
            const map = getMap();
            const arr = Array(ALPHABET.length).fill({x1:0, y1:0, x2:0, y2:0, width:0, height:0, angle:0});
            const parentRect = nodeRef.current.children[0].getBoundingClientRect();
            map.forEach((val, key) => {
                if (!val){
                    arr[key] = {
                        x1:0,
                        y1:0,
                        x2:0,
                        y2:0,
                        width:0,
                        height:0,
                        angle:0
                    };
                }else{
                    arr[key] = {
                        x1:parentRect.x + window.scrollX + parentRect.width - CONVERTED_GAP_OVER_2,
                        y1:parentRect.y + window.scrollY + parentRect.height - CONVERTED_GAP_OVER_2,
                        x2:val.x + window.scrollX + val.width - CONVERTED_GAP_OVER_2,
                        y2:val.y + window.scrollY + val.height - CONVERTED_GAP_OVER_2,
                        width:val.width,
                        height:val.height,
                        angle:Math.atan2((val.y - parentRect.y), (val.x - parentRect.x)) * DEG_TO_RAD
                    };
                };
            });

            setNodeChildrenDimentions(arr);
        };
    },[suffixTree.length, windowDimentions.height, windowDimentions.width]);

    function getMap(){
        if (!childrenRef.current){
            childrenRef.current = new Map()
        };
        return childrenRef.current;
    };
    return (
        <div ref={nodeRef} className='flex flex-direction-column align-items-center width-100' style={{marginTop:`${adjustedHeight}px`}} {...props}>
            <div style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                height:'0.5rem',
                width:'0.5rem',
                padding:'0.25rem',
                border:'1px solid black',
                borderRadius:'50%',
                backgroundColor:`${node.nodeClassName === '' ? 'white': ''}`,
            }}
            className={node.nodeClassName}
            ref={ref}
            ></div>
            <div style={{
                display:'flex',
                justifyContent:'center',
                gap:`${GAP}rem`,
                height:'100%',
                width:'100%'
            }}>
                {(() => {
                    if (!node){
                        return null
                    };
                    const children = node.children.reduce((prev:NodeChildrenType[], curr:NodeChildrenType) => {
                        if (curr.index !== -1){
                            prev.push(curr);
                        };
                        return prev
                    },[]);
                    let adjH = suffixTree.reduce((prev:number, curr:NodeType, i:number) => {
                        if (children.find(x => x.index === i) && curr.edgeEnd + 1 - curr.edgeStart > prev){
                            return (curr.edgeEnd + 1 - curr.edgeStart);
                        };
                        return prev
                    },0);
                    adjH *= (CHARDIST * 1.75);
                    //const adjH = children.length > 0 ? ((suffixTree[children[Math.floor(children.length / 2)]].edgeEnd + 1 - suffixTree[children[Math.floor(children.length / 2)]].edgeStart) * CHARDIST) : 0;
                    return children.map((v, i) => {
                        const key = ALPHABET.indexOf(text[suffixTree[v.index].edgeStart]);
                        return <div key={`node-${node.edgeStart}-child-${i}`}
                                className='height-100 width-100'>
                                <svg className='position-absolute top-0 left-0 width-100 height-100 z-index-n-1'>
                                    <line x1={nodeChildrenDimentions[key].x1}
                                        y1={nodeChildrenDimentions[key].y1}
                                        x2={nodeChildrenDimentions[key].x2}
                                        y2={nodeChildrenDimentions[key].y2}
                                        height={nodeChildrenDimentions[key].height}
                                        width={nodeChildrenDimentions[key].width}
                                        stroke='black'>
                                    </line>
                                    {text.slice(suffixTree[v.index].edgeStart, suffixTree[v.index].edgeEnd + 1).split('').map((c, idx) => (
                                        <text key={`node-${i}-child-${c}-${idx}`}
                                        x={(nodeChildrenDimentions[key].x1 + nodeChildrenDimentions[key].x2 + CONVERTED_GAP) / 2 + (idx * CHARDIST * Math.cos(nodeChildrenDimentions[key].angle * RAD_TO_DEG))}
                                        y={(nodeChildrenDimentions[key].y1 + nodeChildrenDimentions[key].y2 - CONVERTED_GAP) / 2 + (idx * CHARDIST * Math.sin(nodeChildrenDimentions[key].angle * RAD_TO_DEG))}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        style={{fontSize:'1.2em'}}
                                        className={v.currChar === idx ? v.className : ''}
                                        >
                                            <tspan className='fw-700'>{c}</tspan>
                                        </text>
                                    ))}
                                </svg>
                            <NodeTest node={suffixTree[v.index]} adjustedHeight={adjH}
                                        ref={(elem) => {
                                            const map = getMap();
                                            if (elem){
                                                map.set(key, elem.getBoundingClientRect())
                                            }else{
                                                map.delete(elem)
                                            };
                                        }}/>
                        </div>
                    })
                })()}
            </div>
        </div>
    );
});

export default NodeTest