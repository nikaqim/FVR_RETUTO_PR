import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { StorageId } from '../enums/localstorageData.enum';

import { CyranoTutorial } from '../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../model/cyrano-walkthrough-cfg.model';
import { WalkStepMap, WalkDescrMap, WalkDescr } from '../model/cyrano-walkthrough-screenmap.model';

import { WalkthroughComponent } from 'angular-walkthrough';

@Injectable({
  providedIn: 'root'
}) export class WalkthroughConfigService {

  private walkthroughs = new Map<string, WalkthroughComponent>();
  private tutorNavigateSubject = new BehaviorSubject<string>("");
  private startTutoSubject = new BehaviorSubject<string>("");
  private swiperNavSubject = new BehaviorSubject<string>("");
  private closeTutoSubject = new BehaviorSubject<boolean>(false);

  private walkConfigSubject = new BehaviorSubject<CyranoTutorialConfig>({});

  private walkthroughTextSubject = new BehaviorSubject<CyranoTutorialConfig>({
  });

  steps:CyranoTutorial[] = [];
  descrList: WalkDescrMap = {};
  step2screen: WalkStepMap = {};
  restartTabulatedIds: boolean = false;
  
  walkconfig: CyranoTutorialConfig = {};
  tabulatedId:string[] = [];
  activeId:string = '';

  constructor(
    private httpClient:HttpClient,
    private localStorage:LocalStorageService) {
      this.loadWalkthrough();
  }

  public register(id:string, walkthrough:WalkthroughComponent): void{
    this.walkthroughs.set(id,walkthrough);
  }

  public unregister(id:string): void{
    this.walkthroughs.delete(id);
  }

  getWalkhroughData(): Observable<CyranoTutorialConfig> {
    return this.httpClient.get<CyranoTutorialConfig>('/assets/config/walkthrough.json');
  }

  /**
   * Loading Walkthrough Configuration Object
   */
  private loadWalkthrough(): void{
    let walkthruInStorage = this.localStorage.getData(StorageId.WalkConfig);
    let isInStorage = (typeof walkthruInStorage === 'string' && walkthruInStorage !== '') || 
      (typeof walkthruInStorage === 'object' && Object.keys(JSON.parse(walkthruInStorage)).length > 0);

    if(!isInStorage){
      console.log("not isinstorage");
      
      this.getWalkhroughData().subscribe((data:CyranoTutorialConfig) => {
        this.steps = this.tabulateStep(data);
        this.descrList = this.tabulateDescr(this.steps);
        this.walkconfig = data;
        this.walkConfigSubject.next(data);
      });
    } else {
      console.log("isinstorage");

      this.steps = this.tabulateStep(JSON.parse(walkthruInStorage))
      this.descrList = this.tabulateDescr(this.steps);
      this.walkconfig = JSON.parse(walkthruInStorage);
      this.walkConfigSubject.next(JSON.parse(walkthruInStorage));
    }
  }

  public getConfig(): CyranoTutorialConfig{
    return this.walkconfig;
  }

  private implementArrMarkup(descr:WalkDescr[]): WalkDescr[]{
    const rtnMarkups:WalkDescr[] = [];

    descr.forEach(data => {
      data.text = data.text.replace(/##\s*(.*?)\s*##/g, '<b>$1</b>');
      rtnMarkups.push(data);
    });

    return rtnMarkups;
  }

  private implementMarkUp(descr:string): string{
    return descr.replace(/##\s*(.*?)\s*##/g, '<b>$1</b>');
  }

  private reverseArrMarkup(descr:WalkDescr[]): WalkDescr[]{
    let rtnMarkups:WalkDescr[] = [];

    descr.forEach(data => {
      data.text = data.text.replace(/<b>\s*(.*?)\s*<\/b>/g, '## $1 ##');
      rtnMarkups.push(data);
    });

    return rtnMarkups;
  }

  private reverseMarkUp(descr:string): string{
    return descr.replace(/<b>\s*(.*?)\s*<\/b>/g, '## $1 ##');
  }

  private resetWalkthrough(): void {
    this.localStorage.setData(StorageId.WalkConfig, '');
  }

  public onFinishLoadWalkThru(): Observable<CyranoTutorialConfig>{
    return this.walkConfigSubject.asObservable();
  }

  public notifyTutoNavigation(nextId:WalkthroughComponent): void {

    this.tutorNavigateSubject.next(nextId.focusElementSelector);
    this.swiperNavSubject.next(this.getScreenById(nextId.id));
  }

  public activateSwipeNav(id:string): void {
    this.swiperNavSubject.next(this.getScreenById(id));
  }

  public onTutoNavigation(): Observable<string>{
    return this.tutorNavigateSubject.asObservable();
  }

  public closeTuto(): void{
    this.closeTutoSubject.next(true);
  }

  public onTutoClose(): Observable<boolean>{
    return this.closeTutoSubject.asObservable();
  }

  public onSwiperChanged(): Observable<string>{
    return this.swiperNavSubject.asObservable();
  }

  public startTuto(id:string): void {
    this.startTutoSubject.next(id);
  }

  public onStartTuto(): Observable<string>{
    return this.startTutoSubject.asObservable();
  }

  public setActiveId(id:string): void{
    this.activeId = id;
  }

  public getActiveId():string {
    return this.activeId;
  }

  public getById(id: string): WalkthroughComponent | undefined {
    return this.walkthroughs.get(id);
  }

  public openWalk(id:string): void{
    this.walkthroughs.get(id)?.open();
  }

  public getSteps(): CyranoTutorial[]{
    return this.steps;
  }

  public resetTabulatedId(): void {
    this.restartTabulatedIds = true;
  }


  public tabulateStep(confData:CyranoTutorialConfig): CyranoTutorial[]{
    if(this.restartTabulatedIds){
      this.tabulatedId = [];
      this.steps = [];
      this.restartTabulatedIds = false;
    }

    // create duplicate of data
    this.walkconfig = typeof confData === 'string' ? JSON.parse(confData) : 
    JSON.parse(JSON.stringify(confData));

    // save to local storage for testing
    this.localStorage.setData(
      StorageId.WalkConfig, JSON.stringify(this.walkconfig)
    );

    // tabulate different tutorial screen into 1
    Object.keys(this.walkconfig).forEach(screen => {

      if(this.walkconfig[screen].length){
        this.walkconfig[screen].forEach(step => {
          if(!this.tabulatedId.includes(step.id)){
            // ensure no duplicated step
            this.tabulatedId.push(step.id);
            
            step.descr = this.implementArrMarkup(step.descr);
          
            // store all step info
            this.steps.push(step);
            
            // screen screen id for each step
            if(!this.step2screen[step.id]){
              this.step2screen[step.id] = screen;
            }
          }
        });
      }
    });

    return this.steps; 
  }

  private tabulateDescr(steps:CyranoTutorial[]): WalkDescrMap{
    let alldescr:WalkDescrMap = {}; 
    steps.forEach((step, idx) =>{
      step.descr.forEach((descr,idx)=>{
        alldescr[step.id + '_' + idx] = descr.text;
      })
      
    });

    return alldescr;
  }

  public getAllDescr(): WalkDescrMap{
    return this.descrList;
  }

  public updateText(id:string, text:string): void {
    // get walkthrough id screen
    let stepId = id.split('_')[0];
    let descrIdx = parseInt(id.split('_')[1]);
    let screen = this.getScreenById(stepId);


    if(id && screen){
      for(let [index, el] of this.walkconfig[screen].entries()){
        if(el.id === stepId){
          // update text
          el.descr[descrIdx].text = text;
          this.restartTabulatedIds = true;
          
          this.steps = this.tabulateStep(this.walkconfig);
          this.notifyTextChange(this.walkconfig);

          break;
        }
      }; 
    }

  }

  public notifyTextChange(updatedData: CyranoTutorialConfig): void{
    this.descrList = this.tabulateDescr(this.steps);

    this.walkthroughTextSubject.next(updatedData);
  }

  public onNotifyTextChange(): Observable<CyranoTutorialConfig>{
    return this.walkthroughTextSubject.asObservable();
  }


  public getStepById(id:string): Object | null {
    let dWalk = null;
    
    for(const stepData of this.steps){
      if(stepData.id === id){
        dWalk = JSON.parse(JSON.stringify(stepData));
        break;
      }
    }

    return dWalk;
  }

  public getScreens(): string[] {
    return Object.keys(this.walkconfig);
  }

  public getScreenById(id:string): string {
    return this.step2screen[id];
  }

  public scrollIntoView(elementId:string): void {
    const parentEl = document.getElementById(elementId);
      if(parentEl){
        parentEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
  }
  
}
