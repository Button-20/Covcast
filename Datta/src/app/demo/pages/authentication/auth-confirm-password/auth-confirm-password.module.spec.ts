import { AuthConfirmPasswordModule } from './auth-confirm-password.module';

describe('AuthConfirmPasswordModule', () => {
  let authConfirmPasswordModule: AuthConfirmPasswordModule;

  beforeEach(() => {
    authConfirmPasswordModule = new AuthConfirmPasswordModule();
  });

  it('should create an instance', () => {
    expect(authConfirmPasswordModule).toBeTruthy();
  });
});
