import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usersmem'
})
export class UsersmemPipe implements PipeTransform {

  transform(items: any[]): any {
    if (!items) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.classname);
  }

}
