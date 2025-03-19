import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { TextAreaField } from "./text-area-field";
import { SelectField } from "./select-field";
import { DateInputField } from "./date-input-field";
import { CheckboxField } from "./checkbox-field";
import { SubmitButton } from "./submit-button";
import { PasswordField } from "./password-field";
import { EmailField } from "./email-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    PasswordField,
    EmailField,
    SelectField,
    DateInputField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
