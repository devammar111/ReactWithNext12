import WidgetWrapper from "../widgetWrapper";
import { WidgetModel } from '@lib/umbraco/types/widgetModel.type';
import styles from './newsletterSignup.module.scss';
import { Field, Form, Formik, FormikHelpers, FormikValues, useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from 'yup';
import { GlobalDialogContext } from "@components/dialogs/globalDialog";
import AlertDialog from "@components/dialogs/alertDialog";
import { joinNewsletter } from "./newsletterHelper";
import { LoadingButton } from "@mui/lab";
import { DialogContext } from "@components/dialogs/dialogProvider";

export type NewsletterSignupModel = {
    title?: string,
    emailPlaceholder: string,
    submitText: string,
    successMessage: string,
    errorMessage: string
}

export default function NewsletterSignup(model: WidgetModel) {
    const {title, emailPlaceholder, submitText, successMessage, errorMessage } = model.content as NewsletterSignupModel
    const modalId = useContext(GlobalDialogContext);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState('');
    const { dispatch } = useContext(DialogContext);
    const [inputValue, setInputValue] = useState<string>("");

    return (
        <WidgetWrapper model={model} styles={styles}>
            {!!title &&
                <h2>{title}</h2>
            }
            <Formik
                initialValues={{
                    email: ''
                }}
                validationSchema={
                    Yup.object().shape({
                        email: Yup.string()
                            .required('Email address required')
                            .email('Invalid email address')
                    })
                }
                onSubmit={values => {
                    setSubmitting(true);
                    joinNewsletter(values.email)
                        .then(response => {
                            if (response.status === 200) {
                                response.text()
                                    .then((message : string) => {
                                        if (modalId) {
                                            dispatch({
                                                id: modalId,
                                                action: 'close'
                                            });
                                        }
                                        setAlert(message);
                                        setSubmitting(false);

                                    });
                            }
                            else {
                                setAlert(errorMessage);
                                setSubmitting(false);

                            }
                        })
                }}>
                <Form>
                    <Field className={styles.input} name="email" placeholder={emailPlaceholder} />
                    <LoadingButton loading={submitting} className={styles.button + ' button'} type="submit">{submitText}</LoadingButton>
                </Form>
            </Formik>
            <AlertDialog message={alert} setter={setAlert} />
        </WidgetWrapper>
    )
}