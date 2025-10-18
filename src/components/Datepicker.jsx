import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import classNames from "classnames";
/* Datepicker with Input */
const DatepickerInput = forwardRef((props, ref) => {
  const onDateValueChange = () => {
    console.log("date value changed");
  };
  return <input type="text" className={classNames("form-control", props.inputClass)} onClick={props.onClick} value={props.value} onChange={onDateValueChange} ref={ref} />;
});

/* Datepicker with Addon Input */
const DatepickerInputWithAddon = forwardRef((props, ref) => <div className="input-group input-group-sm" ref={ref}>
    <input type="text" className={classNames("form-control", props.inputClass)} onClick={props.onClick} value={props.value} readOnly />
    <span className="input-group-text bg-blue border-blue text-white">
      <i className="mdi mdi-calendar-range"></i>
    </span>
  </div>);
const HyperDatepicker = props => {
  // handle custom input
  // ;
  const input = (props.hideAddon || false) === true ? <DatepickerInput inputClass={props.inputClass} value={props.value} /> : <DatepickerInputWithAddon inputClass={props.inputClass} value={props.value} />;
  return <>
      {/* date picker control */}
      <DatePicker customInput={input} timeIntervals={props.tI} selected={new Date(props.value)} value={props.value} onChange={date => props.onChange(date)} showTimeSelect={props.showTimeSelect} timeFormat={props.timeFormat || "hh:mm a"} timeCaption={props.timeCaption} dateFormat={props.dateFormat || "MM/dd/yyyy"} minDate={props.minDate} maxDate={props.maxDate} monthsShown={props.monthsShown} showTimeSelectOnly={props.showTimeSelectOnly} inline={props.inline} autoComplete="off" {...props} />
    </>;
};
export default HyperDatepicker;