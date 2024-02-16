import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "components/Headers/Header";
import * as React from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";

const TenantsTable = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let [tentalsData, setTenantsDate] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  let [loader, setLoader] = React.useState(true);
  const { admin } = useParams()
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [upArrow, setUpArrow] = React.useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [accessType, setAccessType] = React.useState(null);
  let navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const navigateToTenantsDetails = (tenantId) => {
    navigate(`/${admin}/tenantdetail/${tenantId}`);
  };

  let getTenantsDate = async () => {
    try {
      let response = await axios.get(
        `${baseUrl}/tenants/tenants/${accessType.admin_id}`
      );
      if (response.data.statusCode === 200) {
        let data = response.data.data;
        let reversedData = data.reverse();
        setTenantsDate(reversedData);
        setTotalPages(Math.ceil(reversedData.length / pageItem));
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tenants data:", error);
    }
    setLoader(false);
  };

  React.useEffect(() => {
    getTenantsDate();
  }, [pageItem, accessType, upArrow, sortBy]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const paginatedData = tentalsData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const deleteTenants = async (tenant_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this tenant!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const res = await axios.delete(
          `${baseUrl}/tenants/tenant/${tenant_id}`

        );
        console.log(res);
        if (res.data.statusCode === 200) {
          getTenantsDate()
          toast.success(res.data.message, {
            position: 'top-center',
            autoClose: 800,
          })
        } else {
          toast.warning(res.data.message, {
            position: 'top-center',
            autoClose: 800,
          })
        }
      } else {
        toast.success('Tenant is safe!', {
          position: 'top-center',
          autoClose: 800,
        })
      }
    });
  };

  const filterTenantsBySearch = () => {
    let filteredData = [...tentalsData];

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        if (!tenant) {
          return false;
        }

        const name = `${tenant.tenant_firstName} ${tenant.tenant_lastName}`;

        return (
          tenant.tenant_firstName
            .toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          tenant.tenant_lastName.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant.tenant_phoneNumber.toString().includes(lowerCaseSearchQuery) ||
          tenant.tenant_email.toLowerCase().includes(lowerCaseSearchQuery) ||
          name.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "tenant_firstName":
            filteredData.sort((a, b) =>
              a.tenant_firstName.localeCompare(b.tenant_firstName)
            );
            break;
          case "tenant_phoneNumber":
            filteredData.sort(
              (a, b) => a.tenant_phoneNumber - b.tenant_phoneNumber
            );
            break;
          case "tenant_email":
            filteredData.sort((a, b) =>
              a.tenant_email.localeCompare(b.tenant_email)
            );
            break;
          case "createdAt":
            filteredData.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
          default:
            break;
        }
      });
    }

    return filteredData;
  };

  const filterTenantsBySearchAndPage = () => {
    const filteredData = filterTenantsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const editLeasing = (id) => {
    navigate(`/${admin}/Leaseing/${id}`);
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  const generatePDF = async (tenantId, tenantDetails, entryIndex) => {
    try {
      let tenantData = tenantDetails;
      if (!tenantData || !tenantData._id) {
        const response = await axios.get(
          `${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`
        );
        tenantData = response.data.data;
        console.log(tenantData, "tenantData");
      }
      const doc = new jsPDF();
      doc.text(`Lease Details`, 10, 10);

      const headers = ["Title", "Value", ""];
      const data = [
        [
          "Tenant Name",
          `${tenantData.tenant_firstName} ${tenantData.tenant_lastName}`,
          "",
        ],
        ["Phone", tenantData.tenant_phoneNumber],
        ["Email", tenantData.tenant_email],
        ["Birthdate", formatDateWithoutTime(tenantData.birth_date)],
        ["Textpayer Id", tenantData.textpayer_id],
        ["Comments", tenantData.comments],
        ["Contact Name", tenantData.contact_name],
        ["Relationship With Tenants", tenantData.relationship_tenants],
        ["Emergency Email", tenantData.email],
        ["Emergench PhoneNumber", tenantData.emergency_PhoneNumber],
        ["Property Type", tenantData.entries.rental_adress],
        ["Lease Type", tenantData.entries.lease_type],
        ["Start Date", formatDateWithoutTime(tenantData.entries.start_date)],
        ["End Date", formatDateWithoutTime(tenantData.entries.end_date)],
        ["Rent Cycle", tenantData.entries.rent_cycle],
        ["Amount", tenantData.entries.amount],
        ["Accout", tenantData.entries.account],
        [
          "Next Due Date",
          formatDateWithoutTime(tenantData.entries.nextDue_date),
        ],
        ["Memo", tenantData.entries.memo],
        ["Cosigner Firstname", tenantData.entries.cosigner_firstName],
        ["Cosigner Lastname", tenantData.entries.cosigner_lastName],
        ["Cosigner Mobilenumber", tenantData.entries.cosigner_mobileNumber],
        ["Cosigner Worknumber", tenantData.entries.cosigner_workNumber],
        ["Cosigner HomeNumber", tenantData.entries.cosigner_homeNumber],
        [
          "Cosigner FaxPhone Number",
          tenantData.entries.cosigner_faxPhoneNumber,
        ],
        ["Cosigner Email", tenantData.entries.cosigner_email],
        ["Cosigner AlternateEmail", tenantData.entries.cosigner_alternateemail],
        ["Cosigner StreeAddress", tenantData.entries.cosigner_streetAdress],
        ["Cosigner City", tenantData.entries.cosigner_city],
        ["Cosigner State", tenantData.entries.cosigner_state],
        ["Cosigner Country", tenantData.entries.cosigner_country],
        ["Cosigner PostalCode", tenantData.entries.cosigner_postalcode],

        ["Recurring Charges", "", ""], // Add a header for Recurring Charges
      ];

      data.push(["Recurring Charge", "Recurring Amount", "Recurring Account"]);

      tenantData.entries.recurring_charges.forEach((charge, index) => {
        data.push([
          ` ${index + 1}`,
          charge.recuring_amount,
          charge.recuring_account,
        ]);
      });
      data.push(["One Time Charge", "One Time Amount", "One Time Account"]);

      tenantData.entries.one_time_charges.forEach((charge, index) => {
        data.push([
          ` ${index + 1}`,
          charge.onetime_amount,
          charge.onetime_account,
        ]);
      });
      if (tenantData.upload_file && Array.isArray(tenantData.upload_file)) {
        tenantData.upload_file.forEach((item, index) => {
          data.push([`Uploaded File ${index + 1}`, item]);
        });
      }

      const filteredData = data.filter(
        (row) => row[1] !== undefined && row[1] !== null && row[1] !== ""
      );

      if (filteredData.length > 0) {
        doc.autoTable({
          head: [headers, ""],
          body: filteredData,
          startY: 20,
        });

        doc.save(`${tenantId}.pdf`);
      } else {
        console.error("No valid data to generate PDF.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const sortData = (value) => {
    if (!sortBy.includes(value)) {
      setSortBy([...sortBy, value]);
      setUpArrow([...upArrow, value]);
      filterTenantsBySearchAndPage();
    } else {
      setSortBy(sortBy.filter((sort) => sort !== value));
      setUpArrow(upArrow.filter((sort) => sort !== value));
      filterTenantsBySearchAndPage();
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Tenants</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              onClick={() => navigate("/" + admin + "/Leaseing")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Tenant
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
                  <Row>
                    <Col xs="12" sm="6">
                      <FormGroup className="">
                        <Input
                          fullWidth
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
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
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">
                        Tenant name
                        {sortBy.includes("tenant_firstName") ? (
                          upArrow.includes("tenant_firstName") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("tenant_firstName")}
                          />
                        )}
                      </th>

                      <th scope="col">
                        Phone
                        {sortBy.includes("tenant_phoneNumber") ? (
                          upArrow.includes("tenant_phoneNumber") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("tenant_phoneNumber")}
                          />
                        )}
                      </th>

                      <th scope="col">
                        Email
                        {sortBy.includes("tenant_email") ? (
                          upArrow.includes("tenant_email") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("tenant_email")}
                          />
                        )}
                      </th>

                      <th scope="col">
                        Created At
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </th>
                      <th scope="col">Last Updated</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {tentalsData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="5" style={{fontSize:"15px"}}>No Tenants Added</td>
                      </tr>
                    </tbody>

                  ) : (
                    <tbody>

                      {filterTenantsBySearchAndPage().map((tenant) => (
                        <>
                          <tr
                            key={tenant.tenant_id}
                            onClick={() =>
                              navigateToTenantsDetails(tenant.tenant_id)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              {tenant.tenant_firstName} {tenant.tenant_lastName}
                            </td>
                            <td>{tenant.tenant_phoneNumber}</td>
                            <td>{tenant.tenant_email}</td>
                            <td>{tenant.createdAt} </td>
                            <td>{tenant.updatedAt ? tenant.updatedAt : "-"} </td>
                            <td>
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTenants(tenant.tenant_id);
                                  }}
                                >
                                  <DeleteIcon />
                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editLeasing(tenant.tenant_id);
                                  }}
                                >
                                  <EditIcon />
                                </div>
                                {/* <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generatePDF(tenant.tenant_id);
                                }}
                              >
                                <PictureAsPdfIcon />
                              </div> */}
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>)}
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
              </Card>
            )}
          </div>
        </Row>
        <br />
        <br />
        <ToastContainer />
      </Container>
    </>
  );
};

export default TenantsTable;
