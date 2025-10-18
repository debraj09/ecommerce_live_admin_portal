import classNames from "classnames";
import { Col, Row } from "react-bootstrap";

// dummy data

const NewIcons = ({
  newIcons
}) => {
  return <>
      <Row className="icon-list-demo">
        {(newIcons || []).map((icon, index) => {
        return <Col key={index} sm={6} md={4} lg={3}>
              <i className={classNames("mdi", "mdi-" + icon.name)}></i>
              <span>mdi-{icon.name}</span>
            </Col>;
      })}
      </Row>
    </>;
};
export default NewIcons;