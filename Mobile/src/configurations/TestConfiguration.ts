import { IConfiguration } from 'services/ConfigurationService';
import {
    MundaBiddiProblemFormType,
    MundaBiddiProblemSchema,
    MundaBiddiTrackInfoSchema
} from 'configurations/MundaBiddi';

export const TestConfiguration: IConfiguration = {
    additionalRoutes: [],
    partitionValue: 'TEST',
    schemas: [MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema],
    formTypes: [MundaBiddiProblemFormType]
};
