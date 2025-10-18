import { Form } from "react-bootstrap";
const TopBarTheme = ({
  changeTopBarTheme,
  theme
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Topbar</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="topbar-color" id="lighttopbar-check" value={'light'} onChange={e => changeTopBarTheme(e.target.value)} checked={theme === 'light'} />
                <Form.Check.Label htmlFor="lighttopbar-check">Light</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="topbar-color" id="darktopbar-check" value={'dark'} onChange={e => changeTopBarTheme(e.target.value)} checked={theme === 'dark'} />
                <Form.Check.Label htmlFor="darktopbar-check">Dark</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="topbar-color" id="brandtopbar-check" value={'brand'} onChange={e => changeTopBarTheme(e.target.value)} checked={theme === 'brand'} />
                <Form.Check.Label htmlFor="brandtopbar-check">Brand</Form.Check.Label>
            </Form.Check>
        </>;
};
export default TopBarTheme;