import { MundabiddiProblemReport } from 'forms/ProblemReportingForm';
import { Map } from 'components/Map';
import * as Yup from 'yup';
import { IConfiguration } from 'services/ConfigurationService';

const SceneMap = {
    forms: MundabiddiProblemReport,
    map: Map
};

const additionalRoutes = [{ key: 'map', title: 'map', icon: 'map' }];

const MundaBiddiProblemSchema = {
    name: 'MundaBiddiProblem',
    properties: {
        _id: 'objectId?',
        description: 'string',
        image: 'string',
        latitude: 'double',
        longitude: 'double',
        org: 'string',
        type: 'string'
    },
    primaryKey: '_id'
};

export const MundaBiddiProblemValidationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    image: Yup.string(),
    latitude: Yup.number().required('Latitude is required'),
    longitude: Yup.number().required('Longitude is required'),
    org: Yup.string().required('Org is required'),
    type: Yup.string().required('Type is required')
});

export const MundaBiddiConfiguration = (): IConfiguration => {
    return {
        sceneMap: SceneMap,
        additionalRoutes: additionalRoutes,
        partitionValue: 'mundabiddi',
        schemas: [MundaBiddiProblemSchema]
    };
};
