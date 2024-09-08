import { TextField, TextFieldProps } from "@mui/material";
import UmbracoFormModel from "../../../lib/umbraco/types/umbracoFormModel.type";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createElement, useContext, useEffect, useId, useRef, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import UmbracoFormField from "../../../lib/umbraco/types/umbracoFormField.type";
import { DialogContext } from "../dialogs/dialogProvider";
import { submitForm } from "./formApi";
import { GlobalDialogContext } from "../dialogs/globalDialog";
import { useRouter } from "next/router";
import stylesDefault from './umbracoForm.module.scss';
import stylesContact from './umbracoFormContact.module.scss';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AlertDialog from "@components/dialogs/alertDialog";
import UmbracoFormFieldCondition from "@lib/umbraco/types/umbracoFormFieldCondition.type";
import Recaptcha from "./recaptcha";
import { parseMagicStrings } from "../../../lib/umbraco/util/helpers";
import { useCommonDataContext, useCurrentPageContext } from "@components/layout/layout";
import { useRefererContext } from "pages/_app";
import SubmitButton from "./submitButton";
import getConfig from "next/config";
import DependentDropdown, { PrevalueSet } from "./dependentDropdown";
import { Dayjs } from "dayjs";
import FileUpload, { FileUploadData } from "./fileUpload";
import InlineList from "../inline-list/inline-list";
import Rte from "../grid/controls/rte";

export default function UmbracoForm(form: UmbracoFormModel) {
    let styles = form.name === 'Contact' ? stylesContact : stylesDefault;
    const router = useRouter();
    const { publicRuntimeConfig } = getConfig();
    const referer = useRefererContext();
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState('');
    const { dictionaries } = useCommonDataContext();
    const formElement = useRef<HTMLFormElement>(null);
    const modalId = useContext(GlobalDialogContext);
    var page = useCurrentPageContext();
    const { dispatch } = useContext(DialogContext);
    const validation: any = {};
    const formClassName = form.cssClass;
    const defaults: any = {};
    const conditionFields: NodeJS.Dict<string[]> = {};
    const mappings: NodeJS.Dict<string> = {};
    const validationFunctions: NodeJS.Dict<Function> = {};
    const getOperations = (condition: UmbracoFormFieldCondition) => {
        if (!condition) {
            return '';
        }
        const orLogic = condition.logicType === 1;
        var code = '';
        condition.rules.forEach((rule, index) => {
            if (index > 0) {
                code += orLogic ? " || " : " && ";
            }
            const fieldName = "field_" + rule.field.replaceAll('-', '');
            switch (rule.operator) {
                case 0:
                    code += '(' + fieldName + " + '') === '" + rule.value + "'";
                    break;
                case 1:
                    code += '(' + fieldName + " + '') !== '" + rule.value + "'";
                    break;
                case 2:
                    code += fieldName + " > " + rule.value;
                    break;
                case 3:
                    code += fieldName + " < " + rule.value;
                    break;
                case 4:
                    code += "(" + fieldName + " && " + fieldName + ".indexOf('" + rule.value + "') > -1)";
                    break;
                case 5:
                    code += "(" + fieldName + " && " + fieldName + ".indexOf('" + rule.value + "') === 0)";
                    break;
                case 6:
                    code += "(" + fieldName + " && " + fieldName + ".endsWith('" + rule.value + "'))";
                    break;
            }
        });
        return code;
    }

    const buildConditions = (field: UmbracoFormField, groupConditions?: string) => {
        var params = (conditionFields[field.id] as string[]).map(id => "field_" + id.replaceAll('-', ''));
        var code = getOperations(field.condition);
        if (groupConditions) {
            if (code) {
                code = '(' + code + ') && (' + groupConditions + ')';
            }
            else {
                code = groupConditions;
            }
        }
        if (!code) {
            code = 'true';
        }
        code = 'return ' + code + ';';
        var result = new Function(...params, code);
        validationFunctions[field.id] = result;
        return result;
    }
    const validateString = (yupString: Yup.StringSchema<string | null | undefined, Yup.AnyObject, undefined, "">, field: UmbracoFormField) => {
        if (field.pattern) {
            yupString = yupString.matches(new RegExp(field.pattern), field.patternInvalidErrorMessage);
        }
        if (field.settings && field.settings.MaximumLength) {
            var maxLength = field.settings.MaximumLength;
            yupString = yupString.max(parseInt(maxLength), 'Field must be less than {0} characters.'.replaceAll('{0}', maxLength))
        }
        if (field.required) {
            yupString = yupString.required(field.requiredErrorMessage);
        }
        else {
            yupString.optional();
        }
        return yupString;
    }
    const validateArray = (yupArray: Yup.ArraySchema<any[] | undefined, Yup.AnyObject, undefined, ''>, field: UmbracoFormField) => {
        if (field.settings && field.settings.MaximumLength) {
            var maxLength = field.settings.MaximumLength;
            yupArray = yupArray.max(parseInt(maxLength), 'Field must be less than {0} characters.'.replaceAll('{0}', maxLength))
        }
        if (field.required) {
            yupArray = yupArray.required(field.requiredErrorMessage);
        }
        else {
            yupArray.optional();
        }
        return yupArray;
    }
    const getDependencies = (condition: UmbracoFormFieldCondition) => {
        if (!condition || !condition.rules) {
            return [];
        }
        return condition.rules.map(rule => rule.field).filter((value, index, self) => self.indexOf(value) === index);
    }

    const arrayFields = [
        'fab43f20-a6bf-11de-a28f-9b5755d89593',
        '84a17cf8-b711-46a6-9840-0e4a072ad000'
    ]
    const dateFields = [
        'f8b4c3b8-af28-11de-9dd8-ef5956d89593',
        'e6f06817-b4f6-455c-825b-cc45a224e67e'
    ]
    const resourceTargets: string[] = [];
    form.pages.forEach(formPage => {
        formPage.fieldsets.forEach(fieldset => {
            var groupCondition = fieldset.condition?.rules && fieldset.condition.rules.length ? getOperations(fieldset.condition) : "";
            var groupDependencies = getDependencies(fieldset.condition);
            fieldset.columns.forEach(container => {
                container.fields.forEach(field => {
                    if (field.settings.DefaultValue && field.settings.DefaultValue.indexOf('[*') > -1) {
                        const placeholderCheck = /\[\*(\w+)\]/g;
                        var matches = Array.from(field.settings.DefaultValue.matchAll(placeholderCheck));
                        for (const match of matches) {
                            const alias = match[1];
                            if (resourceTargets.indexOf(alias) === -1) {
                                resourceTargets.push(alias);
                            }
                        }
                    }
                    defaults[field.id] = field.settings && field.settings.DefaultValue ?
                        parseMagicStrings(field.settings.DefaultValue, router, page, dictionaries) :
                        (dateFields.indexOf(field.type.id) > -1 ? null : '');
                    var isArray = arrayFields.indexOf(field.type.id) > -1;
                    var fieldDependencies = getDependencies(field.condition);
                    conditionFields[field.id] = groupDependencies.concat(fieldDependencies).filter((value, index, self) => self.indexOf(value) === index);
                    if (isArray) {
                        var yupArray = Yup.array();
                        if ((conditionFields[field.id] as string[]).length) {
                            yupArray = yupArray.when(conditionFields[field.id] as string[], {
                                is: buildConditions(field, groupCondition),
                                then: schema => validateArray(schema, field)
                            });
                        }
                        else {
                            yupArray = validateArray(yupArray, field);
                        }
                        validation[field.id] = yupArray;
                    }
                    else {
                        var yupString = Yup.string().nullable();
                        if ((conditionFields[field.id] as string[]).length) {
                            yupString = yupString.when(conditionFields[field.id] as string[], {
                                is: buildConditions(field, groupCondition),
                                then: schema => validateString(schema, field)
                            });
                        }
                        else {
                            yupString = validateString(yupString, field);
                        }
                        validation[field.id] = yupString;
                    }
                    mappings[field.id] = field.alias;
                })
            })
        })
    });

    const formik = useFormik({
        initialValues: defaults,
        validationSchema: Yup.object().shape(validation),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            setSubmitting(true);
            var data: NodeJS.Dict<string> = {};
            const keys = Object.keys(values);
            keys.forEach(key => {
                if (mappings[key]) {
                    data[mappings[key] || ''] = values[key];
                }
            });
            submitForm(form.id, JSON.parse(JSON.stringify({ values: data, contentId: page.id })))
                .then(response => {
                    if (response.status === 200) {
                        if (form.goToPageUrlOnSubmit) {
                            router.push(form.goToPageUrlOnSubmit);
                        }
                        else {
                            setAlert(form.messageOnSubmit);
                            response.text()
                                .then(message => {
                                    if (modalId) {
                                        dispatch({
                                            id: modalId,
                                            action: 'close',
                                        });
                                    }
                                });
                        }
                        resetForm();
                    }
                    else {
                        response.json()
                            .then(errors => {
                                if (errors.errors) {
                                    var errorList = '<li>' + Object.values(errors.errors).join('</li><li>') + '</li>';
                                    setAlert(`
                                        <h3>${errors.title}</h3>
                                        <ul>${errorList}</ul>                                
                                    `)
                                }
                                else {
                                    setAlert(`
                                        <h3>${errors.title}</h3>
                                        <p>${errors.detail}</p>                             
                                    `)
                                }
                            })
                    }
                    setSubmitting(false);
                })
                .catch(error => {
                    setAlert(error);
                    setSubmitting(false);
                })
        }
    });

    const renderField = (field: UmbracoFormField) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        let uniqueID = useId();
        switch (field.type.id) {
            case '3f92e01b-29e2-4a30-bf33-9df5580ed52c': // Short Answer
                var uniqueFieldKey = "field-" + field.id;
                return (
                    <>
                        <div key={uniqueFieldKey} className={styles.field}>
                            <TextField
                                placeholder={field.settings.ShowLabel != "True" ? (field.required == true ? field.caption :
                                    field.caption + " " + "(Optional)") : ""}
                                id={field.id} className={field.required == true ? styles.onFocus : styles.optionalField}
                                name={field.id}
                                type={field.settings.FieldType}
                                variant="outlined"
                                value={formik.values[field.id]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                                helperText={formik.touched[field.id] && formik.errors[field.id] ? formik.errors[field.id] + '' : ''}
                            />
                        </div>
                    </>
                )
            case '0dd29d42-a6a5-11de-a2f2-222256d89593': //Dropdown
                return (
                    <>
                        <div key={"field-" + field.id} className={styles.field}>
                            <select name={field.id} value={formik.values[field.id]} onChange={formik.handleChange}>
                                <option disabled value="">{parseMagicStrings(field.settings.SelectPrompt || '', router, page, dictionaries)}
                                </option>
                                {field.preValues?.map(preValue =>
                                    <option key={preValue.value} value={preValue.value}>{preValue.value}</option>
                                )}
                            </select>
                        </div>
                    </>
                )
            case '023f09ac-1445-4bcb-b8fa-ab49f33bd046': //Long Answer
                var numRows = field.settings['NumberOfRows'];
                return (
                    <>
                        <div key={"field-" + field.id} className={styles.field + " " + styles.textAreaField}>
                            {/*<textarea rows={numRows ? parseInt(numRows) : 3} id={field.id}*/}
                            {/*    className={styles.textArea} name={field.id} placeholder={field.settings.Placeholder}*/}
                            {/*    value={formik.values[field.id]} onChange={formik.handleChange} onBlur={formik.handleBlur}*/}
                            {/*    required*/}
                            {/*>*/}
                            {/*</textarea >*/}
                            <TextField
                                placeholder={field.settings.Placeholder}
                                id={field.id}
                                name={field.id}
                                type={field.settings.FieldType}
                                variant="outlined"
                                value={formik.values[field.id]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                                helperText={formik.touched[field.id] && formik.errors[field.id] ? formik.errors[field.id] + '' : ''}
                                multiline={true}
                                maxRows={numRows ? numRows : 3}
                                minRows={3}
                            />
                        </div>
                    </>
                )
            case 'fab43f20-a6bf-11de-a28f-9b5755d89593': //Multiple Choice
                return field.preValues?.map((preValue, index) =>
                    <div key={'checkbox-' + field.id + '-' + index} className={styles.customCheckbox + " " + styles.field}>
                        <input aria-describedby={uniqueID} id={field.id + '-' + index} type="checkbox" name={field.id}
                            checked={formik.values[field.id]?.indexOf(preValue.value) > -1} value={preValue.value}
                            onChange={formik.handleChange} />
                        <label id={uniqueID} className={styles.customRadioLabel} htmlFor={field.id + '-' + index}>{preValue.caption}</label>
                    </div>
                )
            case 'd5c0c390-ae9a-11de-a69e-666455d89593':  //Checkbox
                return <div className={styles.customCheckbox + " " + styles.singleCustomCheckbox + " " + styles.field}>
                    <input aria-describedby={uniqueID} id={field.id} type="checkbox" name={field.id} checked={formik.values[field.id]}
                        value={formik.values[field.id]} onChange={formik.handleChange} />
                    <label id={uniqueID} className={styles.customRadioLabel} htmlFor={field.id}>{field.helpText || field.caption}</label>
                </div>
            case '6515fccd-3f6e-4b8c-b559-068dbc62ef2d': //Multi Checkbox with Columns
                const columns = parseInt(field.settings.Columns || '1');
                const size = Math.ceil((field.preValues?.length || 0) / columns);
                const items = [];
                for (var i = 0; i < columns; i++) {
                    items.push(field.preValues?.slice(i * size, (i + 1) * size));
                }
                return (
                    <div className={"grid-x grid-margin-x small-up-1 medium-up-" + columns}>
                        {items.map((column, columnIndex) =>
                            <div className="cell" key={'column-' + columnIndex}>
                                {column?.map((preValue, index) => {
                                    const innerIndex = (columnIndex * size) + index;
                                    return (
                                        <div key={'checkbox-' + field.id + '-' + innerIndex} className={styles.field }>
                                            <input aria-describedby={uniqueID} id={field.id + '-' + innerIndex} type="checkbox"
                                                name={field.id} checked={formik.values[field.id]?.indexOf(preValue.value) > -1}
                                                value={preValue.value} onChange={formik.handleChange} />
                                            <label id={uniqueID} className={styles.customRadioLabel} htmlFor={field.id + '-' + innerIndex}>
                                                {preValue.caption}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                );
            case 'f8b4c3b8-af28-11de-9dd8-ef5956d89593': //Date
            case 'e6f06817-b4f6-455c-825b-cc45a224e67e': //Date Picker With Defaults
                return <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker className={styles.datepicker + " " + styles.field} renderInput={(params: TextFieldProps) =>
                        <TextField {...params} />}
                        value={formik.values[field.id]}
                        onChange={(value: Dayjs | null) => { console.log('test'); formik.setFieldValue(field.id, value?.toDate()) }}
                    // error={formik.touched[field.id] && Boolean(formik.errors[field.id])}
                    // helperText={formik.touched[field.id] && formik.errors[field.id] ? formik.errors[field.id] + '' : ''}
                    />
                </LocalizationProvider>
            case '903df9b0-a78c-11de-9fc1-db7a56d89593': //Single Choice
                if (field.settings.DisplayHorizontally === "True") {
                    return (
                        <InlineList items={field.preValues?.map((preValue, index) =>
                            <div key={'item-' + index} className={styles.field}>
                                <input aria-describedby={uniqueID} id={field.id + '-' + index} type="radio" name={field.id}
                                    checked={preValue.value === formik.values[field.id]} value={preValue.value}
                                    onChange={formik.handleChange} />
                                <label id={uniqueID} className={styles.customRadioLabel} htmlFor={field.id + '-' + index}>
                                    {preValue.caption}</label>
                            </div>
                        ) || []} />
                    )
                }
                else {
                    return (
                        <>
                        <div className={styles.field}>
                            <ul className={styles.listInlineStyle + " no-bullet"}>
                                {field.preValues?.map((preValue, index) =>
                                    <li key={'radio-' + index} className={styles.customRadio}>
                                        <input aria-describedby={uniqueID} id={field.id + '-' + index} type="radio" name={field.id}
                                            checked={preValue.value === formik.values[field.id]} value={preValue.value}
                                            onChange={formik.handleChange} />
                                        <label id={uniqueID} className={styles.customRadioLabel} htmlFor={field.id + '-' + index}>
                                            {preValue.caption}
                                        </label>
                                    </li>
                                )}
                            </ul>
                        </div>
                        </>
                    )
                }
            case '663aa19b-423d-4f38-a1d6-c840c926ef86': //reCAPTCHA v3
                return <>
                    <Recaptcha siteKey={publicRuntimeConfig.recaptchaKey} id={field.id}
                        scoreThreshold={parseFloat(field.settings.ScoreThreshold || '.5')}
                        onChange={(token: string) => formik.setFieldValue(field.id, token)} />
                </>
            case 'bd587dba-8d9b-46dd-aa89-2c714684f0cf': //Dependent Dropdown
                const options: PrevalueSet[] = JSON.parse(field.settings.Options as string);
                return <>
                    
                    <div className={styles.field}>
                        <DependentDropdown name={field.id} required={field.required} value={formik.values[field.id]}
                            onChange={formik.handleChange} inputvalue={formik.values[field.settings.InputField as string]}
                            options={options}
                            placeholder={parseMagicStrings(field.settings.PromptForSelection || '', router, page, dictionaries)} />
                    </div>
                </>
            case '84a17cf8-b711-46a6-9840-0e4a072ad000': //File Upload
                return (
                    <div className={styles.field}>
                        <FileUpload required={field.required} multiple={field.fileUploadOptions.allowMultipleFileUploads}
                            allowedExtensions={field.fileUploadOptions.allowedUploadExtensions}
                            onChange={(value: FileUploadData[] | null) => { formik.setFieldValue(field.id, value) }} />
                    </div>
                )
            case 'fb37bc60-d41e-11de-aeae-37c155d89593': //Password
                return <div className={styles.field}>
                    
                        
                    <input id={field.id} className={styles.textField} name={field.id} type="password"
                        placeholder={field.settings.placeHolder} value={formik.values[field.id]}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} />
                </div>
            case 'a72c9df9-3847-47cf-afb8-b86773fd12cd':  //Data Consent
                return <div className={styles.customCheckbox + " " + styles.field}>
                    <input id={field.id} type="checkbox" name={field.id} checked={formik.values[field.id]} value={formik.values[field.id]}
                        onChange={formik.handleChange} />
                    <label className={styles.customRadioLabel} htmlFor={field.id}>{field.settings.AcceptCopy}</label>
                </div>
            case 'e3fbf6c4-f46c-495e-aff8-4b3c227b4a98':  //Headline and description
                return <>
                    <div className={styles.field + " " + styles.headingDescription}>
                        {field.settings.Caption && field.settings.CaptionTag &&
                            createElement(field.settings.CaptionTag, {}, parseMagicStrings(field.settings.Caption, router, page, dictionaries))
                        }
                        {field.settings.BodyText &&
                            <p>{parseMagicStrings(field.settings.BodyText, router, page, dictionaries)}</p>
                        }
                    </div>
                    
                </>
            case '1f8d45f8-76e6-4550-a0f5-9637b8454619':  //Rich text
                const text = parseMagicStrings(field.settings.Html || '', router, page, dictionaries)
                return <div className={styles.field + " " + styles.richTextField}> <Rte text={text} /></div>
            case 'da206cae-1c52-434e-b21a-4a7c198af877':  //Hidden
                return <div className={styles.field}><input name={field.id} type="hidden" value={formik.values[field.id]} /></div>
        }
    }
    return (
        <>
            <form className={`${form.name === 'Contact' ? styles.umbracoFormContact : styles.umbracoForm} ${formClassName
                ? styles.formClassName : ""} ${form.cssClass === "themedefault"
                    || form.cssClass === "" ? styles.themeDefault : styles.themeCenter}`}
                onSubmit={formik.handleSubmit} noValidate ref={formElement}>
                {form.pages.map((formPage, index) => (
                    <div key={"page-" + index} className={styles.page}>
                        {formPage.fieldsets.map(fieldset => {
                            var groupCondition = fieldset.condition?.rules && fieldset.condition.rules.length ?
                                getOperations(fieldset.condition) : "";
                            if (groupCondition) {
                                var dependencies = getDependencies(fieldset.condition);
                                if (!((new Function(...dependencies.map(id => "field_" + id.replaceAll('-', '')),
                                    'return ' + groupCondition))(...dependencies.map(id => formik.values[id])))) {
                                    return null;
                                }
                            }
                            return (
                                <div key={"fieldset-" + fieldset.id} className={styles.fieldset}>
                                    <div>
                                        {fieldset.columns.map((container, index) => (
                                            <div key={"container-" + fieldset.id + '-' + index}
                                                className={styles.container + ' medium-' + container.width}>
                                                {container.fields.map(field => {
                                                    if (!buildConditions(field, groupCondition)(...(conditionFields[field.id] as string[]).map(id => formik.values[id]))) {
                                                        return null;
                                                    }
                                                    return <>
                                                        {field.settings.ShowLabel == "True" &&
                                                            <label>{field.caption} {field.required == true ? '*' : ''}</label>
                                                        }
                                                        {renderField(field)}
                                                    </>
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div className={form.name != "Learn More" ? styles.buttonWrapper : ''}>
                    <SubmitButton loading={submitting}>{form.submitLabel}</SubmitButton>
                </div>
            </form>
            <AlertDialog message={alert} setter={setAlert} />
        </>
    )
}