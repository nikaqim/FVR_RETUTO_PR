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
                dropShadow: true
            });

            line.setOptions

            let lineEl = document.querySelector('.leader-line:not([class*="linecontainer"])') as HTMLElement;

            if(container && lineEl){
                lineEl?.classList.add(`linecontainer-${arrowId}`);
                container.appendChild(lineEl);

                const LinePos = lineEl.getBoundingClientRect();
                const FromPos = fromElement.getBoundingClientRect();

                lineEl.style.left = window.innerWidth > 550 ?
                    (FromPos.width +(16))+ 'px' : lineEl.style.left;
            }
            
            document.querySelector('.leader-line:not([class*="linecontainer"])')?.remove();

            this.lines.set(arrowId,line);
        }

    }

    // ✅ Remove an arrow by ID
    removeArrow(arrowId: string) {
        if (this.lines.has(arrowId)) {
            // this.lines.get(arrowId)?.remove();
            this.lines.delete(arrowId);
        }

    }

    removeAll(){
        // Array.from(this.lines.keys())
        //     .forEach(el => {
        //         this.lines.get(el)?.hide();
        //         this.lines.get(el)?.remove();
        // });

        this.lines.clear();
    }

    // ✅ Redraw all arrows (e.g., when resizing window)
    updateArrows() {
        this.lines.forEach(line => line.position());
    }
}