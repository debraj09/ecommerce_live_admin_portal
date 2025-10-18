import { Card, Col, Row } from "react-bootstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const ReactSwal = withReactContent(Swal);

// components
import PageTitle from "../../components/PageTitle";
import logosm from "@/assets/images/logo-sm.png";
const openAlert = options => {
  ReactSwal.fire(options);
};
const SweetAlerts = () => {
  let timerInterval;
  return <>
            <PageTitle breadCrumbItems={[{
      label: "Extended UI",
      path: "/extended-ui/sweet-alert"
    }, {
      label: "Sweet Alerts",
      path: "/extended-ui/sweet-alert",
      active: true
    }]} title={"Sweet Alerts"} />

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title">Examples</h4>

                            <p className="sub-header">
                                A beautiful, responsive, customizable, accessible (WAI-ARIA)
                                replacement for JavaScript's popup boxes
                            </p>
                            <table className="table table-borderless table-centered mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th style={{
                    width: "50%"
                  }}>Alert Type</th>
                                    <th>Example</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>A basic message</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-basic" onClick={() => openAlert({
                      title: "Any fool can use a computer!"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A title with a text under</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-title" onClick={() => openAlert({
                      title: "The Internet?",
                      text: "That thing is still around?",
                      icon: "question"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A success message!</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-success" onClick={() => openAlert({
                      title: "Good job!",
                      text: "You clicked the button!",
                      icon: "success"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A modal window with a long content inside:</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-long-content" onClick={() => openAlert({
                      imageUrl: "https://placeholder.pics/svg/300x1500",
                      imageHeight: 1500,
                      imageAlt: "A tall image"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A custom positioned dialog</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-custom-position" onClick={() => openAlert({
                      position: "top-end",
                      icon: "success",
                      title: "Your work has been saved",
                      showConfirmButton: false,
                      timer: 1500
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        A modal with a title, an error icon, a text, and a footer
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-error" onClick={() => openAlert({
                      icon: "error",
                      title: "Oops...",
                      text: "Something went wrong!",
                      footer: "<a href>Why do I have this issue?</a>"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        A confirm dialog, with a function attached to the
                                        "Confirm"-button...
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-warning" onClick={() => ReactSwal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#28bb4b",
                      cancelButtonColor: "#f34e4e",
                      confirmButtonText: "Yes, delete it!"
                    }).then(result => {
                      if (result.value) {
                        ReactSwal.fire("Deleted!", "Your file has been deleted.", "success");
                      }
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        By passing a parameter, you can execute something else for
                                        "Cancel".
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-params" onClick={() => ReactSwal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                      cancelButtonText: "No, cancel!",
                      customClass: {
                        confirmButton: "btn btn-success mt-2",
                        cancelButton: "btn btn-danger ms-2 mt-2"
                      },
                      buttonsStyling: false
                    }).then(result => {
                      if (result.value) {
                        ReactSwal.fire({
                          title: "Deleted!",
                          text: "Your file has been deleted.",
                          icon: "success",
                          confirmButtonColor: "#4a4fea"
                        });
                      } else if (
                      // Read more about handling dismissals
                      result.dismiss === ReactSwal.DismissReason.cancel) {
                        ReactSwal.fire({
                          title: "Cancelled",
                          text: "Your imaginary file is safe :)",
                          icon: "error",
                          confirmButtonColor: "#4a4fea"
                        });
                      }
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A message with custom Image Header</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-image" onClick={() => openAlert({
                      title: "UBold",
                      text: "Responsive Bootstrap 4 Admin Dashboard",
                      imageUrl: logosm,
                      imageHeight: 50,
                      confirmButtonColor: "#4a4fea",
                      animation: false
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A message with auto close timer</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="sa-close" onClick={() => ReactSwal.fire({
                      title: "Auto close alert!",
                      html: "I will close in <strong></strong> seconds.",
                      timer: 2000
                    }).then(result => {
                      if (
                      // Read more about handling dismissals
                      result.dismiss === ReactSwal.DismissReason.timer) {
                        console.log("I was closed by the timer");
                      }
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom HTML description and buttons</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="custom-html-alert" onClick={() => openAlert({
                      title: "<i>HTML</i> <u>example</u>",
                      icon: "info",
                      html: "You can use <b>bold text</b>, " + '<a href="//coderthemes.com/">links</a> ' + "and other HTML tags",
                      showCloseButton: true,
                      showCancelButton: true,
                      customClass: {
                        confirmButton: "btn btn-confirm",
                        cancelButton: "btn btn-cancel ms-1"
                      },
                      confirmButtonText: '<i class="mdi mdi-thumb-up-outline"></i> Great!',
                      cancelButtonText: '<i class="mdi mdi-thumb-down-outline"></i>'
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>A message with custom width, padding and background</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="custom-padding-width-alert" onClick={() => openAlert({
                      title: "Custom width, padding, background.",
                      width: 600,
                      padding: 100,
                      background: "#fff url(//subtlepatterns2015.subtlepatterns.netdna-cdn.com/patterns/geometry.png)"
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ajax request example</td>
                                    <td>
                                        <button type="button" className="btn btn-info btn-xs" id="ajax-alert" onClick={() => ReactSwal.fire({
                      title: "Submit email to run ajax request",
                      input: "email",
                      showCancelButton: true,
                      confirmButtonText: "Submit",
                      showLoaderOnConfirm: true,
                      confirmButtonColor: "#4a4fea",
                      cancelButtonColor: "#f34e4e",
                      preConfirm: function (email) {
                        return new Promise(function (resolve, reject) {
                          setTimeout(function () {
                            if (email === "taken@example.com") {
                              reject("This email is already taken.");
                            } else {
                              resolve();
                            }
                          }, 2000);
                        });
                      },
                      allowOutsideClick: false
                    }).then(result => {
                      ReactSwal.fire({
                        icon: "success",
                        title: "Ajax request finished!",
                        confirmButtonColor: "#4a4fea",
                        html: "Submitted email: " + result
                      });
                    })}>
                                            Click me
                                        </button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>;
};
export default SweetAlerts;