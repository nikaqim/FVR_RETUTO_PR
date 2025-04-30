import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { IBtnGroupConfig } from '../components/shared/btn-group/btn-group-config.model';
import { CyranoTutorialConfig } from '../model/cyrano-walkthrough-cfg.model';

@Injectable({ providedIn: 'root' })
export class WsService {
    
    constructor(private socket: Socket) {
        this.socket.on('connect', ()=>{
        })
    }


    // ✅ Listen for messages from the WebSocket server
    listenBtnUpdate(event: string): Observable<IBtnGroupConfig> {
        return this.socket.fromEvent(event);
    }

    // ✅ Listen for messages from the WebSocket server
    listenWalkUpdate(event: string): Observable<CyranoTutorialConfig> {
        return this.socket.fromEvent(event);
    }

    // ✅ Disconnect from WebSocket
    disconnect() {
        this.socket.disconnect();
    }

    // ✅ Reconnect to WebSocket
    reconnect() {
        this.socket.connect();
    }

}