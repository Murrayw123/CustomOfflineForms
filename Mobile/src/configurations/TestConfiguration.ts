import { IConfiguration } from 'services/ConfigurationService';
import { MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema } from 'configurations/MundaBiddi';

export const TestConfiguration: IConfiguration = {
    additionalRoutes: [],
    partitionValue: 'TEST',
    schemas: [MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema]
};
