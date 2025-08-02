import _ from 'lodash';

export function openInterval(from:number, to:number):number[] {
    let delta:number = (from < to) ? 1 : -1;
    return Array.from({length: Math.abs(to-from)-1}, (_,i) => from + (delta * (i+1)));
}

export function closedInterval(from:number, to:number):number[] {
    let delta:number = (from < to) ? 1 : -1;
    return Array.from({length: Math.abs(to-from)+1}, (_,i) => from + (delta * i));
}

export function startExclusiveInterval(from:number, to:number):number[] {
    let delta:number = (from < to) ? 1 : -1;
    return Array.from({length: Math.abs(to-from)}, (_,i) => from + (delta * (i+1)));
}

export function xor(a:boolean, b:boolean):boolean {
    return (a || b) && !(a && b);
}

export function isEqual(a:object, b:object):boolean {
    return _.isEqual(a,b);
}