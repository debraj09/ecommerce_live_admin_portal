// import {useState, InputHTMLAttributes, ReactNode} from "react";
// import {Form, InputGroup} from "react-bootstrap";
// import classNames from "classnames";
//
// import {Control, Controller, FieldValues, FieldPath, PathValue} from "react-hook-form";
// import Feedback from "react-bootstrap/esm/Feedback";
//
//
// export type FormInputProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
//     control: Control<TFieldValues>
//     name: TName
//     id?: string
//     containerClassName?: string
//     label?: string | ReactNode
//     placeholder?: string
//     noValidate?: boolean
//     labelClassName?: string
//     type?: string;
//     register?: any;
//     errors?: any;
//     className?: string;
//     containerClass?: string;
//     refCallback?: any;
//     children?: any;
//     rows?: string;
// }
//
//
// /* Password Input */
// const PasswordInput = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
//                                                                                                                                             name,
//                                                                                                                                             placeholder,
//                                                                                                                                             register,
//                                                                                                                                             errors,
//                                                                                                                                             control,
//                                                                                                                                             className,
//                                                                                                                                         }: FormInputProps<TFieldValues> & InputHTMLAttributes<HTMLInputElement>) => {
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//
//     return (
//         <>
//             <Controller<TFieldValues, TName>
//                 name={name as TName}
//                 defaultValue={'' as PathValue<TFieldValues, TName>}
//                 control={control}
//                 render={({field, fieldState}) => (
//                     <InputGroup className="mb-0">
//                         <Form.Control
//                             type={showPassword ? "text" : "password"}
//                             placeholder={placeholder}
//                             id={name}
//                             as="input"
//                             className={className}
//                             isInvalid={!!(errors && errors[name])}
//                             {...(register ? register(name) : {})}
//                             autoComplete={name}
//                             {...field}
//                         />
//                         <div
//                             className={classNames("input-group-text", "input-group-password", {
//                                 "show-password": showPassword,
//                             })}
//                             data-password={showPassword ? "true" : "false"}
//                         >
//           <span
//               className="password-eye"
//               onClick={() => {
//                   setShowPassword(!showPassword);
//               }}
//           ></span>
//                         </div>
//
//                         {fieldState.error?.message &&
//                             <Feedback type="invalid">{fieldState.error?.message}</Feedback>}
//                     </InputGroup>
//                 )}
//             />
//         </>
//     );
// };
//
// const FormInput = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
//                                                                                                                                         label,
//                                                                                                                                         type,
//                                                                                                                                         name,
//                                                                                                                                         placeholder,
//                                                                                                                                         register,
//                                                                                                                                         errors,
//                                                                                                                                         control,
//                                                                                                                                         className,
//                                                                                                                                         labelClassName,
//                                                                                                                                         containerClass,
//                                                                                                                                         refCallback,
//                                                                                                                                         children,
//                                                                                                                                         rows,
//                                                                                                                                         ...otherProps
//                                                                                                                                     }: FormInputProps<TFieldValues> & InputHTMLAttributes<HTMLInputElement>) => {
//     // handle input type
//     const comp =
//         type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
//
//     return (
//         <>
//             <Controller<TFieldValues, TName>
//                 name={name as TName}
//                 defaultValue={'' as PathValue<TFieldValues, TName>}
//                 control={control}
//                 render={({field, fieldState}) => (
//                     <>
//                         {type === "hidden" ? (
//                             <input
//                                 type={type}
//                                 name={name}
//                                 {...(register ? register(name) : {})}
//                                 {...otherProps}
//                             />
//                         ) : (
//                             <>
//                                 {type === "password" ? (
//                                     <>
//                                         <Form.Group className={containerClass}>
//                                             {label ? (
//                                                 <>
//                                                     {" "}
//                                                     <Form.Label className={labelClassName}>
//                                                         {label}
//                                                     </Form.Label>{" "}
//                                                     {children}{" "}
//                                                 </>
//                                             ) : null}
//                                             <PasswordInput
//                                                 control={control}
//                                                 placeholder={placeholder}
//                                                 refCallback={refCallback}
//                                                 errors={errors!}
//                                                 register={register}
//                                                 className={className}
//                                                 {...field}
//                                             />
//
//                                             {fieldState.error?.message && (
//                                                 <Form.Control.Feedback type="invalid" className="d-block">
//                                                     {fieldState.error?.message}
//                                                 </Form.Control.Feedback>
//                                             )}
//                                         </Form.Group>
//                                     </>
//                                 ) : (
//                                     <>
//                                         {type === "checkbox" || type === "radio" ? (
//                                             <>
//                                                 <Form.Group className={containerClass}>
//                                                     <Form.Check
//                                                         type={type}
//                                                         label={label}
//                                                         name={name}
//                                                         id={name}
//                                                         ref={(r: HTMLInputElement) => {
//                                                             if (refCallback) refCallback(r);
//                                                         }}
//                                                         className={className}
//                                                         isInvalid={!!fieldState.error}
//                                                         {...(register ? register(name) : {})}
//                                                         {...otherProps}
//                                                     />
//
//                                                     {fieldState.error?.message && (
//                                                         <Form.Control.Feedback type="invalid">
//                                                             {fieldState.error?.message}
//                                                         </Form.Control.Feedback>
//                                                     )}
//                                                 </Form.Group>
//                                             </>
//                                         ) : (
//                                             <Form.Group className={containerClass}>
//                                                 {label ? (
//                                                     <Form.Label className={labelClassName}>{label}</Form.Label>
//                                                 ) : null}
//
//                                                 <Form.Control
//                                                     {...field}
//                                                     type={type}
//                                                     placeholder={placeholder}
//                                                     name={name}
//                                                     id={name}
//                                                     as={comp}
//                                                     ref={(r: HTMLInputElement) => {
//                                                         if (refCallback) refCallback(r);
//                                                     }}
//                                                     className={className}
//                                                     isInvalid={!!(errors && errors[name])}
//                                                     {...(register ? register(name) : {})}
//                                                     rows={rows}
//                                                     {...otherProps}
//                                                     autoComplete={name}
//                                                 >
//                                                     {children ? children : null}
//                                                 </Form.Control>
//
//                                                 {fieldState.error?.message && (
//                                                     <Form.Control.Feedback type="invalid">
//                                                         {fieldState.error?.message}
//                                                     </Form.Control.Feedback>
//                                                 )}
//                                             </Form.Group>
//                                         )}
//                                     </>
//                                 )}
//                             </>
//                         )}
//                     </>
//                 )}
//             />
//         </>
//     );
// };
//
// export default FormInput;

import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import classNames from "classnames";
/* Password Input */
const PasswordInput = ({
  name,
  placeholder,
  refCallback,
  errors,
  control,
  register,
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return <>
            <InputGroup className="mb-0">
                <Form.Control type={showPassword ? "text" : "password"} placeholder={placeholder} name={name} id={name} as="input" ref={r => {
        if (refCallback) refCallback(r);
      }} className={className} isInvalid={errors && errors[name] ? true : false} {...register ? register(name) : {}} autoComplete={name} />
                <div className={classNames("input-group-text", "input-group-password", {
        "show-password": showPassword
      })} data-password={showPassword ? "true" : "false"}>
          <span className="password-eye" onClick={() => {
          setShowPassword(!showPassword);
        }}></span>
                </div>
            </InputGroup>
        </>;
};
const FormInput = ({
  label,
  type,
  name,
  placeholder,
  register,
  errors,
  control,
  className,
  labelClassName,
  containerClass,
  refCallback,
  children,
  rows,
  ...otherProps
}) => {
  // handle input type
  const comp = type === "textarea" ? "textarea" : type === "select" ? "select" : "input";
  return <>
            {type === "hidden" ? <input type={type} name={name} {...register ? register(name) : {}} {...otherProps} /> : <>
                    {type === "password" ? <>
                            <Form.Group className={containerClass}>
                                {label ? <>
                                        {" "}
                                        <Form.Label className={labelClassName}>
                                            {label}
                                        </Form.Label>{" "}
                                        {children}{" "}
                                    </> : null}
                                <PasswordInput name={name} placeholder={placeholder} refCallback={refCallback} errors={errors} register={register} className={className} />

                                {errors && errors[name] ? <Form.Control.Feedback type="invalid" className="d-block">
                                        {errors[name]["message"]}
                                    </Form.Control.Feedback> : null}
                            </Form.Group>
                        </> : <>
                            {type === "checkbox" || type === "radio" ? <>
                                    <Form.Group className={containerClass}>
                                        <Form.Check type={type} label={label} name={name} id={name} ref={r => {
              if (refCallback) refCallback(r);
            }} className={className} isInvalid={errors && errors[name] ? true : false} {...register ? register(name) : {}} {...otherProps} />

                                        {errors && errors[name] ? <Form.Control.Feedback type="invalid">
                                                {errors[name]["message"]}
                                            </Form.Control.Feedback> : null}
                                    </Form.Group>
                                </> : <Form.Group className={containerClass}>
                                    {label ? <Form.Label className={labelClassName}>{label}</Form.Label> : null}

                                    <Form.Control type={type} placeholder={placeholder} name={name} id={name} as={comp} ref={r => {
            if (refCallback) refCallback(r);
          }} className={className} isInvalid={errors && errors[name] ? true : false} {...register ? register(name) : {}} rows={rows} {...otherProps} autoComplete={name}>
                                        {children ? children : null}
                                    </Form.Control>

                                    {errors && errors[name] ? <Form.Control.Feedback type="invalid">
                                            {errors[name]["message"]}
                                        </Form.Control.Feedback> : null}
                                </Form.Group>}
                        </>}
                </>}
        </>;
};
export default FormInput;