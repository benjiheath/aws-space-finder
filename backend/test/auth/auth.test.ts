import { cognitoConfig } from './config';
import { AuthService } from './authService';

const authService = new AuthService();

const user = authService.login(cognitoConfig.TEST_USER_NAME, cognitoConfig.TEST_USER_PASSWORD);
