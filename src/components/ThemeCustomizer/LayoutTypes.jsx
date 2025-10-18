import { Form } from "react-bootstrap";
const LayoutTypes = ({
  changeOrientation,
  orientation
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Layout</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" onChange={e => changeOrientation(e.target.value)} name="orientation" value={'vertical'} id="vertical-layout" checked={orientation === 'vertical'} />
                <Form.Check.Label htmlFor="vertical-layout">
                    Vertical Layout
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" onChange={e => changeOrientation(e.target.value)} name="orientation" value={'horizontal'} id="horizontal-layout" checked={orientation === 'horizontal'} />
                <Form.Check.Label htmlFor="horizontal-layout">
                    Horizontal Layout
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" onChange={e => changeOrientation(e.target.value)} name="orientation" value={'two-column'} id="two-column-layout" checked={orientation === 'two-column'} />
                <Form.Check.Label htmlFor="two-column-layout">
                    Two Column Layout
                </Form.Check.Label>
            </Form.Check>
        </>;
};
export default LayoutTypes;