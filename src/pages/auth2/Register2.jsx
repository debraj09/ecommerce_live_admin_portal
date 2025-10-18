import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
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
                {t("Already have account?")}{" "}
                <Link to={"/auth/login2"} className="text-muted ms-1">
                    <b>{t("Log In")}</b>
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
const Register2 = () => {
  const {
    t
  } = useTranslation();
  return <>
            <AuthLayout bottomLinks={<BottomLink />}>
                <h4 className="mt-0">{t("Sign Up")}</h4>
                <p className="text-muted mb-4">
                    {t("Don't have an account? Create your account, it takes less than a minute.")}
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
                        <p className="text-muted font-16">{t("Sign up using")}</p>
                        <SocialLinks />
                    </div>
                </VerticalForm>
            </AuthLayout>
        </>;
};
export default Register2;