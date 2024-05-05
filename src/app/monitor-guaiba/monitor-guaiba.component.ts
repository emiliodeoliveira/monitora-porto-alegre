  import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
  import { ILoadedEventArgs, ChartTheme, ChartAllModule } from '@syncfusion/ej2-angular-charts';
  import { Browser } from '@syncfusion/ej2-base';
  import { SBDescriptionComponent } from '../common/dp.pomponent';
  import { SBActionDescriptionComponent } from '../common/adp.component';
  import { SaladesituacaoServiceService } from '../saladesituacao-service.service';
  import { GuaibaInfo } from '../models/guaiba-info';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-monitor-guaiba',
    standalone: true,
    templateUrl: './monitor-guaiba.component.html',
    styleUrl: './monitor-guaiba.component.css',
    providers: [SaladesituacaoServiceService],
    imports: [SBActionDescriptionComponent, ChartAllModule, SBDescriptionComponent, FormsModule, CommonModule]
  })
  export class MonitorGuaibaComponent implements OnInit{

    private riverDataService = inject(SaladesituacaoServiceService)

    public guaibaRiverData: GuaibaInfo[] = [];
    public dateValue = new Date();
    
    
    public lastRiverDate: Date = new Date()
    public lastRiverValue: number = 0

    public primaryXAxis: Object = {
      valueType: 'DateTime',
      textStyle: { 
        fontFamily: 'Segoe UI'
      },
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 },
      labelFormat: 'd/M/y HH:mm'
  };

  public primaryYAxis: Object = {
      title: 'Metros',
      minimum: 0,
      maximum: 10,
      interval: 1,
      lineStyle: { width: 0 },
      textStyle: { 
        fontFamily: 'Segoe UI'
      }, 
      majorTickLines: { width: 0 }
      
  };
  public chartArea: Object = {
      border: {
          width: 0
      }
  };
  public width: string = Browser.isDevice ? '100%' : '75%';
  public circleMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Circle' , isFilled: true };
  public triangleMarker: Object = { visible: true, height: 6, width: 6 , shape: 'Triangle' , isFilled: true };
  public diamondMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Diamond' , isFilled: true };
  public rectangleMarker: Object = { visible: true, height: 5, width: 5 , shape: 'Rectangle' , isFilled: true };
  public pentagonMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Pentagon' , isFilled: true };

  public tooltip: Object = {
      enable: true
  };
  public legend: Object = {
      visible: true,
      enableHighlight : true,
      textStyle: { 
        fontFamily: 'Segoe UI'
      }, 
  }

  public load(args: ILoadedEventArgs): void {
      let selectedTheme: string = location.hash.split('/')[1];
      selectedTheme = selectedTheme ? selectedTheme : 'Material';
      args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast');
  };

  public title: string = 'Nivel Guaiba';

  constructor(private saladesituacaoServiceService: SaladesituacaoServiceService) {};

  parseData(jsonData: any){
    this.dateValue.setDate(this.dateValue.getDate() - 7)
    for (const k in jsonData){
      const date = new Date(jsonData[k].date)
      if (date >= this.dateValue){
        const data = new GuaibaInfo(date,
        jsonData[k].precipitation,
        jsonData[k].river_flow_rate,
        (jsonData[k].river_level/100),
        jsonData[k].station_id)
        this.guaibaRiverData.push(data)
      }
    }
  }

  ngOnInit(){
    this.riverDataService.guaibaData().subscribe(
      data => {
        this.parseData(data)
        this.getLastValues()    
      })
    }

    getLastValues() {
      const index = this.guaibaRiverData.length
      this.lastRiverDate = this.guaibaRiverData[index-1].getLastDate()
      this.lastRiverValue = this.guaibaRiverData[index-1].getRiverLevel()
    }
  }