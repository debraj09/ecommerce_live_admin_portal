import { Form } from "react-bootstrap";
const LeftSideBarSize = ({
  changeLeftSideBarSize,
  size
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Left Sidebar Size</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="leftsidebar-size" id="default-check" value={'default'} onChange={e => changeLeftSideBarSize(e.target.value)} checked={size === 'default'} />
                <Form.Check.Label htmlFor="default-check">Default</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="leftsidebar-size" id="condensed-check" value={'condensed'} onChange={e => changeLeftSideBarSize(e.target.value)} checked={size === 'condensed'} />
                <Form.Check.Label htmlFor="condensed-check">
                    Condensed <small>(Extra Small size)</small>
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="leftsidebar-size" id="compact-check" value={'compact'} onChange={e => changeLeftSideBarSize(e.target.value)} checked={size === 'compact'} />
                <Form.Check.Label htmlFor="compact-check">
                    Compact <small>(Small size)</small>
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="leftsidebar-size" id="full-check" value={'full'} onChange={e => changeLeftSideBarSize(e.target.value)} checked={size === 'full'} />
                <Form.Check.Label htmlFor="full-check">Full Layout</Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" name="leftsidebar-size" id="fullscreen-check" value={'fullscreen'} onChange={e => changeLeftSideBarSize(e.target.value)} checked={size === 'fullscreen'} />
                <Form.Check.Label htmlFor="fullscreen-check">
                    Full Screen Layout
                </Form.Check.Label>
            </Form.Check>
        </>;
};
export default LeftSideBarSize;