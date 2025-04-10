import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { IBtnGroupConfig } from '../components/shared/btn-group/btn-group-config.model';

@Injectable({ providedIn: 'root' })
export class WsService {
    
    constructor(private socket: Socket) {
        this.socket.on('connect', ()=>{
            console.log("websocket connected");
        })
    }


    // ✅ Listen for messages from the WebSocket server
    listen(event: string): Observable<IBtnGroupConfig> {
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