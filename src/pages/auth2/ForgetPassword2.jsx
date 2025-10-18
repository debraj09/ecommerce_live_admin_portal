import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import { VerticalForm, FormInput } from "@/components";
import AuthLayout from "./AuthLayout";

/* bottom links */
const BottomLink = () => {
  const {
    t
  } = useTranslation();
  return <footer className="footer footer-alt">
            <p className="text-muted">
                {t("Back to")}{" "}
                <Link to={"/auth/login2"} className="text-muted ms-1">
                    <b>{t("Log in")}</b>
                </Link>
            </p>
        </footer>;
};
const ForgetPassword2 = () => {
  const {
    t
  } = useTranslation();
  return <>
            <AuthLayout bottomLinks={<BottomLink />}>
                <h4 className="mt-0">{t("Recover Password")}</h4>
                <p className="text-muted mb-4">
                    {t("Enter your email address and we'll send you an email with instructions to reset your password")}
                </p>


                <VerticalForm onSubmit={() => {}}>
                    <FormInput label={t("Username")} type="text" name="username" placeholder={t("Enter your Username")} containerClass={"mb-3"} />

                    <div className="mb-0 text-center d-grid">
                        <Button variant="primary" type="submit">
                            {t("Reset Password")}
                        </Button>
                    </div>
                </VerticalForm>

            </AuthLayout>
        </>;
};
export default ForgetPassword2;