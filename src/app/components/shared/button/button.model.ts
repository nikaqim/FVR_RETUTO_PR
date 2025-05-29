export interface ButtonOffset {
  x: number;
  y: number;
}

export class Button {
    id: string = "";
    maticon: string = "";
    icon: string = ""; // material icon
    label: string= ""; // i18n will be enabled if title is same with app.button
    size: string= ""; // xs, sm, md, lg, xl
    action: string = "";
    main:boolean = false;
    title: string= "";
    visible: boolean = true;
    offset: ButtonOffset = {
        x:0,
        y:0
    };
    progress: boolean = false;

    constructor(id: string = "", icon: string = "", label: string = "", size:string = "", action: string = "", visible:boolean = false) {
        this.id = id;
        this.icon = icon;
        this.label = label;
        this.size = size;
        this.action = action;
        this.visible = visible;
    }

    assign(jsonObj: object){
        Object.assign(this, jsonObj);
    }

    get isVisible(){
        console.log("this.isVisible:",this.isVisible);
        return this.visible;
    }

    get url(){
        return this.icon;
    }

}