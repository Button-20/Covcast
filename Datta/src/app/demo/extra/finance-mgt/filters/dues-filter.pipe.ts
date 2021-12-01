import { Pipe, PipeTransform } from '@angular/core';
import { Dues } from 'src/app/theme/shared/dues.model';

@Pipe({
  name: 'duesFilter'
})
export class DuesFilterPipe implements PipeTransform {

  transform(dues: Dues[], searchTerm: string): Dues[] {
    if(!dues || !searchTerm)
    return dues;

    return dues.filter(dues =>
      dues.membername.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      dues.dateofpayment.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      dues.amount.toString().includes(searchTerm.toLocaleLowerCase())
    )
  }

}
