import React from "react";
import SimpleBar from "simplebar-react";
import classNames from "classnames";
/**
 * MessageList
 */
const MessageList = props => {
  const children = props.children || null;
  return <SimpleBar style={{
    maxHeight: "407px"
  }}>
      <div className={classNames("inbox-widget", props.className)}>
        {children}
      </div>
    </SimpleBar>;
};
export default MessageList;