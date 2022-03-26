import { IConfiguration } from 'services/ConfigurationService';
import { MundaBiddiConfiguration } from 'configurations/MundaBiddi';

export const TestConfiguration: IConfiguration = Object.assign({}, MundaBiddiConfiguration, {
    partitionValue: 'TEST'
});
