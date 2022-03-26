import React, { useContext } from 'react';
import { Formik } from 'formik';
import { ServicesContext } from 'services/Context';
import { FormValues } from 'controllers/FormController';
import { FormType } from 'services/ConfigurationService';

export interface FormProps {
    values: { [key: string]: string };
    handleChange: any;
    formType: FormType;
    handleSubmit: () => void;
}

export const FormHOC = ({
    formTypeName,
    CustomForm
}: {
    formTypeName: string;
    CustomForm: any;
}) => {
    const { formControllerCollection, formTypeCollection } = useContext(ServicesContext);
    const formType = formTypeCollection.getFormTypeByName(formTypeName);
    const formController = formControllerCollection.getFormControllerFromFormTypeName(formTypeName);

    return (
        <Formik
            onSubmit={(values: FormValues) => {
                formController.createNewFormSubmission(values);
            }}
            initialValues={formType.initialValues}
            validationSchema={formType.validationSchema}
        >
            {({ handleChange, values, handleSubmit }) => (
                <CustomForm
                    handleChange={handleChange}
                    values={values}
                    handleSubmit={handleSubmit}
                    formType={formType}
                />
            )}
        </Formik>
    );
};
