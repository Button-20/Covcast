import { BulksmsModule } from './bulk-sms.module';

describe('BulksmsModule', () => {
  let bulksmsModule: BulksmsModule;

  beforeEach(() => {
    bulksmsModule = new BulksmsModule();
  });

  it('should create an instance', () => {
    expect(bulksmsModule).toBeTruthy();
  });
});
