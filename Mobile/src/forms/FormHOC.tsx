import React, { useContext, useEffect } from 'react';
import { Formik, useFormikContext } from 'formik';
import { ServicesContext } from 'services/Context';
import { FormValues } from 'controllers/FormController';
import { FormType } from 'services/ConfigurationService';
import { View } from 'react-native';
import { FormErrors } from 'components/FormErrors';

export interface FormProps {
    values: { [key: string]: string };
    handleChange: any;
    formType: FormType;
    handleSubmit: () => void;
}

export interface FormikErrors {
    [key: string]: string | undefined;
}

export const FormHOC = ({
    formTypeName,
    CustomForm
}: {
    formTypeName: string;
    CustomForm: any;
}) => {
    const { formControllerCollection, formTypeCollection, toastService } =
        useContext(ServicesContext);

    const formType = formTypeCollection.getFormTypeByName(formTypeName);
    const formController = formControllerCollection.getFormControllerFromFormTypeName(formTypeName);

    return (
        <Formik
            onSubmit={(values: FormValues, { resetForm }) => {
                formController.createNewFormSubmission(values);
                toastService.publishSuccessToast('Form submitted successfully');
                resetForm();
            }}
            initialValues={formType.initialValues}
            validationSchema={formType.validationSchema}
        >
            {({ handleChange, values, handleSubmit, errors, submitCount, isSubmitting }) => {
                return (
                    <View>
                        <CustomForm
                            handleChange={handleChange}
                            values={values}
                            handleSubmit={handleSubmit}
                            formType={formType}
                        />
                        <FormErrors
                            errors={errors}
                            submitCount={submitCount}
                            isSubmitting={isSubmitting}
                        />
                    </View>
                );
            }}
        </Formik>
    );
};
