import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonGroup } from '../components/shared/btn-group/btn-group.model';
import { BtnGroupConfig } from '../components/shared/btn-group/btn-group-config.model';

@Injectable({
    providedIn: 'root',
  })
  export class BtnGroupService {
    buttonIds:string[] = [];

    private btnConfigSubject = new BehaviorSubject<BtnGroupConfig>({
      btngroup: []
    });

    private btnGroupReadySubject = new BehaviorSubject<string>("");
  
    constructor(private httpClient: HttpClient) {
      this.loadButtonConfig()
    }
  
    getButtonConfig(): Observable<BtnGroupConfig> {
        return this.httpClient.get<BtnGroupConfig>('/assets/config/btn-group.json');
    }

    loadButtonConfig(): void{
      this.getButtonConfig().subscribe((data:BtnGroupConfig) => {
        this.btnConfigSubject.next(data);
        if(data["btngroup"]){
        }
        
      })
    }

    updateConfig(newConfig:BtnGroupConfig): void{
      this.btnConfigSubject.next(newConfig);
    }

    notifyButtonGrpReady(btnIds:string): void{
      this.btnGroupReadySubject.next(btnIds);
    }

    onNotifyButtonReady(): Observable<string>{
      return this.btnGroupReadySubject.asObservable();
    }

    getGroupBtnIds(grp:ButtonGroup): string[]{
      let ids:string[]= []
      grp.buttons.forEach(btn => {
        ids.push(btn.id)
      });

      return ids;
    }

    getScreenContainerId(elementId:string): string{
      const child = document.getElementById(elementId.replace('#',''));
      const screenContainer = child?.closest('.screen-container');
      const screenId = (screenContainer as HTMLElement).id;

      return screenId;
    }
  
  }