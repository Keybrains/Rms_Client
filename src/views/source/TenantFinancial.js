import {
  Button,
  Card,
  ModalHeader,
  ModalBody,
  Modal,
  CardHeader,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Table,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TenantsHeader from "components/Headers/TenantsHeader";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import CreditCardForm from "./CreditCardForm";

const TenantFinancial = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [Ledger, setLedger] = useState([]);
  const [propertyDropdownData, setPropertyDropdownData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [loader, setLoader] = React.useState(true);
  const [showOptionsId, setShowOptionsId] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const openCardForm = () => {
    setIsModalOpen(true);
  };

  const toggleOptions = (id) => {
    setShowOptions(!showOptions);
    setShowOptionsId(id);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const [accessType, setAccessType] = useState(null);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchLedger = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/payment/tenant_financial/${accessType.tenant_id}`
      );
      setLedger(response.data.data);
      // setTotalPages(Math.ceil(response.length / pageItem));
      const filteredData = Array.from(
        new Set(
          response.data.data.map(
            (item) => `${item.rental_adress}, ${item.rental_unit}`
          )
        )
      );
      setPropertyDropdownData(filteredData);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [accessType]);

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (Ledger) {
    const allPaymentAndCharges = Ledger.flatMap((item) => {
      if (item !== undefined) {
        return item?.paymentAndCharges?.map((payment) => ({
          paymentAndCharges: payment,
          unit: item.unit,
          unit_id: item.unit_id,
          _id: item._id,
        }));
      } else {
        return;
      }
    });
    paginatedData = allPaymentAndCharges.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filterLedgerBySearch = () => {
    if (!searchQuery) {
      return Ledger; // Return original data if no search query
    }

    const filteredData = Ledger.filter((item) => {
      // You can customize this condition based on your search requirements
      return (
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entry.some((data) =>
          data.account.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        item.entry.some((data) =>
          data.memo.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });

    return filteredData;
  };

  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedData, setExpandedData] = useState([]);
  const openAccount = (ledger, i) => {
    const isExpanded = expandedRows.includes(i);

    if (!isExpanded) {
      setExpandedRows([...expandedRows, i]);
      setExpandedData((prevExpandedData) => ({
        ...prevExpandedData,
        [i]: ledger?.entry,
      }));
    } else {
      setExpandedRows(expandedRows.filter((row) => row !== i));
      setExpandedData((prevExpandedData) => {
        const newData = { ...prevExpandedData };
        delete newData[i];
        return newData;
      });
    }
  };

  return (
    <>
      <TenantsHeader />

      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Ledger</h1>
            </FormGroup>
          </Col>
          <Col className="text-right">
          <Button
              color="primary"
              onClick={() => openCardForm()}
              size="sm"
              style={{ background: "white", color: "#263238" }}
            >
              Add Cards
            </Button>
            <Button
              color="primary"
              onClick={() => navigate(`/tenant/TenantPayment`)}
              size="sm"
              style={{ background: "white", color: "#263238" }}
            >
              Make Payment
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <div className="col">
            <Card className="shadow">
              <Container className="mt--10" fluid>
                <Row>
                  <div className="col">
                    <CardHeader className="border-0">
                      <Row>
                        <Col xs="12" sm="6">
                          <FormGroup>
                            <Input
                              fullWidth
                              type="text"
                              placeholder="Search"
                              value={searchQuery}
                              onChange={handleSearch}
                              style={{
                                width: "100%",
                                maxWidth: "200px",
                                minWidth: "200px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardHeader>

                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
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
                        <>
                          <thead className="thead-light">
                            <tr>
                            <th scope="col">Date</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Account</th>
                                    <th scope="col">Transaction</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filterLedgerBySearch()?.length > 0 ? (
                              filterLedgerBySearch().map((item, index) => (
                                <>
                                  <tr
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    className="w-100"
                                  >
                                    <td>
                                      {moment(item?.createdAt).format(
                                        "DD-MM-YYYY"
                                      ) || "N/A"}
                                    </td>

                                    <td>{item?.type || "N/A"}</td>

                                    <td
                                      style={{
                                        cursor:
                                          item?.entry?.length > 1
                                            ? "pointer"
                                            : "",
                                      }}
                                      onClick={() => {
                                        if (item?.entry?.length > 1 &&
                                          item?.type !==
                                            "Refund") {
                                          openAccount(item, index);
                                        }
                                      }}
                                    >
                                      {item?.entry?.map((data) => (
                                        <>
                                          {data?.account}
                                          <br />
                                        </>
                                      )) || "-"}
                                    </td>

                                    <td
                                              style={{
                                                color:
                                                  item.type ===
                                                    "Payment" &&
                                                  item.response ===
                                                    "SUCCESS"
                                                    ? "#50975E"
                                                    : item.type ===
                                                        "Refund" &&
                                                      item.response ===
                                                        "SUCCESS"
                                                    ? "#ffc40c"
                                                    : item.response ===
                                                      "FAILURE"
                                                    ? "#AA3322"
                                                    : "inherit",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {item.response &&
                                              item.payment_type
                                                ? `Manual ${item.type} ${item.response} for ${item.payment_type}`
                                                : "- - - - - - - - - - - - - - - - -"}
                                              {item.transaction_id
                                                ? ` (#${item.transaction_id})`
                                                : ""}
                                            </td>

                                    {item.type === "Charge" || item.type === "Refund" ? (
                                      <td> {item?.total_amount}</td>
                                    ) : (
                                      <td>-</td>
                                    )}
                                    {item.type === "Payment" ? (
                                      <td> {item?.total_amount}</td>
                                    ) : (
                                      <td>-</td>
                                    )}
                                    <td> {item.balance !==
                                              undefined
                                                ? item.balance >= 0
                                                  ? `$${item?.balance?.toFixed(
                                                      2
                                                    )}`
                                                  : `$(${Math.abs(
                                                      item?.balance?.toFixed(
                                                        2
                                                      )
                                                    )})`
                                                : "0"}</td>
                                                  <td>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                }}
                                              >
                                                {item?.response !==
                                                  "FAILURE" && item?.response !==
                                                  "SUCCESS" &&
                                                item?.type ===
                                                  "Payment" ? (
                                                  <UncontrolledDropdown nav>
                                                    <DropdownToggle
                                                      className="pr-0"
                                                      nav
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        toggleOptions(
                                                          item?.payment_id
                                                        )
                                                      }
                                                    >
                                                      <span
                                                        className="avatar avatar-sm rounded-circle"
                                                        style={{
                                                          margin: "-20px",
                                                          background:
                                                            "transparent",
                                                          color: "lightblue",
                                                          fontWeight: "bold",
                                                          border:
                                                            "2px solid lightblue",
                                                          padding: "10px",
                                                          display: "flex",
                                                          alignItems: "center",
                                                          justifyContent:
                                                            "center",
                                                        }}
                                                      >
                                                        ...
                                                      </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow">
                                                      {item?.payment_id ===
                                                        showOptionsId && (
                                                        <div>
                                                          {(item?.response ===
                                                            "PENDING" ||
                                                            item?.payment_type ===
                                                              "Cash" ||
                                                            item?.payment_type ===
                                                              "Check" ) && (
                                                            <DropdownItem
                                                              tag="div"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                
                                                                  navigate(
                                                                    `/tenant/TenantPayment/${item.payment_id}`
                                                                  );
                                                                
                                                              }}
                                                            >
                                                              Edit
                                                            </DropdownItem>
                                                          )}
                                                        </div>
                                                      )}
                                                    </DropdownMenu>
                                                  </UncontrolledDropdown>
                                                ) : (
                                                  <div
                                                    style={{
                                                      fontSize: "15px",
                                                      fontWeight: "bolder",
                                                      paddingLeft: "5px",
                                                    }}
                                                  >
                                                    --
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                  </tr>
                                  {expandedRows.includes(index) && (
                                    <tr
                                      style={{
                                        border: "0",
                                        backgroundColor: "#f6f9fc",
                                      }}
                                      key={`expanded_${index}`}
                                    >
                                      <td
                                        scope="col"
                                        style={{ border: "0" }}
                                        colSpan="2"
                                      ></td>
                                      <td
                                        scope="col"
                                        style={{ border: "0" }}
                                        colSpan="2"
                                        className="text-left"
                                      >
                                        <b>Accounts</b>
                                        <br />
                                        {expandedData[index].map(
                                          (item, subIndex) => (
                                            <span
                                              key={`expanded_${index}_${subIndex}`}
                                            >
                                              {item?.account}
                                              <br />
                                            </span>
                                          )
                                        )}
                                      </td>
                                      <td scope="col" style={{ border: "0" }}>
                                        {Ledger[index]?.type === "Charge" ||
                                        Ledger[index]?.type === "Refund" ? (
                                          <>
                                            <b>Amount</b>
                                            <br />
                                          </>
                                        ) : (
                                          ""
                                        )}
                                        {expandedData[index].map(
                                          (data, subIndex) => (
                                            <>
                                              {Ledger[index]?.type ===
                                                "Charge" ||
                                              Ledger[index]?.type === "Refund"
                                                ? "$" + data?.amount
                                                : ""}
                                              <br />
                                            </>
                                          )
                                        )}
                                      </td>
                                      <td scope="col" style={{ border: "0" }}>
                                        {Ledger[index]?.type === "Payment" ? (
                                          <>
                                            <b>Amount</b>
                                            <br />
                                          </>
                                        ) : (
                                          ""
                                        )}
                                        {expandedData[index].map(
                                          (data, subIndex) => (
                                            <>
                                              {Ledger[index]?.type === "Payment"
                                                ? "$" + data?.amount
                                                : ""}
                                              <br />
                                            </>
                                          )
                                        )}
                                      </td>
                                      <td
                                        scope="col"
                                        style={{ border: "0" }}
                                      ></td>
                                      <td></td>
                                      {console.log(expandedData[index], "yash")}
                                    </tr>
                                  )}
                                </>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center">
                                  No data found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </>
                      )}
                    </Table>
                    {paginatedData.length > 0 ? (
                      <Row>
                        <Col className="text-right m-3">
                          <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                            <DropdownToggle caret>{pageItem}</DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() => {
                                  setPageItem(10);
                                  setCurrentPage(1);
                                }}
                              >
                                10
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setPageItem(25);
                                  setCurrentPage(1);
                                }}
                              >
                                25
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setPageItem(50);
                                  setCurrentPage(1);
                                }}
                              >
                                50
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setPageItem(100);
                                  setCurrentPage(1);
                                }}
                              >
                                100
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          <Button
                            className="p-0"
                            style={{ backgroundColor: "#d0d0d0" }}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-caret-left"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                            </svg>
                          </Button>
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>{" "}
                          <Button
                            className="p-0"
                            style={{ backgroundColor: "#d0d0d0" }}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-caret-right"
                              viewBox="0 0 16 16"
                            >
                              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                            </svg>
                          </Button>
                        </Col>
                      </Row>
                    ) : (
                      <></>
                    )}
                  </div>
                </Row>
              </Container>
            </Card>
          </div>
        </Row>
        <ToastContainer />
      </Container>
      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        style={{ maxWidth: "1000px" }}
      >
        <ModalHeader toggle={closeModal} className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Add Credit Card</strong>
        </ModalHeader>
        <ModalBody>
          <CreditCardForm
            tenantId={accessType?.tenant_id}
            closeModal={closeModal}
            //getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default TenantFinancial;
