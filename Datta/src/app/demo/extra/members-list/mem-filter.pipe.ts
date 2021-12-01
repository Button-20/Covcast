import { Members } from '../../../theme/shared/members.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memFilter'
})
export class MemFilterPipe implements PipeTransform {

  transform(member: Members[], searchTerm: string): Members[] {
    if(!member || !searchTerm)
    return member;

    return member.filter(member =>
      member.classname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      member.firstname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      member.lastname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      member.othername.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      member.phonenumber.toString().includes(searchTerm.toLocaleLowerCase()) 

    )
  }

}
