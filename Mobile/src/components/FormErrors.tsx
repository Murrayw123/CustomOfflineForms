import { FormikErrors } from 'forms/FormHOC';
import { ServicesContext } from 'services/Context';
import { useContext, useEffect } from 'react';

const formatErrorMessage = (formikErrors: FormikErrors): string => {
    const errorMessages = Object.keys(formikErrors).map(key => formikErrors[key]);
    return errorMessages.join('\n');
};

export const FormErrors = ({
    errors,
    submitCount,
    isSubmitting
}: {
    errors: FormikErrors;
    submitCount: number;
    isSubmitting: boolean;
}) => {
    const { toastService } = useContext(ServicesContext);

    useEffect(() => {
        if (errors && isSubmitting) {
            toastService.publishErrorToast(formatErrorMessage(errors));
        }
    }, [errors, toastService, submitCount, isSubmitting]);
    return null;
};
