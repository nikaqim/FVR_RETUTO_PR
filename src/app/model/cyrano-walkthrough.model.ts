import { WalkDescr } from "./cyrano-walkthrough-screenmap.model";
export class CyranoTutorial {
    id: string;
    label:string;
    prevStepId: string;
    nextStepId: string;
    focusElementId: string;
    contentAlign: string;
    contentVertAlign: string;
    showArrow: boolean = true;
    focusBackdrop: boolean = false;
    closeAnywhere: boolean = false;
    showFinishBtn: boolean = false;
    descr: WalkDescr[];
    
    constructor(
        id: string = '',
        label: string = '',
        prevStepId: string = '',
        nextStepId: string = '',
        focusElementId: string = '',
        descr:WalkDescr[] = [],
        showArrow:boolean = true,
        showFinishBtn:boolean = false,
    ){
        this.id = id;
        this.label = label
        this.prevStepId = prevStepId;
        this.nextStepId = nextStepId;
        this.focusElementId = focusElementId;
        this.contentAlign = "center";
        this.contentVertAlign = "below";
        this.showArrow = showArrow;
        this.showFinishBtn = showFinishBtn
        this.closeAnywhere = false;

        this.descr = descr;
    }
}