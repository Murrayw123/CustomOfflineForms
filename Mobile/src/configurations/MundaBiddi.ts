import * as Yup from 'yup';
import { IConfiguration } from 'services/ConfigurationService';

export const MundaBiddiProblemSchema = {
    name: 'MundaBiddiProblem',
    properties: {
        _id: 'objectId?',
        description: 'string',
        lastUpdated: 'date',
        latitude: 'double',
        longitude: 'double',
        org: 'string',
        type: 'string'
    },
    primaryKey: '_id'
};

export const MundaBiddiTrackInfoSchema = {
    name: 'MundaBiddiTrackInfo',
    properties: {
        _id: 'objectId',
        data: 'string?',
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

export const MundaBiddiProblemFormType = {
    name: MundaBiddiProblemSchema.name,
    modelSchema: MundaBiddiProblemSchema,
    validationSchema: MundaBiddiProblemValidationSchema,
    initialValues: {
        description: '',
        latitude: '0',
        longitude: '0',
        org: 'MundaBiddi Trail Foundation',
        type: 'trail_obstruction'
    },
    formFieldOptions: {
        type: {
            options: [
                { display: 'Trail Obstructed', value: 'trail_obstruction' },
                { display: 'Trail eroded', value: 'trail_eroded' },
                { display: 'Structural Damage', value: 'structural_damage' },
                { display: 'Motorised Vehicle on Trail', value: 'vehicle_on_trail' },
                { display: 'Missing Markers', value: 'missing_markers' },
                { display: 'Other', value: 'other' }
            ]
        }
    }
};

const mapMarkers = [
    {
        schema: MundaBiddiProblemSchema,
        marker: 'FormSubmissionMarker',
        formType: MundaBiddiProblemFormType
    }
];

export const MundaBiddiConfiguration: IConfiguration = {
    partitionValue: 'mundabiddi',
    schemas: [MundaBiddiProblemSchema, MundaBiddiTrackInfoSchema],
    formTypes: [MundaBiddiProblemFormType],
    mapMarkers: mapMarkers,
    centerCoordinates: {
        longitude: 116.1683,
        latitude: -31.9022
    },
    offlineMapBoundingBox: [
        [117.87114, -31.72529],
        [114.840035, -34.95242]
    ]
};
