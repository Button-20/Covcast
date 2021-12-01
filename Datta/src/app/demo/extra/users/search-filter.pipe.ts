import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../theme/shared/user.model';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(user: User[], searchTerm: string): User[] {
    if(!user || !searchTerm)
    return user;

    return user.filter(user =>
      user.classname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.fullname.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.email.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      user.phonenumber.toString().includes(searchTerm.toLocaleLowerCase()) 

    )
  }

}
