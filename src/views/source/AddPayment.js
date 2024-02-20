import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Popover,
} from "reactstrap";
import PaymentHeader from "components/Headers/PaymentHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { Check, CheckBox } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { values } from "pdf-lib";
import Img from "assets/img/theme/team-4-800x800.jpg";
import "jspdf-autotable";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { OverlayTrigger } from "react-bootstrap";


function AddPayment() {
  const [accessType, setAccessType] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { lease_id, admin } = useParams();
  const [chargeData, setchargeData] = useState([]);
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [chargeDropdown, setchargeDropdown] = useState(false);
  const toggle = () => setchargeDropdown((prevState) => !prevState);
  const [secondchargeDropdown, setsecondchargeDropdown] = useState(false);
  const toggle1 = () => setsecondchargeDropdown(prevState => !prevState);


  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchchargeData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/payment/charges/${lease_id}`
      );
      setchargeData(response.data.totalCharges);

    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const fetchtenantsData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${baseUrl}/leases/tenants/${lease_id}`
      );
      setTenantsData(response.data.data);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchtenantsData();
    fetchchargeData();
  }, [lease_id]);

  function objectToKeyValue(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        keyValuePairs.push({ key, value: obj[key] });
      }
    }
    return keyValuePairs;
  }

  return (
    <>
      <PaymentHeader />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      payment
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  {console.log("first", tenantsData)}

                  <Row > {/* Ensure each row has a unique key */}
                    <Col lg="2">
                      <label
                        className="form-control-label"
                        htmlFor="input-unitadd"
                      >
                        Payment for: {tenantsData.tenant_firstName} {tenantsData.tenant_lastName}
                      </label>
                    </Col>
                  </Row>



                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="3000"
                          type="date"
                          name="date"
                        // onBlur={generalledgerFormik.handleBlur}
                        // onChange={generalledgerFormik.handleChange}
                        // value={generalledgerFormik.values.date}
                        />

                        heloo
                        {/* {generalledgerFormik.touched.date &&
                        generalledgerFormik.errors.date ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.date}
                          </div>
                        ) : null} */}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Payment Method
                        </label>
                        <br />
                        <Dropdown >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            jigymtkvjibtkmg,vbkg,lfv
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <DropdownItem>
                              Credit Card
                            </DropdownItem>
                            <DropdownItem>
                              Cash
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <>
                        <Row>
                          <Col sm="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Amount *
                              </label>
                              <Input
                                type="text"
                                id="amount"
                                placeholder="Enter amount"
                                name="amount"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Card Number *
                              </label>
                              <InputGroup>
                                <Input
                                  type="number"
                                  id="creditcard_number"
                                  placeholder="0000 0000 0000 0000"
                                  name="creditcard_number"

                                />
                              </InputGroup>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col sm="2">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Expiration Date *
                              </label>
                              <Input
                                type="text"
                                id="expiration_date"
                                name="expiration_date"

                              />
                            </FormGroup>
                          </Col>
                          <Col sm="2">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Cvv *
                              </label>
                              <Input
                                type="number"
                                id="cvv"
                                placeholder="XXX"
                                name="cvv"

                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                      <>
                        <Row>
                          <Col sm="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Amount *
                              </label>
                              <Input
                                type="text"
                                id="amount"
                                placeholder="Enter amount"
                                name="amount"

                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Recieved From
                        </label>
                        <br />
                        <Dropdown >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            yhtbgfvd
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <DropdownItem
                            >
                              gfbvcthgbfvd
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Memo
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="if left blank, will show 'Payment'"
                          type="text"
                          name="memo"
                        />
                        bfdvc gbddfbv
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Balance</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {objectToKeyValue(chargeData)?.map((item) => (
                                <>
                                  <tr >
                                    <td>
                                      <Dropdown isOpen={chargeDropdown}
                                        toggle={toggle}>

                                        <DropdownToggle caret>
                                          {item?.key}
                                        </DropdownToggle>
                                      </Dropdown>
                                    </td>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="$0.00"
                                        type="text"
                                        value={Math.abs(item?.value)}
                                        disabled
                                      />
                                    </td>
                                    <td>
                                      <Input
                                        className="form-control-alternative"
                                        id="input-unitadd"
                                        placeholder="$0.00"
                                        type="text"

                                      />
                                    </td>
                                    <td style={{ border: "none" }}>
                                      <ClearIcon
                                        type="button"
                                        style={{
                                          cursor: "pointer",
                                          padding: 0,
                                        }}
                                      >
                                        Remove
                                      </ClearIcon>
                                    </td>
                                  </tr>
                                </>
                              ))}
                              <>
                                <tr >
                                  <td>
                                    <Dropdown isOpen={secondchargeDropdown} toggle={toggle1}>
                                      <DropdownToggle caret>gb vc
                                      </DropdownToggle>
                                      <DropdownMenu
                                        style={{
                                          zIndex: 999,
                                          maxHeight: "200px",
                                          overflowY: "auto",
                                        }}
                                      >
                                        <DropdownItem
                                          header
                                          style={{ color: "blue" }}
                                        >
                                          Liability Account
                                        </DropdownItem>
                                        <DropdownItem

                                        >
                                          Last Month's Rent
                                        </DropdownItem>
                                        <DropdownItem
                                        >
                                          Prepayments
                                        </DropdownItem>
                                        <DropdownItem
                                        >
                                          Security Deposit Liability
                                        </DropdownItem>

                                        <DropdownItem
                                          header
                                          style={{ color: "blue" }}
                                        >
                                          Income Account
                                        </DropdownItem>
                                        <DropdownItem
                                        >
                                          knm
                                        </DropdownItem>
                                        <>
                                          <DropdownItem
                                            header
                                            style={{ color: "blue" }}
                                          >
                                            Reccuring Charges
                                          </DropdownItem>
                                          <DropdownItem>
                                            tgdfvc
                                          </DropdownItem>
                                        </>
                                        <>
                                          <DropdownItem
                                            header
                                            style={{ color: "blue" }}
                                          >
                                            One Time Charges
                                          </DropdownItem>
                                          <DropdownItem
                                          >
                                            sdfghjkl
                                          </DropdownItem>
                                        </>
                                      </DropdownMenu>
                                    </Dropdown>
                                  </td>
                                  <td>
                                    <Input
                                      className="form-control-alternative"
                                      id="input-unitadd"
                                      placeholder="$0.00"
                                      type="text"

                                    />
                                  </td>
                                  <td>
                                    <Input
                                      className="form-control-alternative"
                                      id="input-unitadd"
                                      placeholder="$0.00"
                                      type="text"
                                    />
                                  </td>
                                  <td style={{ border: "none" }}>
                                    <ClearIcon
                                      type="button"
                                      style={{
                                        cursor: "pointer",
                                        padding: 0,
                                      }}
                                    >
                                      Remove
                                    </ClearIcon>
                                  </td>
                                </tr>
                                <tr>
                                  <th>Total</th>
                                  {/* <th>{totalDebit.toFixed(2)}</th> */}
                                  <th
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="top"
                                    >
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                        }}
                                      >
                                        The payment's amount must match the
                                        total applied to balance. The
                                        difference is $
                                      </span>
                                    </OverlayTrigger>
                                  </th>
                                  <th>nhdbg vc</th>
                                </tr>
                              </>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="4">
                                  <Button
                                    type="button"
                                    className="btn btn-primary"
                                  >
                                    Add Row
                                  </Button>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div className="d-flex">
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                            />
                            <label for="upload_file" className="btn">
                              Choose Files
                            </label>
                          </div>

                          <div className="d-flex ">
                            <div
                              style={{
                                position: "relative",
                                marginLeft: "50px",
                              }}
                            >
                              <p
                                style={{ cursor: "pointer" }}
                              >
                                kmjnh bgffhnjk,lkjmn hbgfvgb nhj,lknhj bgdfbgnhjmk,iloknh bgdvcbgfnhjunhbgv
                              </p>
                              <CloseIcon
                                style={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  left: "64px",
                                  top: "-2px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <Checkbox
                          name="print_receipt"
                        />
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Print Receipt
                        </label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {/* <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", color: "white" }}
                          onClick={(e) => {
                            e.preventDefault();
                            generalledgerFormik.handleSubmit();
                          }}
                        >
                          Save Payment
                        </button> */}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{
                            background: "green",
                            cursor: "not-allowed",
                          }}
                          disabled
                        >
                          Loading...
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "pointer" }}
                        >
                          Edit Payment
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", cursor: "pointer" }}
                        >
                          New Payment
                        </button>
                        <Button
                          color="primary"
                          //  href="#rms"
                          className="btn btn-primary"
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default AddPayment;
