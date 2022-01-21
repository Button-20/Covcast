import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/theme/shared/user.service.js';
import { MembersService } from 'src/app/theme/shared/members.service.js';
import { DuesService } from 'src/app/theme/shared/dues.service.js';
import { AttendanceService } from 'src/app/theme/shared/attendance.service.js';
import { DuesTotal } from 'src/app/theme/shared/duesTotal.model.js';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import { PaymentService } from 'src/app/theme/shared/payment.service';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  classnames = [];
  value = [];
  Admin: any;
  malesPercent = 0;
  femalesPercent = 0;
  dailySum = 0;
  monthlySum = 0;
  yearlySum = 0;
  dailyPercent = 0;
  monthlyPercent = 0;
  yearlyPercent = 0;
  dailyBar = '0%';
  monthlyBar = '0%';
  yearlyBar = '0%';
  normalTemp = 0;
  abnormalTemp = 0;



  constructor(public userService: UserService, public memberService: MembersService, public duesService: DuesService, public attendanceService: AttendanceService, public paymentService: PaymentService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startProcedures();
    this.Admin = this.userService.getUserPayload();
    setTimeout(() => {
      if (this.Admin.classname !== 'Admin') {
        const data = {
          labels: ['Normal Temp. (35.5°C - 37.9°C)', 'Abnormal Temp. (38°C - ∞)'],
          datasets: [{
            label: 'Attendance Temp. Chart',
            data: [this.normalTemp, this.abnormalTemp],
            backgroundColor: ['#44075e', 'red'],
            hoverOffset: 4
          }]
        };
  
        var covidPieChart = new Chart('myCovidChart', {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
        });
      } else {
        const dataType = {
          labels: this.classnames,
          datasets: [{
            label: 'Members of Groups',
            data: this.value,
            backgroundColor: this.generateRandomColors(this.classnames.length),
            hoverOffset: 4
          }]
        };
  
        var pieChart = new Chart('myChart', {
          type: 'pie',
          data: dataType,
          options: {
            responsive: true,
            maintainAspectRatio: false,
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
        });
      }

    }, 2500);
  }

  startProcedures(){
    var payLoad = this.userService.getUserPayload();
     if(payLoad && payLoad.classname === 'Admin'){
       this.refreshAllTotalDues();
       this.refreshAllMaleCount();
       this.refreshFemaleList();
       this.refreshAllMembersCount();
       this.refreshAllAttendanceCount();
       this.getMemberofGroupsPieChart();
       this.getDailySummary();
       this.getMonthlySummary();
       this.getYearlySummary();
     }
     else{
       this.refreshTotalDues(payLoad.classname);
       this.refreshMembersCount(payLoad.classname);
       this.refreshMembersMaleList(payLoad.classname);
       this.refreshMembersFemaleList(payLoad.classname);  
       this.refreshAttendanceCount(payLoad.classname);
       this.refreshPresenceCount(payLoad.classname);
       this.refreshAbsenceCount(payLoad.classname);
       this.refreshTemp(payLoad.classname);
     }
   }
 
 
   /////////////////////////////////////////------User-------/////////////////////////////////////////////////////
 
 
    refreshTotalDues(classname: string){
      this.duesService.getTotalDues(classname).subscribe((res: any) => {
        this.duesService.Total = (res.length === 0 ? this.duesService.Total :  res[0].TotalSumOfDues);
      })
    }

    refreshMembersMaleList(classname: string){
      this.memberService.getMembersMaleCount(classname).subscribe((res: any) => {
        this.memberService.maleCount = res;
        this.memberService.getMembersClassname(classname).subscribe((res: any) => {
          this.malesPercent = this.calculatePercent(res.length, this.memberService.maleCount);
          })
      })
    }

    refreshMembersFemaleList(classname: string){
      this.memberService.getMembersFemaleCount(classname).subscribe((res: any) => {
        this.memberService.femaleCount = res;
        this.memberService.getMembersClassname(classname).subscribe((res: any) => {
          this.femalesPercent = this.calculatePercent(res.length, this.memberService.femaleCount);
          })
      })
    }

    refreshMembersCount(classname: string){
      this.memberService.getMembersCount(classname).subscribe((res) => {
        this.memberService.Count = res;
      })
    }

    refreshAttendanceCount(classname: string){
      this.attendanceService.getAttendanceCount(classname).subscribe((res) => {
        this.attendanceService.count = res;
      })
    }

    refreshPresenceCount(classname: string){
      this.attendanceService.getClassnamePresentCount(classname).subscribe((res: any) => {
        this.attendanceService.present = res;
      })
    }

    refreshAbsenceCount(classname: string){
      this.attendanceService.getClassnameAbsentCount(classname).subscribe((res: any) => {
        this.attendanceService.absent = res;
      })
    }
 
    refreshTemp(classname: string){
      this.attendanceService.getAttendanceClassname(classname).subscribe((res: any) => {
        let data = [];
        data = res.map(element => { return element.temperature });
        var temps = this.calculateCovidTemperatures(data);
        this.cdr.markForCheck();
      })
    }
 
   /////////////////////////////////////////------Admin-------/////////////////////////////////////////////////////

    refreshAllTotalDues(){
      this.duesService.getAllTotalDues().subscribe((res: any) => {
        this.duesService.Total = (res.length === 0 ? this.duesService.Total :  res[0].TotalSumOfDues);
      })
    }

    refreshAllMaleCount(){
      this.memberService.getAllMaleCount().subscribe((res) => {
        this.memberService.maleCount = res;
        this.memberService.getAllMembersCount().subscribe((res: any) => {
          this.malesPercent = this.calculatePercent(res, this.memberService.maleCount);
        })
      })
    }

    refreshFemaleList(){
      this.memberService.getAllFemaleCount().subscribe((res) => {
        this.memberService.femaleCount = res;
        this.memberService.getAllMembersCount().subscribe((res: any) => {
          this.femalesPercent = this.calculatePercent(res, this.memberService.femaleCount);
          })
      })
    }

    refreshAllMembersCount(){
    this.memberService.getAllMembersCount().subscribe((res) => {
      this.memberService.Count = res;
    })
    }

    refreshAllAttendanceCount(){
    this.attendanceService.getAllAttendanceCount().subscribe((res) => {
      this.attendanceService.count = res;
    })
    }

    getMemberofGroupsPieChart(){
      this.userService.getUserList().subscribe(async (res: any) => {
        let data = [];
        data = await res.map(element => { return element.classname });
        let filteredData = await data.filter((c, index) => { return data.indexOf(c) === index && c !== 'Admin'});
        
        filteredData.forEach(async cn => {
          this.memberService.getMembersCount(cn).subscribe(async (res: any) => {
          //  console.log(res)
          let group = {
            classname: await cn,
            numberofmembers: await res
          }
          this.classnames.push(group.classname);
          this.value.push(group.numberofmembers);
        })  
      })
      this.cdr.markForCheck();

      })
    }

    getDailySummary(){
      this.paymentService.getDailySummary().subscribe(async (res: any) => {
        let total = (res[0]?.amount === undefined ? 0 : res[0].amount)
        this.dailySum = (this.calculateDailyAverage(total));
        this.dailyPercent = this.calculatePercent(total, this.dailySum);
        this.dailyBar = this.dailyPercent.toString() + '%';
      })
    }
    
    getMonthlySummary(){
      this.paymentService.getMonthlySummary().subscribe(async (res: any) => {
        let total = (res[0]?.amount === undefined ? 0 : res[0].amount)
        this.monthlySum = this.calculateMonthlyAverage(total);
        this.monthlyPercent = this.calculatePercent(total, this.monthlySum);
        this.monthlyBar = this.monthlyPercent.toString() + '%';
      })
    }
    
    getYearlySummary(){
      this.paymentService.getMonthlySummary().subscribe(async (res: any) => {
        let total = (res[0]?.amount === undefined ? 0 : res[0].amount)
        this.userService.getUserList().subscribe((res: any) => {
          let data = [];
          data = res.map(element => { return element.classname });
          let filteredData = data.filter((c, index) => { return data.indexOf(c) === index && c !== 'Admin'});
          this.yearlySum = this.calculateYearlyAverage(total, filteredData);  
          this.yearlyPercent = this.calculatePercent(total, this.yearlySum);  
          this.yearlyBar = this.yearlyPercent.toString() + '%';
          // console.log(this.yearlyBar)
        })
      })
    }    

   /////////////////////////////////////////------Functions-------/////////////////////////////////////////////////////

    generateRandomColors(length){
      var colors = [];
      while (colors.length < length) {
        let rgb = [];
          for(var i = 0; i < 3; i++)
          rgb.push(Math.floor(Math.random() * 255));
          
        colors.push('rgb('+ rgb.join(',') +')');
      }
      return colors;
    }

    calculatePercent(totalMembers, totalEntity){
      let percent: number;
      percent = totalEntity/totalMembers * 100
      return percent;
    }

    calculateDailyAverage(totalSales){
      let dailyAverage: number;
      dailyAverage = totalSales / 7;
      return dailyAverage;
    }

    calculateMonthlyAverage(totalSales){
      let monthlyAverage: number;
      monthlyAverage = totalSales / 12;
      return monthlyAverage;
    }

    calculateYearlyAverage(totalSales, filteredData){
      let yearlyAverage: number;
      yearlyAverage = totalSales / filteredData.length;
      return yearlyAverage;
    }

    calculateCovidTemperatures(temperatures){
      temperatures.forEach((temp: number) => {
        if (temp >= 35.5 && temp <= 37.9) {
          this.normalTemp++
        } else if (temp >= 38){
          this.abnormalTemp++
        } else {
          this.abnormalTemp++
        }
      });
    }
}
