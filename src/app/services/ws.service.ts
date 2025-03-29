import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WsService {
    // private socket!: Socket;
    // private readonly socketUrl = 'http://localhost:3000'; // ✅ Update URL
    // private socket = io(this.socketUrl, { });

    constructor(private socket: Socket) {
        // this.connectWs();
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

//     private connectWs() {
//         console.log('🛠 Connecting to WebSocket...');
//         // this.socket = io(this.socketUrl, {}); // ✅ Uses socket.io

//         this.socket.on('connect', () => console.log('✅ WebSocket connected!'));
//         this.socket.on('disconnect', () => console.warn('⚠️ WebSocket disconnected.'));
//         this.socket.on('message', (data) => console.log('📩 Received:', data));
//     }

//     // ✅ Function to listen for WebSocket events dynamically
//     listen(eventName: string): Observable<any> {
//         return new Observable((observer:any) => {
//             this.socket.on(eventName, (data) => {
//                 console.log(`📩 Event [${eventName}] received:`, data);
//                 observer.next(data);
//             });

//             return () => this.socket.off(eventName); // ✅ Cleanup when unsubscribed
//         });
//     }

//     sendMessage(event: string, message: any) {
//         this.socket.emit(event, message);
//     }

//     disconnect() {
//         this.socket.disconnect();
//     }
}