import { FormHOC } from 'forms/FormHOC';
import { Map } from 'components/Map';
import React from 'react';
import { MundaBiddiProblemSchema } from 'configurations/MundaBiddi';
import { ProblemReportingForm } from 'forms/ProblemReportingForm';

export const MundaBiddiSceneMap = {
    forms: () => (
        <FormHOC formTypeName={MundaBiddiProblemSchema.name} CustomForm={ProblemReportingForm} />
    ),
    map: Map
};
