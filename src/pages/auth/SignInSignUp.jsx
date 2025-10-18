import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import { VerticalForm, FormInput } from "@/components";
import AuthLayout from "./AuthLayout";
const SignInSignUp = () => {
  const {
    t
  } = useTranslation();
  return <>
            <AuthLayout isCombineForm={true}>
                <Row>
                    <Col lg={6}>
                        <div className="p-sm-3">
                            <h4 className="mt-0">{t("Sign In")}</h4>
                            <p className="text-muted mb-4">
                                {t("Enter your email address and password to access account.")}
                            </p>

                            <VerticalForm onSubmit={() => {}} defaultValues={{}}>
                                <FormInput label="Username" type="text" name="username" placeholder="Enter your Username" containerClass={"mb-3"} />
                                <FormInput label="Password" type="password" name="loginpassword" placeholder="Enter your password" containerClass={"mb-3"}>
                                    <Link to="/auth/forget-password" className="text-muted float-end">
                                        <small>{t("Forgot your password?")}</small>
                                    </Link>
                                </FormInput>

                                <div className="mb-3">
                                    <Button variant="primary" type="submit" className="btn btn-primary btn-sm float-sm-end">
                                        {t("Log In")}
                                    </Button>
                                    <FormInput label="Remember me" type="checkbox" name="checkbox" containerClass={"pt-1"} />
                                </div>
                            </VerticalForm>
                        </div>
                    </Col>

                    <Col lg={6}>
                        <div className="p-sm-3">
                            <h4 className="mt-0">{t("Free Sign Up")}</h4>
                            <p className="text-muted mb-4">
                                {t("Don't have an account? Create your account, it takes less than a minute")}
                            </p>

                            <VerticalForm onSubmit={() => {}} defaultValues={{}}>
                                <FormInput label={t("Full Name")} type="text" name="fullname" placeholder={t("Enter your name")} containerClass={"mb-3"} />
                                <FormInput label={t("Email address")} type="email" name="email" placeholder={t("Enter your email")} containerClass={"mb-3"} />
                                <FormInput label={t("Password")} type="password" name="password" placeholder={t("Enter your password")} containerClass={"mb-3"} />

                                <div className="mb-0">
                                    <Button variant="success" type="submit" className="btn btn-success btn-sm float-sm-end">
                                        {t("Sign Up")}
                                    </Button>
                                    <FormInput label={t("I accept Terms and Conditions")} type="checkbox" name="checkboxsignup" containerClass={"pt-1"} />
                                </div>
                            </VerticalForm>
                        </div>
                    </Col>
                </Row>
            </AuthLayout>
        </>;
};
export default SignInSignUp;