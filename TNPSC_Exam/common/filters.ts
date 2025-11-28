import { TNPSCGroupFilterType, TNPSCStageFilterType } from '../../types';

export const TNPSC_GROUP_FILTERS: {id: TNPSCGroupFilterType, label: string}[] = [
    {id:'Group I', label:'Group I'}, 
    {id:'Group II', label:'Group II'}, 
    {id:'Group IV', label:'Group IV'}
];

export const TNPSC_STAGE_FILTERS: {id: TNPSCStageFilterType, label: string}[] = [
    {id:'PYQ', label:'PYQ'}, 
    {id:'Prelims', label:'Prelims'}, 
    {id:'Mains', label:'Mains'}, 
    {id:'Full Mock Test', label:'Full Mock Test'}, 
    {id:'Upload Files', label:'Upload Files'}
];
