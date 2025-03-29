import { Button } from "../button/button.model";

export interface mainAssigned {
    [key:string] : string
}
export class ButtonGroup {
    id: string;
    layout: string;
    buttons: Button[];
    visible: boolean = true;

    constructor(id: string, layout: string, buttons: Button[], visible:boolean) {
        this.id = id;
        this.layout = layout;
        this.buttons = buttons;
        this.visible = visible;
    }

    assign(jsonObj: object){
        Object.assign(this, jsonObj);
    }

    get isVisible(){
        return this.visible;
    }

    get isTypeVertical() {
        return this.layout === 'vert';
    }

}