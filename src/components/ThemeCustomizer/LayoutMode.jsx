import { Form } from "react-bootstrap";
const LayoutMode = ({
  changeMode,
  mode
}) => {
  return <>
            <h6 className="fw-medium font-14 mt-4 mb-2 pb-1">Layout Mode</h6>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" onChange={e => changeMode(e.target.value)} name="layout-mode" value={'fluid'} id="default-layout-mode" checked={mode === 'fluid'} />
                <Form.Check.Label htmlFor="default-layout-mode">
                    Default Layout
                </Form.Check.Label>
            </Form.Check>

            <Form.Check className="form-check form-switch mb-1">
                <Form.Check.Input type="radio" onChange={e => changeMode(e.target.value)} name="layout-mode" value={'detached'} id="detached-layout-mode" checked={mode === 'detached'} />
                <Form.Check.Label htmlFor="detached-layout-mode">
                    Detached Layout
                </Form.Check.Label>
            </Form.Check>
        </>;
};
export default LayoutMode;