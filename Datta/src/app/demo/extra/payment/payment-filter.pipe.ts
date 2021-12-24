import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from 'src/app/theme/shared/payment.model';

@Pipe({
  name: 'paymentFilter'
})
export class PaymentFilterPipe implements PipeTransform {

  transform(payment: Payment[], searchTerm: string): Payment[] {
    if(!payment || !searchTerm)
    return payment;

    return payment.filter(payment =>
      payment.type.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      payment.status.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      payment.phonenumber.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      payment.transaction_Code.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      payment.modeOfPayment.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      payment.subscription_plan.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
  }

}
