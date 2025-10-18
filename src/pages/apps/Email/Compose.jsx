import { useState } from "react";
import { Row, Col, Card, Dropdown, ButtonGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

// styles

// components
import PageTitle from "../../../components/PageTitle";
import { FormInput } from "../../../components/";
import LeftBar from "./LeftBar";
import ReactQuill from "react-quill-new";
const Compose = () => {
  const [value, setValue] = useState('<h3><span class="ql-size-large">Hello World!</span></h3>\n' + '    <p><br/></p>\n' + '    <h3>This is a simple editable area.</h3>\n' + '    <p><br/></p>\n' + '    <ul>\n' + '      <li>Select a text to reveal the toolbar.</li>\n' + '      <li>Edit rich document on-the-fly, so elastic!</li>\n' + '    </ul>\n' + '<p><br/></p>\n' + '<p>End of simple area</p>');
  const modules = {
    toolbar: [[{
      font: []
    }, {
      size: []
    }], ['bold', 'italic', 'underline', 'strike'], [{
      color: []
    }, {
      background: []
    }], [{
      script: 'super'
    }, {
      script: 'sub'
    }], [{
      header: [false, 1, 2, 3, 4, 5, 6]
    }, 'blockquote', 'code-block'], [{
      list: 'ordered'
    }, {
      list: 'bullet'
    }, {
      indent: '-1'
    }, {
      indent: '+1'
    }], ['direction', {
      align: []
    }], ['link', 'image', 'video'], ['clean']]
  };
  // const [editorState, setEditorState] = useState<any>();

  // useEffect(() => {
  //   const html =
  //     '<h3><span className="ql-size-large">Hello World!</span></h3><h3>This is an simple editable area.</h3><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of simple area</p>';
  //   const contentBlock = htmlToDraft(html);
  //   if (contentBlock) {
  //     const contentState = ContentState.createFromBlockArray(
  //       contentBlock.contentBlocks
  //     );
  //     setEditorState(EditorState.createWithContent(contentState));
  //   }
  // }, []);

  // const schemaResolver = yupResolver(
  //   yup.object().shape({
  //     to: yup.string().required("Please specify to email"),
  //     subject: yup.string().required("Please specify subject"),
  //   })
  // );

  // /**
  //  * Handles the save
  //  * @param {*} event
  //  * @param {*} values
  //  */
  // const handleEmailSave = (event: any, values: any) => {
  //   const body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   console.log({ ...values, body });
  // };

  // /**
  //  * On editor body change
  //  */
  // const onEditorStateChange = (editorStates: any) => {
  //   setEditorState(editorStates);
  // };

  return <>
      <PageTitle breadCrumbItems={[{
      label: "Email",
      path: "/apps/email/compose"
    }, {
      label: "Email Compose",
      path: "/apps/email/compose",
      active: true
    }]} title={"Email Compose"} />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="inbox-leftbar">
                <Link to="/apps/email/inbox" className="btn btn-danger w-100 waves-effect waves-light">
                  Inbox
                </Link>

                <LeftBar />
              </div>

              <div className="inbox-rightbar">
                <ButtonGroup className="me-1">
                  <OverlayTrigger placement="bottom" overlay={<Tooltip id="archived">Archived</Tooltip>}>
                    <Button variant="light" className="btn-sm waves-effect">
                      <i className="mdi mdi-archive font-18"></i>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip id="spam">Spam</Tooltip>}>
                    <Button variant="light" className="btn-sm waves-effect">
                      <i className="mdi mdi-alert-octagon font-18"></i>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger key="bottm" placement="bottom" overlay={<Tooltip id="delete">Delete</Tooltip>}>
                    <Button variant="light" className="btn-sm waves-effect">
                      <i className="mdi mdi-delete-variant font-18"></i>
                    </Button>
                  </OverlayTrigger>
                </ButtonGroup>

                <Dropdown className="btn-group me-1">
                  <Dropdown.Toggle className="btn btn-light btn-sm waves-effect">
                    <i className="mdi mdi-folder font-18"></i>{" "}
                    <i className="mdi mdi-chevron-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <span className="dropdown-header">Move to:</span>
                    <Dropdown.Item>Social</Dropdown.Item>
                    <Dropdown.Item>Promotions</Dropdown.Item>
                    <Dropdown.Item>Updates</Dropdown.Item>
                    <Dropdown.Item>Forums</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown className="btn-group me-1">
                  <Dropdown.Toggle className="btn btn-light btn-sm waves-effect">
                    <i className="mdi mdi-label font-18"></i>{" "}
                    <i className="mdi mdi-chevron-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <span className="dropdown-header">Label as:</span>
                    <Dropdown.Item>Social</Dropdown.Item>
                    <Dropdown.Item>Promotions</Dropdown.Item>
                    <Dropdown.Item>Updates</Dropdown.Item>
                    <Dropdown.Item>Forums</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown className="btn-group me-1">
                  <Dropdown.Toggle className="btn btn-light btn-sm waves-effect">
                    <i className="mdi mdi-dots-horizontal font-18"></i> More{" "}
                    <i className="mdi mdi-chevron-down"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <span className="dropdown-header">More Options :</span>
                    <Dropdown.Item>Mark as Unread</Dropdown.Item>
                    <Dropdown.Item>Add to Tasks</Dropdown.Item>
                    <Dropdown.Item>Add Star</Dropdown.Item>
                    <Dropdown.Item>Mute</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="mt-4">
                  <FormInput type="email" name="to" placeholder="example@email.com" containerClass={"mb-3"} />
                  <FormInput type="text" name="subject" placeholder="Your subject" containerClass={"mb-3"} />
                   
                 
                  <div className="mb-2">
                  <ReactQuill className="d-flex flex-column" theme="snow" value={value} onChange={setValue} modules={modules} />
                  </div>
                  
                  <div className="text-end">
                    <Button variant="success" className="waves-effect waves-light me-1">
                      <i className="mdi mdi-content-save-outline"></i>
                    </Button>
                    <Button variant="success" className="waves-effect waves-light me-1">
                      <i className="mdi mdi-delete"></i>
                    </Button>
                    <Button variant="primary" type="submit">
                      <span>Send</span> <i className="mdi mdi-send ms-2"></i>
                    </Button>
                  </div>
                  {/* </VerticalForm> */}

                </div>
              </div>

              <div className="clearfix"></div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>;
};
export default Compose;