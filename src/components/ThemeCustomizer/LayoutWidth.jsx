import { Form } from "react-bootstrap";
const LayoutWidth = ({
  changeWidth,
  width
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Width</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="width" id="fluid-check" value={'fluid'} onChange={e => changeWidth(e.target.value)} checked={width === 'fluid'} />
                <Form.Check.Label htmlFor="fluid-check">Fluid</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="width" id="boxed-check" value={'boxed'} onChange={e => changeWidth(e.target.value)} checked={width === 'boxed'} />
                <Form.Check.Label htmlFor="boxed-check">Boxed</Form.Check.Label>
            </Form.Check>
        </>;
};
export default LayoutWidth;