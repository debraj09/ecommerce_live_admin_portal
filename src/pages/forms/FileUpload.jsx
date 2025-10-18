import React from "react";
import { Row, Col, Card } from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";
import DropzoneFormInput from "@/components/DropzoneFormInput";
const FileUpload = () => {
  return <React.Fragment>
      <PageTitle breadCrumbItems={[{
      label: "Forms",
      path: "/forms/upload"
    }, {
      label: "Form Upload",
      path: "/forms/upload",
      active: true
    }]} title={"Form Upload"} />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">Dropzone File Upload</h4>

              <p className="text-muted font-13 m-b-30">
                DropzoneJS is an open source library that provides drag’n’drop
                file uploads with image previews.
              </p>

              {/* <FileUploader
                onFileUpload={(files) => {
                  console.log("Uploaded files - ", files);
                }}
               /> */}
              <DropzoneFormInput className="py-5" text="Drop your images here, or click to browse" helpText={<span className="text-muted fs-13 ">(1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed )</span>} showPreview />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>;
};
export default FileUpload;