import { Form } from "react-bootstrap";
const LeftSideBarTheme = ({
  changeLeftSidebarTheme,
  theme
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Left Sidebar Color</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="theme" id="light-check" value={'light'} onChange={e => changeLeftSidebarTheme(e.target.value)} checked={theme === 'light'} />
                <Form.Check.Label htmlFor="light-check">Light</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="theme" id="dark-check" value={'dark'} onChange={e => changeLeftSidebarTheme(e.target.value)} checked={theme === 'dark'} />
                <Form.Check.Label htmlFor="dark-check">Dark</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="theme" id="brand-check" value={'brand'} onChange={e => changeLeftSidebarTheme(e.target.value)} checked={theme === 'brand'} />
                <Form.Check.Label htmlFor="brand-check">Brand</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="theme" id="gradient-check" value={'gradient'} onChange={e => changeLeftSidebarTheme(e.target.value)} checked={theme === 'gradient'} />
                <Form.Check.Label htmlFor="gradient-check">Gradient</Form.Check.Label>
            </Form.Check>
        </>;
};
export default LeftSideBarTheme;