import { Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'src/app/theme/shared/subscription.model';

@Pipe({
  name: 'subFilter'
})
export class SubscriptionFilterPipe implements PipeTransform {

  transform(subscription: Subscription[], searchTerm: string): Subscription[] {
    if(!subscription || !searchTerm)
    return subscription;

    return subscription.filter(subscription =>
      subscription.userid.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      subscription.plan_id.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
  }

}
