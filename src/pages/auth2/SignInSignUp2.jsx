import { Button, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

// components
import { VerticalForm, FormInput } from "@/components";
import AuthLayout from "./AuthLayout";

/* bottom link */
const BottomLink = () => {
  const {
    t
  } = useTranslation();
  return <footer className="footer footer-alt">
            <p className="text-muted">
                {t("2018 - " + new Date().getFullYear() + " © UBold theme by")}{" "}
                <Link to="#" className="text-muted">
                    {t("Coderthemes")}
                </Link>
            </p>
        </footer>;
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
const SignInSignUp2 = () => {
  const {
    t
  } = useTranslation();
  return <>
            <AuthLayout isCombineForm={true} bottomLinks={<BottomLink />}>
                <Tab.Container id="left-tabs-example" defaultActiveKey="login">
                    <Nav variant="tabs" className="nav-bordered">
                        <Nav.Item as="li">
                            <Nav.Link className="cursor-pointer" eventKey="login">
                                {t("Log In")}
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                            <Nav.Link className="cursor-pointer" eventKey="signup">
                                {t("Sign Up")}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        {/* login form */}
                        <Tab.Pane eventKey="login">
                            <p className="text-muted mb-3">
                                {t("Enter your email address and password to access account.")}
                            </p>

                            <VerticalForm onSubmit={() => {}} defaultValues={{}}>
                                <FormInput label="Username" type="text" name="username" placeholder="Enter your Username" containerClass={"mb-3"} />
                                <FormInput label="Password" type="password" name="password" placeholder="Enter your password" containerClass={"mb-3"}>
                                    <Link to="/auth/forget-password" className="text-muted float-end">
                                        <small>{t("Forgot your password?")}</small>
                                    </Link>
                                </FormInput>

                                <FormInput label="Remember me" type="checkbox" name="checkbox" containerClass={"mb-3"} />

                                <div className="d-grid mb-0 text-center">
                                    <Button variant="primary" type="submit">
                                        {t("Log In")}
                                    </Button>
                                </div>

                                {/* social links */}
                                <div className="text-center mt-4">
                                    <p className="text-muted font-16">{t("Sign in with")}</p>
                                    <SocialLinks />
                                </div>
                            </VerticalForm>
                        </Tab.Pane>

                        {/* sign up form */}
                        <Tab.Pane eventKey="signup">
                            <p className="text-muted mb-3">
                                {t("Don't have an account? Create your account, it takes less than a minute")}
                            </p>
                            <VerticalForm onSubmit={() => {}} defaultValues={{}}>
                                <FormInput label={t("Full Name")} type="text" name="fullname" placeholder={t("Enter your name")} containerClass={"mb-3"} />
                                <FormInput label={t("Email address")} type="email" name="email" placeholder={t("Enter your email")} containerClass={"mb-3"} />
                                <FormInput label={t("Password")} type="password" name="password" placeholder={t("Enter your password")} containerClass={"mb-3"} />
                                <FormInput label={t("I accept Terms and Conditions")} type="checkbox" name="checkboxsignup" containerClass={"mb-3 text-muted"} />

                                <div className="mb-0 d-grid text-center">
                                    <Button variant="primary" type="submit">
                                        {t("Sign Up")}
                                    </Button>
                                </div>

                                {/* social links */}
                                <div className="text-center mt-4">
                                    <p className="text-muted font-16">{t("Sign up with")}</p>
                                    <SocialLinks />
                                </div>
                            </VerticalForm>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </AuthLayout>
        </>;
};
export default SignInSignUp2;