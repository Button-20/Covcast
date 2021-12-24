import { PaymentFilterPipe } from './payment-filter.pipe';

describe('PaymentFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
