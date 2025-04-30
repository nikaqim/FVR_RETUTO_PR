import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ButtonGroup } from '../components/shared/btn-group/btn-group.model';
import { IBtnGroupConfig } from '../components/shared/btn-group/btn-group-config.model';

@Injectable({
    providedIn: 'root',
  })
  export class BtnGroupService {
    buttonIds:string[] = [];

    private btnConfigSubject = new BehaviorSubject<IBtnGroupConfig>({
      btngroup: []
    });

    private btnGroupReadySubject = new BehaviorSubject<string>("");
  
    constructor(private httpClient: HttpClient) {
      this.loadButtonConfig()
    }
  
    public getButtonConfig(): Observable<IBtnGroupConfig> {
        return this.httpClient.get<IBtnGroupConfig>('/assets/config/btn-group.json');
    }

    private loadButtonConfig(): void{
      this.getButtonConfig()
      .pipe(take(1))
      .subscribe((data:IBtnGroupConfig) => {
        this.btnConfigSubject.next(data);
      })
    }

    private updateConfig(newConfig:IBtnGroupConfig): void{
      this.btnConfigSubject.next(newConfig);
    }

    public notifyButtonGrpReady(btnIds:string): void{
      this.btnGroupReadySubject.next(btnIds);
    }

    public onNotifyButtonReady(): Observable<string>{
      return this.btnGroupReadySubject.asObservable();
    }

    private getGroupBtnIds(grp:ButtonGroup): string[]{
      let ids:string[]= []
      grp.buttons.forEach(btn => {
        ids.push(btn.id)
      });

      return ids;
    }

    public getScreenContainerId(elementId:string): string{
      console.log("elementId:",elementId )
      const child = document.getElementById(elementId.replace('#',''));
      const screenContainer = child?.closest('.screen-container');
      const screenId = (screenContainer as HTMLElement).id;

      return screenId;
    }
  
  }