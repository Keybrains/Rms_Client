import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Table,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Header from "components/Headers/Header";
import axios from "axios";
import Cookies from "universal-cookie";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RotatingLines } from "react-loader-spinner";

const Payment = () => {
  const navigate = useNavigate();
  const [prodropdownOpen, setproDropdownOpen] = React.useState(false);
  const [propertyData, setPropertyData] = React.useState([]);
  console.log(propertyData);
  const [selectedAccount, setselectedAccount] = React.useState("Select");
  const [accountData, setAccountData] = React.useState([]);
  const [bankdropdownOpen, setbankDropdownOpen] = React.useState(false);
  const [selectedProp, setSelectedProp] = React.useState("Select");
  const [daterangedropdownOpen, setDateRangeDropdownOpen] =
    React.useState(false);
  const [selecteddaterange, setSelectedDateRAnge] = React.useState("Select");
  const [GeneralLedgerData, setGeneralLedgerData] = useState();
  const [loader, setLoader] = React.useState(true);
  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setbankDropdownOpen((prevState) => !prevState);
  const toggle3 = () => setDateRangeDropdownOpen((prevState) => !prevState);

  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
  };
  const handleAccountSelection = (value) => {
    setselectedAccount(value);
  };
  const handleDateRange = (value) => {
    setSelectedDateRAnge(value);
  };
  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("http://localhost:4000/api/rentals/property_onrent")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  React.useEffect(() => {
    // Make an HTTP GET request to your Express API endpoint
    fetch("http://localhost:4000/api/addaccount/find_accountname")
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setAccountData(data.data);
          console.log(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, []);

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let authConfig = {
        headers: {
          Authorization: `Bearer ${cookies.get("token")}`,
          token: cookies.get("token"),
        },
      };
      // auth post method
      let res = await axios.post(
        "http://localhost:4000/api/register/auth",
        { purpose: "validate access" },
        authConfig
      );
      if (res.data.statusCode !== 200) {
        // cookies.remove("token");
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  };

  React.useEffect(() => {
    chackAuth();
  }, [cookies.get("token")]);

  const getGeneralLedgerData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/payment/payment");
      setLoader(false);
      setGeneralLedgerData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getGeneralLedgerData();
  }, []);
  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }
  return (
    <>
      <Header />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>
      <Container className="mt--8" fluid>
      <Row>
          <Col xs="12" sm="6">
            <FormGroup>
              <h1 style={{ color: "white" }}>Lease Ledger</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/AddPayment")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Recieve Payment
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <div className="col">
            {loader ? (
              <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={loader}
                />
              </div>
            ) : (
     
            <Card className="shadow">
              <CardHeader className="border-0">
                {/* <Form>
                  <Row>
                    <Col lg="2.5" style={{ marginRight: "20px" }}>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Property
                        </label>
                        <br />
                        <Dropdown isOpen={prodropdownOpen} toggle={toggle1}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedProp ? selectedProp : "Select"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              zIndex: 999,
                              maxHeight: "280px",
                              // overflowX: "hidden",
                              overflowY: "auto",
                              width: "100%",
                            }}
                          >
                            {propertyData?.map((item) => (
                              <DropdownItem
                                key={item._id}
                                onClick={() =>
                                  handlePropSelection(item.rental_adress)
                                }
                              >
                                {item.rental_adress}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col lg="2.5" style={{ marginRight: "20px" }}>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-account"
                        >
                          Account
                        </label>
                        <br />
                        <Dropdown isOpen={bankdropdownOpen} toggle={toggle2}>
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedAccount} &nbsp;&nbsp;&nbsp;&nbsp;
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              zIndex: 999,
                              maxHeight: "280px",
                              // overflowX: "hidden",
                              overflowY: "auto",
                              width: "100%",
                            }}
                          >
                            <DropdownItem header style={{ color: "blue" }}>
                              Income Account
                            </DropdownItem>
                            {accountData?.map((item) => (
                              <DropdownItem
                                key={item._id}
                                onClick={() =>
                                  handleAccountSelection(item.account_name)
                                }
                              >
                                {item.account_name}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col lg="2.5" style={{ marginRight: "20px" }}>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-account"
                        >
                          Date Range
                        </label>
                        <br />
                        <Dropdown
                          isOpen={daterangedropdownOpen}
                          toggle={toggle3}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selecteddaterange} &nbsp;&nbsp;&nbsp;&nbsp;
                          </DropdownToggle>
                          <DropdownMenu style={{ width: "100%" }}>
                            <DropdownItem
                              onClick={() => handleDateRange("Last 30 Days")}
                            >
                              Last 30 Days
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Last 60 Days")}
                            >
                              Last 60 Days
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Last 90 Days")}
                            >
                              Last 90 Days
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Current Month")}
                            >
                              Current Month
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Current Quater")}
                            >
                              Current Quater
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Current Year")}
                            >
                              Current Year
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Last Month")}
                            >
                              Last Month
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Last Quater")}
                            >
                              Last Quater
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDateRange("Last Year")}
                            >
                              Last Year
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          From
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder=""
                          type="date"
                          name="from"
                        />
                    
                      </FormGroup>
                    </Col>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          To
                        </label>
           
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder=""
                          type="date"
                          name="to"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                          style={{ paddingBottom: "10px" }}
                        >
                          Account Type
                        </label>
                        <div>
                          <label style={{ marginRight: "20px" }}>
                            <input
                              type="radio"
                              id="radioOption1"
                              name="options"
                              value="option1"
                              className="form-control-alternative"
                              style={{ marginRight: "5px", cursor: "pointer" }} // Add radio button styles here
                            />
                            Cash
                          </label>
                         
                          <label>
                            <input
                              type="radio"
                              id="radioOption1"
                              name="options"
                              value="option1"
                              className="form-control-alternative"
                              style={{ marginRight: "5px", cursor: "pointer" }} // Add radio button styles here
                            />
                            Accrual
                          </label>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", color: "white" }}
                        >
                          Search
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form> */}
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Tenant Firstname</th>
                    {/* <th scope="col">Total Amount</th> */}
                  </tr>
                </thead>
                <tbody>
                  {GeneralLedgerData?.map((generalledger) => (
                    <tr key={generalledger._id}>
                      <td>
                        {formatDateWithoutTime(generalledger.date) || "N/A"}
                      </td>
                      <td>{generalledger.amount}</td>
                      <td>{generalledger.payment_method}</td>
                      <td>{generalledger.tenant_firstName}</td>
                      {/* <td>
                        {generalledger.entries.map((entry, index) => (
                          <span key={index}>
                            {entry.account}
                            <br />
                          </span>
                        ))}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
        
          )}
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default Payment;
