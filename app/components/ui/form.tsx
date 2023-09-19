import * as React from 'react'
import type * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { FormProvider, useFormContext } from 'react-hook-form'

import { cn } from '~/utils'
import { Label } from '~/components/ui/label'
import { useField, useIsSubmitting } from 'remix-validated-form'
import type { InputProps } from './input'
import { Input } from './input'
import { ErrorMessage, Muted } from '../typography'
import type { ButtonProps } from './button'
import { Button } from './button'
import { Loader2 } from 'lucide-react'
import type { TextareaProps } from './textarea'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectTrigger, SelectValue } from './select'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

export let FormInput = React.forwardRef<
  HTMLInputElement,
  {
    name: string
    label?: React.ReactNode
    helper?: React.ReactNode
  } & InputProps
>(({ name, label, helper, ...props }, ref) => {
  let { error, getInputProps } = useField(name)
  let id = React.useId()

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input ref={ref} id={id} {...getInputProps()} {...props} />
      {helper && <Muted>{helper}</Muted>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export function FormTextarea({
  name,
  label,
  helper,
  ...rest
}: {
  name: string
  label?: React.ReactNode
  helper?: React.ReactNode
} & TextareaProps) {
  let { error, getInputProps } = useField(name)
  let id = React.useId()

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} {...rest} {...getInputProps()} />
      {helper && <Muted>{helper}</Muted>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

export function FormSelect({
  name,
  label,
  helper,
  placeholder,
  children,
  ...props
}: {
  name: string
  label?: React.ReactNode
  helper?: React.ReactNode
  children: React.ReactNode
  placeholder?: string
} & React.ComponentPropsWithoutRef<typeof Select>) {
  let { error, getInputProps } = useField(name)
  let id = React.useId()

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select name={name} {...getInputProps()} {...props}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">{children}</SelectContent>
      </Select>
      {helper && <Muted>{helper}</Muted>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

export function FormSubmit({ children, ...props }: ButtonProps) {
  let isSubmitting = useIsSubmitting()

  return (
    <Button disabled={isSubmitting} {...props}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
