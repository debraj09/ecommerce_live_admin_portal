import { Button, Row, Col, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

// components

import AuthLayout from "./AuthLayout";
import useLogin from "@/hooks/useLogin.js";
import { Controller } from "react-hook-form";
import Feedback from "react-bootstrap/esm/Feedback";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/* bottom links */
const BottomLink = () => {
  const {
    t
  } = useTranslation();
  return <Row className="mt-3">
            <Col className="text-center">
                <p>
                    <Link to={"/auth/forget-password"} className="text-white-50 ms-1">
                        {t("Forgot your password?")}
                    </Link>
                </p>
                <p className="text-white-50">
                    {t("Don't have an account?")}{" "}
                    <Link to={"/auth/register"} className="text-white ms-1">
                        <b>{t("Sign Up")}</b>
                    </Link>
                </p>
            </Col>
        </Row>;
};

/* social links */
const SocialLinks = () => {
  const socialLinks = [{
    variant: "primary",
    icon: "facebook"
  }, {
    variant: "danger",
    icon: "google"
  }, {
    variant: "info",
    icon: "twitter"
  }, {
    variant: "secondary",
    icon: "github"
  }];
  return <>
            <ul className="social-list list-inline mt-3 mb-0">
                {(socialLinks || []).map((item, index) => {
        return <li key={index} className="list-inline-item">
                            <Link to="#" className={classNames("social-list-item", "border-" + item.variant, "text-" + item.variant)}>
                                <i className={classNames("mdi", "mdi-" + item.icon)}></i>
                            </Link>
                        </li>;
      })}
            </ul>
        </>;
};
const Login = () => {
  const {
    t
  } = useTranslation();
  const {
    login,
    control
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  return <>
            <AuthLayout helpText={t("Enter your email address and password to access admin panel.")} bottomLinks={<BottomLink />}>

                <form onSubmit={login}>

                    <div className="mb-3">
                        <Controller name="email" control={control} render={({
            field,
            fieldState
          }) => <FormGroup>
                                    <FormLabel htmlFor="email">
                                        {t("Email")}
                                    </FormLabel>
                                    <FormControl id="email" {...field} isInvalid={Boolean(fieldState.error?.message)} />
                                    {fieldState.error?.message && <Feedback type="invalid" className="text-danger">{fieldState.error?.message}</Feedback>}
                                </FormGroup>} />
                    </div>

                    <div className="mb-3">
                        <Controller name="password" control={control} render={({
            field,
            fieldState
          }) => <FormGroup>
                                    <FormLabel htmlFor="password">
                                        {t("Password")}
                                    </FormLabel>

                                    <div className="position-relative">
                                        <FormControl id="password" type={showPassword ? 'text' : 'password'} {...field} isInvalid={Boolean(fieldState.error?.message)} />
                                        {fieldState.error?.message && <Feedback type="invalid" className="text-danger">{fieldState.error?.message}</Feedback>}
                                        <span className="d-flex position-absolute top-50 end-0 translate-middle-y p-0 pe-2 me-2" onClick={() => setShowPassword(!showPassword)}>
                                      {!fieldState.error && (showPassword ? <FiEye height={18} width={18} className="cursor-pointer" /> : <FiEyeOff height={18} width={18} className="cursor-pointer" />)}
                                    </span>
                                    </div>
                                </FormGroup>} />
                    </div>

                    <div className="text-center d-grid">
                        <Button variant="primary" type="submit">
                            {t("Log In")}
                        </Button>
                    </div>
                </form>

                <div className="text-center">
                    <h5 className="mt-3 text-muted">{t("Sign in with")}</h5>
                    <SocialLinks />
                </div>
            </AuthLayout>
        </>;
};
export default Login;