import { Button } from "react-bootstrap";
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
        {t("Don't have an account?")}{" "}
        <Link to={"/auth/register2"} className="text-muted ms-1">
          <b>{t("Sign Up")}</b>
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
const Login2 = () => {
  const {
    t
  } = useTranslation();
  return <>

      <AuthLayout bottomLinks={<BottomLink />}>
        <h4 className="mt-0">{t("Sign In")}</h4>
        <p className="text-muted mb-4">
          {t("Enter your email address and password to access account.")}
        </p>

        <VerticalForm onSubmit={() => {}} defaultValues={{
        username: "test",
        password: "test"
      }}>
          <FormInput label={t("Username")} type="text" name="username" placeholder={t("Enter your Username")} containerClass={"mb-3"} />
          <FormInput label={t("Password")} type="password" name="password" placeholder={t("Enter your password")} containerClass={"mb-3"}>
            <Link to="/auth/forget-password2" className="text-muted float-end">
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
      </AuthLayout>
    </>;
};
export default Login2;