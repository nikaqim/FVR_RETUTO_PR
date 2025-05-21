import { Injectable } from '@angular/core';

// declare const LeaderLine:LeaderLine;

@Injectable({ providedIn: 'root' })
export class ArrowService {
    private lines: Map<string, LeaderLine> = new Map(); // ✅ Store multiple arrows

    constructor() {}

    // ✅ Function to draw an arrow between two elements by ID
    async drawArrow(fromId: string, toId: string, containerId:string = '', arrowId: string = 'defaultArrow') {
        const fromElement = document.getElementById(fromId);
        const toElement = document.getElementById(toId);
        const container = containerId !== '' ? document.getElementById(containerId) : null;

        if (!fromElement || !toElement) {
            if(!fromElement){
                console.warn(`from element not found ${fromId}`);
            } 

            if(!toElement){
                console.warn(`to element not found ${toId}`);
            }

            return;
        }

        if((!this.lines.has(arrowId))){
            // ✅ Draw the new arrow
            const line = new (LeaderLine as any)(fromElement, toElement, {
                path: 'fluid', // ✅ Curved path like `ng-walkthrough`
                startPlug: 'behind',
                endPlug: 'arrow2',
                color: '#ffffff',
                size: 1,
                startSocket: 'right', 
                endSocket: 'left',
                startPlugColor: '#ffffff',
                endPlugColor: '#ffffff',
                startPlugSize: 1,
                endPlugSize: 2,
                dropShadow: {
                    dx: 0, 
                    dy: 0,
                    blur: 0
                }
            });

            line.setOptions

            let lineEl = document.querySelector('.leader-line:not([class*="linecontainer"])') as HTMLElement;

            if(container && lineEl){

                lineEl?.classList.add(`linecontainer-${arrowId}`);
                container.appendChild(lineEl);

                const containerPos = container.getBoundingClientRect(); 

                const LinePos = lineEl.getBoundingClientRect();
                const FromPos = fromElement.getBoundingClientRect();
                const ToPos = toElement.getBoundingClientRect();

                lineEl.style.top = (window.innerHeight > 720) && (window.innerWidth > 790) ? 
                    (parseInt(lineEl.style.top.replace('px','')) - 60) + "px" : lineEl.style.top;

                lineEl.style.left = window.innerWidth > 720 ?
                    (FromPos.width + 20) + 'px' : lineEl.style.left;
            }
            
            document.querySelector('.leader-line:not([class*="linecontainer"])')?.remove();

            this.lines.set(arrowId,line);
        }

    }

    // check if arrow with ID already existing
    isExist(arrowId: string): boolean {
        return this.lines.has(arrowId);
    }

    // ✅ Remove an arrow by ID
    removeArrow(arrowId: string) {
        if (this.lines.has(arrowId)) {
            // this.lines.get(arrowId)?.remove();
            this.lines.delete(arrowId);
        }

    }

    removeAll(){
        Array.from(this.lines.keys())
            .forEach(el => {
                let element = document.querySelector(`.linecontainer-${el}`);
                if(element){
                    element.remove();
                }
        });

        this.lines.clear();
    }

    // ✅ Redraw all arrows (e.g., when resizing window)
    updateArrows() {
        this.lines.forEach(line => line.position());
    }

}