import { IConfiguration } from 'services/ConfigurationService';
import {
    MundaBiddiProblemFormType,
    MundaBiddiProblemSchema,
    MundaBiddiTrackInfoSchema
} from 'configurations/MundaBiddi';

export const TestConfiguration: IConfiguration = {
    partitionValue: 'TEST',
    schemas: [MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema],
    formTypes: [MundaBiddiProblemFormType],
    boundingBox: [
        [123, 123],
        [123, 123]
    ]
};
