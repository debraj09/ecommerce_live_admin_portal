import classNames from "classnames";
/**
 * MessageItem
 */
const MessageItem = props => {
  const children = props.children || null;
  return <div className={classNames("inbox-item", props.className)}>{children}</div>;
};
export default MessageItem;