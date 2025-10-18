import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// components
import { VerticalForm, FormInput } from "@/components";
import AuthLayout from "./AuthLayout";

/* bottom link */
const BottomLink = () => {
  const {
    t
  } = useTranslation();
  return <Row className="mt-3">
            <Col className="text-center">
                <p className="text-white-50">
                    {t("Back to")}{" "}
                    <Link to={"/auth/login"} className="text-white ms-1">
                        <b>{t("Log in")}</b>
                    </Link>
                </p>
            </Col>
        </Row>;
};
const ForgetPassword = () => {
  const {
    t
  } = useTranslation();
  return <>
            <AuthLayout helpText={t("Enter your email address and we'll send you an email with instructions to reset your password.")} bottomLinks={<BottomLink />}>


                <VerticalForm onSubmit={() => {}}>
                    <FormInput label={t("Username")} type="text" name="username" placeholder={t("Enter your username")} containerClass={"mb-3"} />

                    <div className="d-grid text-center">
                        <Button variant="primary" type="submit">
                            {t("Reset Password")}
                        </Button>
                    </div>
                </VerticalForm>

            </AuthLayout>
        </>;
};
export default ForgetPassword;