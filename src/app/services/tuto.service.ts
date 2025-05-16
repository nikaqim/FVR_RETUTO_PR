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
  private tutorNavigateSubject = new Subject<string>();
  private startTutoSubject = new BehaviorSubject<string>("");
  private swiperNavSubject = new BehaviorSubject<string>("");
  private swiperSlideSubject = new Subject<boolean>();
  private drawArrowSubject = new Subject<boolean>();
  private swiperTriggerSlideSubject = new Subject<boolean>();
  private swiperMoveSubject = new Subject<number>();
  private closeTutoSubject = new BehaviorSubject<boolean>(false);


  private walkConfigSubject = new BehaviorSubject<CyranoTutorialConfig>({});

  private walkthroughTextSubject = new BehaviorSubject<CyranoTutorialConfig>({
  });

  private steps:CyranoTutorial[] = [];
  private descrList: WalkDescrMap = {};
  private step2screen: WalkStepMap = {};
  private restartTabulatedIds: boolean = false;
  private walkthroughLoaded:boolean = false;
  private walkthroughIsActive: boolean = false;
  
  private walkconfig: CyranoTutorialConfig = {};
  private tabulatedId:string[] = [];
  private activeId:string = '';
  private onSwipe:boolean = false;

  constructor(
    private httpClient:HttpClient,
    private localStorage:LocalStorageService) {
      if(!this.walkthroughLoaded){
        this.walkthroughLoaded = true;
      }

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

  public isActive() : boolean {
    return this.walkthroughIsActive;
  }

  public setWalkStatus(status:boolean): void {
    this.walkthroughIsActive = status;
  }

  /**
   * Loading Walkthrough Configuration Object
   */
  private loadWalkthrough(): void{
    let walkthruInStorage = this.localStorage.getData(StorageId.WalkConfig);
    
    let walkthruInStorageObj = (walkthruInStorage !== undefined) && ((walkthruInStorage !== '') )? 
      typeof walkthruInStorage === 'string' ? JSON.parse(walkthruInStorage) : walkthruInStorage : {};

    this.walkthroughIsActive = true;

    this.getWalkhroughData().subscribe((data:CyranoTutorialConfig) => {

      let needReload = !this.isStorageConfigValid(data, walkthruInStorageObj);
    
      if(needReload){
        this.steps = this.tabulateStep(data);
        this.descrList = this.tabulateDescr(this.steps);
        this.walkconfig = data;

        this.localStorage.setData(
          StorageId.WalkConfig, 
          JSON.stringify(this.steps)
        )

        this.walkConfigSubject.next(data);
      } else {
        this.steps = this.tabulateStep(walkthruInStorageObj)
        this.descrList = this.tabulateDescr(this.steps);
        this.walkconfig = walkthruInStorageObj;
        this.walkConfigSubject.next(walkthruInStorageObj);
      }
    });
  
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

  public  reverseMarkUp(descr:string): string{
    return descr.replace(/<b>\s*(.*?)\s*<\/b>/g, '## $1 ##');
  }

  private resetWalkthrough(): void {
    this.localStorage.setData(StorageId.WalkConfig, '');
  }

  public onFinishLoadWalkThru(): Observable<CyranoTutorialConfig>{
    return this.walkConfigSubject.asObservable();
  }

  public notifyTutoNavigation(nextId:CyranoTutorial): void {
    this.tutorNavigateSubject.next(nextId.focusElementSelector);
    this.swiperNavSubject.next(this.getScreenById(nextId.id));
  }

  public setDrawArrowSubject(status:boolean){
    this.drawArrowSubject.next(status);
  }

  public onDrawArrowSubject(): Observable<boolean>{
    return this.drawArrowSubject.asObservable()
  }

  public isSwping():boolean{
    return this.onSwipe;
  }

  public setSwiping(status:boolean){
    this.onSwipe = status;
  }

  public swiperIsOnSlide(status:boolean){
    this.swiperSlideSubject.next(status);
  }  

  public isSwiperIsOnSlide(): Observable<boolean>{
    return this.swiperSlideSubject.asObservable();
  }

  public triggerSwiper(next: boolean){
    this.swiperTriggerSlideSubject.next(next);
  }

  public isOnTriggerSwiper(): Observable<boolean>{
    return this.swiperTriggerSlideSubject.asObservable()
  }

  public moveToSlide(idx:number){
    this.swiperMoveSubject.next(idx)
  }

  public onMoveToSlide(){
    return this.swiperMoveSubject.asObservable();
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
  
  getStepIdxFromId(id:string){
    let idx = 0
    idx = this.steps.findIndex(item => item.id === id);
    
    return idx
  }

  public getCurrentStep(): CyranoTutorial | null {
    return this.getStepById(this.activeId);
  }

  public getNextStep(): CyranoTutorial | null {
    let dWalk = null;
    let returnNext = false;

    for(const stepData of this.steps){

      // return next step
      if(returnNext){
        dWalk = JSON.parse(JSON.stringify(stepData));
        break;
      }

      // founc current active step
      if(stepData.id === this.activeId){
        returnNext = true;
      }
    }

    return dWalk;
  }

  public getPrevStep(): CyranoTutorial | null {
    let dWalk = null;
    let returnPrev = false;

    for(let i=this.steps.length-1; i >= 0; i--){

      // return next step
      if(returnPrev){
        dWalk = JSON.parse(JSON.stringify(this.steps[i]));
        break;
      }

      // founc current active step
      if(this.steps[i].id === this.activeId){
        returnPrev = true;
      }
    }

    return dWalk;
  }

  public resetTabulatedId(): void {
    this.restartTabulatedIds = true;
  }

  private isStorageConfigValid(confData:CyranoTutorialConfig, inLocalStorage:CyranoTutorialConfig): boolean {

    if(Object.keys(confData).length !== Object.keys(inLocalStorage).length){
      return false;
    } else {
      for(let i=0; i < Object.keys(confData).length; i++){
        if(Object.keys(confData)[i] !== Object.keys(inLocalStorage)[i]){
          return false;
        }
      }
    }
    
    return true;
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
            step.focusElementSelector = ('#' + screen + step.focusElementId.replace('#','')).toLowerCase();
          
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
          console.log("this.steps:",this.steps);
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


  public getStepById(id:string): CyranoTutorial | null {
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
    if(document.getElementById(elementId)){
      document.getElementById(elementId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
    
  }
  
}
