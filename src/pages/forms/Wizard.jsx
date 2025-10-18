import React, { useRef, useState } from "react";
import { Button, Card, Col, Form, ProgressBar, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import StepWizard from 'react-step-wizard';
import { Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// components
import PageTitle from "@/components/PageTitle";
const BasicWizard = () => {
  const wizardRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const nextStep = () => {
    if (wizardRef.current) {
      wizardRef.current.nextStep();
      setActiveStep(prev => prev + 1);
    }
  };
  const prevStep = () => {
    if (wizardRef.current) {
      wizardRef.current.previousStep();
      setActiveStep(prev => prev - 1);
    }
  };
  return <Card>
      <Card.Body className="overflow-hidden">
        <h4 className="header-title mb-3"> Basic Wizard</h4>

        {/* <Wizard>
          <Steps> */}
        <StepWizard instance={wizard => {
        wizardRef.current = wizard;
      }} onStepChange={stats => setActiveStep(stats.activeStep)}>
          <div>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="exampleEmail" column md={3}>
                  Email
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="email" name="exampleEmail" id="exampleEmail" placeholder="Enter email" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="examplePassword" column md={3}>
                  Password
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="password" name="examplePassword" id="examplePassword" placeholder="password placeholder" defaultValue="12345" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="examplerePassword" column md={3}>
                  Re-Password
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="password" name="exampleRepassword" id="examplerePassword" placeholder="password" defaultValue="12345" />
                </Col>
              </Form.Group>

              <ul className="list-inline wizard mb-0">
                <li className="next list-inline-item float-end">
                  <Button onClick={nextStep} disabled={activeStep === 3} variant="success">
                    Next
                  </Button>
                </li>
              </ul>
            </Form>
          </div>
          <div>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="fname" column md={3}>
                  First Name
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="text" name="fname" id="fname" placeholder="Enter first name" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="lname" column md={3}>
                  Last Name
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="text" name="lname" id="lname" placeholder="enter last name" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label htmlFor="phone" column md={3}>
                  Phone Number
                </Form.Label>
                <Col md={9}>
                  <Form.Control type="text" name="phone" id="phone" placeholder="enter phone number" />
                </Col>
              </Form.Group>

              <ul className="list-inline wizard mb-0">
                <li className="previous list-inline-item">
                  <Button onClick={prevStep} disabled={activeStep === 1} variant="info">
                    Previous
                  </Button>
                </li>
                <li className="next list-inline-item float-end">
                  <Button onClick={nextStep} disabled={activeStep === 3} variant="success">
                    Next
                  </Button>
                </li>
              </ul>
            </Form>
          </div>
          <div>
            <Row>
              <Col sm={12}>
                <div className="text-center">
                  <h2 className="mt-0">
                    <i className="mdi mdi-check-all"></i>
                  </h2>
                  <h3 className="mt-0">Thank you !</h3>

                  <p className="w-75 mb-2 mx-auto">
                    Quisque nec turpis at urna dictum luctus. Suspendisse
                    convallis dignissim eros at volutpat. In egestas mattis
                    dui. Aliquam mattis dictum aliquet.
                  </p>

                  <div className="mb-3">
                    <Form.Check type="checkbox" className="d-inline-block">
                      <Form.Check.Input type="checkbox" />
                      <Form.Check.Label>
                        I agree with the Terms and Conditions
                      </Form.Check.Label>
                    </Form.Check>
                  </div>
                </div>
              </Col>

              <Col sm={12}>
                <ul className="list-inline wizard mb-0">
                  <li className="previous list-inline-item">
                    <Button onClick={prevStep} disabled={activeStep === 1} variant="info">
                      Previous
                    </Button>
                  </li>

                  <li className="next list-inline-item float-end">
                    <Button variant="success">Submit</Button>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </StepWizard>
        {/* </Steps>
         </Wizard> */}
      </Card.Body>
    </Card>;
};
const WizardWithProgressbar = () => {
  const wizardRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const nextStep = () => {
    if (wizardRef.current) {
      wizardRef.current.nextStep();
      setActiveStep(prev => prev + 1);
    }
  };
  const prevStep = () => {
    if (wizardRef.current) {
      wizardRef.current.previousStep();
      setActiveStep(prev => prev - 1);
    }
  };
  return <Card>
      <Card.Body className="overflow-hidden">
        <h4 className="header-title mb-3">Wizard with Progress bar</h4>

        {/* <Wizard
          render={({ step, steps }) => ( */}
        <React.Fragment>
          <ProgressBar animated striped variant="success" now={activeStep / 3 * 100} className="mb-3 progress-sm" />

          <StepWizard instance={wizard => {
          wizardRef.current = wizard;
        }} onStepChange={stats => setActiveStep(stats?.activeStep)}>
            <div>

              <Form>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="exampleEmail" column md={3}>
                    Email
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="email" name="exampleEmail" id="exampleEmail2" placeholder="Enter email" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="examplePassword" column md={3}>
                    Password
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="password" name="password" id="examplePassword2" placeholder="password placeholder" defaultValue="12345" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="examplerePassword" column md={3}>
                    Re-Password
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="password" name="repassword" id="examplerePassword2" placeholder="password" defaultValue="12345" />
                  </Col>
                </Form.Group>

                <ul className="list-inline wizard mb-0">
                  <li className="next list-inline-item float-end">
                    <Button onClick={nextStep} disabled={activeStep === 3} variant="success">
                      Next
                    </Button>
                  </li>
                </ul>
              </Form>
            </div>
            <div>
              <Form>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="fname" column md={3}>
                    First Name
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="text" name="fname" id="fname" placeholder="Enter first name" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="lname" column md={3}>
                    Last Name
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="text" name="lname" id="lname" placeholder="enter last name" />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label htmlFor="phone" column md={3}>
                    Phone Number
                  </Form.Label>
                  <Col md={9}>
                    <Form.Control type="text" name="phone" id="phone" placeholder="enter phone number" />
                  </Col>
                </Form.Group>

                <ul className="list-inline wizard mb-0">
                  <li className="previous list-inline-item">
                    <Button onClick={prevStep} disabled={activeStep === 1} variant="info">
                      Previous
                    </Button>
                  </li>
                  <li className="next list-inline-item float-end">
                    <Button onClick={nextStep} disabled={activeStep === 3} variant="success">
                      Next
                    </Button>
                  </li>
                </ul>
              </Form>
            </div>
            <div>
              <Row>
                <Col sm={12}>
                  <div className="text-center">
                    <h2 className="mt-0">
                      <i className="mdi mdi-check-all"></i>
                    </h2>
                    <h3 className="mt-0">Thank you !</h3>

                    <p className="w-75 mb-2 mx-auto">
                      Quisque nec turpis at urna dictum luctus.
                      Suspendisse convallis dignissim eros at volutpat. In
                      egestas mattis dui. Aliquam mattis dictum aliquet.
                    </p>

                    <div className="mb-3">
                      <Form.Check type="checkbox" className="d-inline-block">
                        <Form.Check.Input type="checkbox" />{" "}
                        <Form.Check.Label>
                          I agree with the Terms and Conditions
                        </Form.Check.Label>
                      </Form.Check>
                    </div>
                  </div>
                </Col>

                <Col sm={12}>
                  <ul className="list-inline wizard mb-0">
                    <li className="previous list-inline-item">
                      <Button onClick={prevStep} disabled={activeStep === 1} variant="info">
                        Previous
                      </Button>
                    </li>

                    <li className="next list-inline-item float-end">
                      <Button variant="success">Submit</Button>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </StepWizard>
        </React.Fragment>
        {/* )} */}
        {/* /> */}
      </Card.Body>
    </Card>;
};
const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Please enter email'),
  password: yup.string().required('Please enter password'),
  fName: yup.string().required('Please enter first name'),
  lName: yup.string().required('Please enter last name')
});
const WizardWithFormValidation = () => {
  const {
    handleSubmit,
    control,
    trigger
  } = useForm({
    resolver: yupResolver(schema)
  });
  const wizardRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const nextStep = async () => {
    // For step 1 validation
    if (activeStep === 1) {
      const isValidStep1 = await trigger(['email', 'password']);
      if (isValidStep1 && wizardRef.current) {
        wizardRef.current.nextStep();
        setActiveStep(prev => prev + 1);
      } else {
        console.log('Step 1 validation failed');
      }
    }

    // For step 2 validation
    if (activeStep === 2) {
      const isValidStep2 = await trigger(['fName', 'lName']);
      if (isValidStep2 && wizardRef.current) {
        wizardRef.current.nextStep();
        setActiveStep(prev => prev + 1);
      } else {
        console.log('Step 2 validation failed');
      }
    }
  };
  const prevStep = () => {
    if (wizardRef.current) {
      wizardRef.current.previousStep();
      setActiveStep(prev => prev - 1);
    }
  };
  const onSubmit = data => {
    console.log('Form Data:', data);
  };
  return <Card>
      <Card.Body className="overflow-hidden">
        <h4 className="header-title mb-3">Wizard with Validation</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ProgressBar animated striped variant="success" now={activeStep / 3 * 100} className="mb-3 progress-sm" />

          <StepWizard instance={wizard => {
          wizardRef.current = wizard;
        }} onStepChange={stats => setActiveStep(stats.activeStep)}>
            {/* Step 1 */}
            <div>
              <Controller control={control} name="email" render={({
              field,
              fieldState
            }) => <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control {...field} type="email" isInvalid={!!fieldState.error} />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </Form.Group>} />
              <Controller control={control} name="password" render={({
              field,
              fieldState
            }) => <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control {...field} type="password" isInvalid={!!fieldState.error} />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </Form.Group>} />
              <ul className="list-inline wizard mb-0">
                <li className="next list-inline-item float-end">
                  <Button onClick={nextStep} type="button" variant="success">
                    Next
                  </Button>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div>
              <Controller control={control} name="fName" render={({
              field,
              fieldState
            }) => <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control {...field} type="text" isInvalid={!!fieldState.error} />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </Form.Group>} />
              <Controller control={control} name="lName" render={({
              field,
              fieldState
            }) => <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control {...field} type="text" isInvalid={!!fieldState.error} />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </Form.Group>} />
              <ul className="list-inline wizard mb-0">
                <li className="previous list-inline-item">
                  <Button onClick={prevStep} type="button" variant="info">
                    Previous
                  </Button>
                </li>
                <li className="next list-inline-item float-end">
                  <Button onClick={nextStep} type="button" variant="success">
                    Next
                  </Button>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div>
              <Row>
                <Col sm={12}>
                  <div className="text-center">
                    <h2>
                      <i className="mdi mdi-check-all"></i>
                    </h2>
                    <h3>Thank you!</h3>
                    <p>
                      Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat.
                    </p>
                  </div>
                </Col>
                <Col sm={12}>
                  <ul className="list-inline wizard mb-0">
                    <li className="previous list-inline-item">
                      <Button onClick={prevStep} type="button" variant="info">
                        Previous
                      </Button>
                    </li>
                    <li className="next list-inline-item float-end">
                      <Button variant="success" type="submit">
                        Submit
                      </Button>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </StepWizard>
        </Form>
      </Card.Body>
    </Card>;
};
const FormWizard = () => {
  return <React.Fragment>
      <PageTitle breadCrumbItems={[{
      label: "Forms",
      path: "/ui/forms/wizard"
    }, {
      label: "Form Wizard",
      path: "/ui/forms/wizard",
      active: true
    }]} title={"Form Wizard"} />

      <Row>
        <Col xl={6}>
          <BasicWizard />
        </Col>

        <Col xl={6}>
          <WizardWithProgressbar />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <WizardWithFormValidation />
        </Col>
      </Row>
    </React.Fragment>;
};
export default FormWizard;