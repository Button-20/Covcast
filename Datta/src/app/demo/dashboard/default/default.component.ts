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
  malesPercent: number;
  femalesPercent: number;
  
  constructor(public userService: UserService, public memberService: MembersService, public duesService: DuesService, public attendanceService: AttendanceService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startProcedures();
    setTimeout(() => {
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

      var barChart = new Chart('widget-line-chart', {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'My Earnings',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: this.generateRandomColors(['January'].length)[0],
              tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    }, 1000);
  }

  startProcedures(){
    var payLoad = this.userService.getUserPayload();
     if(payLoad && payLoad.classname == 'Admin'){
       this.refreshAllTotalDues();
       this.refreshAllMaleCount();
       this.refreshFemaleList();
       this.refreshAllMembersCount();
       this.refreshAllAttendanceCount();
       this.getMemberofGroupsPieChart();
     }
     else{
       this.refreshTotalDues(payLoad.classname);
       this.refreshMembersCount(payLoad.classname);
       this.refreshMembersMaleList(payLoad.classname);
       this.refreshMembersFemaleList(payLoad.classname);  
       this.refreshAttendanceCount(payLoad.classname);
     }
   }
 
 
 
 
 
   refreshTotalDues(classname: string){
     this.duesService.getTotalDues(classname).subscribe((res) => {
       this.duesService.Total = res as DuesTotal[];
      //  console.log(res);
     })
   }
 
   refreshMembersMaleList(classname: string){
     this.memberService.getMembersMaleCount(classname).subscribe((res) => {
       this.memberService.maleCount = res;
     })
   }
 
   refreshMembersFemaleList(classname: string){
     this.memberService.getMembersFemaleCount(classname).subscribe((res) => {
       this.memberService.femaleCount = res;
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
 
   /////////////////////////////////////////------Admin-------/////////////////////////////////////////////////////
 
   refreshAllTotalDues(){
     this.duesService.getAllTotalDues().subscribe((res: any) => {
       this.duesService.Total = res[0]
     })
   }
 
   refreshAllMaleCount(){
     this.memberService.getAllMaleCount().subscribe((res) => {
       this.memberService.maleCount = res;
       this.memberService.getAllMembersCount().subscribe((res: any) => {
         this.malesPercent = this.calculatePercent(res, this.memberService.maleCount);
        //  console.log(this.males)
      })
     })
   }
 
   refreshFemaleList(){
     this.memberService.getAllFemaleCount().subscribe((res) => {
       this.memberService.femaleCount = res;
       this.memberService.getAllMembersCount().subscribe((res: any) => {
        this.femalesPercent = this.calculatePercent(res, this.memberService.femaleCount);
       //  console.log(this.males)
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
     this.userService.getUserList().subscribe((res: any) => {
       let data = [];
       data = res.map(element => { return element.classname });
       let filteredData = data.filter((c, index) => { return data.indexOf(c) === index && c !== 'Admin'});
       
       filteredData.forEach(cn => {
         this.memberService.getMembersCount(cn).subscribe((res: any) => {
          //  console.log(res)
          let group = {
            classname: cn,
            numberofmembers: res
          }
          this.classnames.push(group.classname);
          this.value.push(group.numberofmembers);
        })  
      })
      this.cdr.markForCheck();
  
     })
   }

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
}
