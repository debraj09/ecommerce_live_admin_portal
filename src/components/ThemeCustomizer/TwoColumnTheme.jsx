import {Form} from "react-bootstrap";

const TwoColumnTheme = ({
                            changeTwoColumnTheme,
                            theme
                        }) => {
    return <>
        <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Menu Icon Color</h6>

        <Form.Check className="form-check form-switch mb-1">
            <Form.Check.Input type="radio" name="twocolumn-theme" id="twocolumn-light-check" value={'light'}
                              onChange={e => changeTwoColumnTheme(e.target.value)} checked={theme === 'light'}/>
            <Form.Check.Label htmlFor="twocolumn-light-check">
                Light
            </Form.Check.Label>
        </Form.Check>

        <Form.Check className="form-check form-switch mb-1">
            <Form.Check.Input type="radio" name="twocolumn-theme" id="twocolumn-dark-check" value={'dark'}
                              onChange={e => changeTwoColumnTheme(e.target.value)} checked={theme === 'dark'}/>
            <Form.Check.Label htmlFor="twocolumn-dark-check">Dark</Form.Check.Label>
        </Form.Check>

        <Form.Check className="form-check form-switch mb-1">
            <Form.Check.Input type="radio" name="twocolumn-theme" id="twocolumn-brand-check" value={'brand'}
                              onChange={e => changeTwoColumnTheme(e.target.value)} checked={theme === 'brand'}/>
            <Form.Check.Label htmlFor="twocolumn-brand-check">
                Brand
            </Form.Check.Label>
        </Form.Check>

        <Form.Check className="form-check form-switch mb-1">
            <Form.Check.Input type="radio" name="twocolumn-theme" id="twocolumn-gradient-check" value={'gradient'}
                              onChange={e => changeTwoColumnTheme(e.target.value)} checked={theme === 'gradient'}/>
            <Form.Check.Label htmlFor="twocolumn-gradient-check">
                Gradient
            </Form.Check.Label>
        </Form.Check>
    </>;
};
export default TwoColumnTheme;