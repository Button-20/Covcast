import { Pipe, PipeTransform } from '@angular/core';
import { Attendance } from 'src/app/theme/shared/attendance.model';

@Pipe({
  name: 'attendanceFilter'
})
export class AttendanceFilterPipe implements PipeTransform {

  transform(attendance: Attendance[], searchTerm: string): Attendance[] {
    if(!attendance || !searchTerm)
    return attendance;

    return attendance.filter(attendance =>
      attendance.membername.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      attendance.event.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
  }

}
