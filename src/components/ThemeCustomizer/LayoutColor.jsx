import { Form } from "react-bootstrap";
const LayoutColor = ({
  changeLayoutTheme,
  theme
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Color Scheme</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="layout-color" id="light-mode-check" value={'light'} onChange={e => changeLayoutTheme(e.target.value)} checked={theme === 'light'} />
                <Form.Check.Label htmlFor="light-mode-check">
                    Light Mode
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="layout-color" id="dark-mode-check" value={'dark'} onChange={e => changeLayoutTheme(e.target.value)} checked={theme === 'dark'} />
                <Form.Check.Label htmlFor="dark-mode-check">Dark Mode</Form.Check.Label>
            </Form.Check>
        </>;
};
export default LayoutColor;