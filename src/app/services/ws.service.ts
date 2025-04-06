import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsService {
    
    constructor(private socket: Socket) {
        this.socket.on('connect', ()=>{
            console.log("websocket connected");
        })
    }

    // ✅ Send a message to the WebSocket server
    sendMessage(event: string, data: any) {
        this.socket.emit(event, data);
    }

    // ✅ Listen for messages from the WebSocket server
    listen(event: string): Observable<any> {
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