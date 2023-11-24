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
const TenantsTable = ({ tenantDetails }) => {
  // const {tenantId} = useParams();
  let [tentalsData, setTenantsDate] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  let [loader, setLoader] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const navigateToTenantsDetails = (tenantId, entryIndex) => {
    navigate(`/admin/tenantdetail/${tenantId}/${entryIndex}`);
    console.log(tenantId, "Tenant Id");
    console.log(entryIndex, "Entry Index");
  };

  let navigate = useNavigate();
  let getTenantsDate = async () => {
    let responce = await axios.get("https://propertymanager.cloudpress.host/api/tenant/tenants");
    setLoader(false);
    setTenantsDate(responce.data.data);
    setTotalPages(Math.ceil(responce.data.data.length / pageItem));
  };

  React.useEffect(() => {
    getTenantsDate();
  }, [pageItem]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  const paginatedData = tentalsData.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  // Delete selected
  const deleteTenants = (tenantId, entryIndex) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this tenant!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `https://propertymanager.cloudpress.host/api/tenant/tenant/${tenantId}/entry/${entryIndex}`
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Tenant deleted successfully!", "success");
              getTenantsDate();
              // Optionally, you can refresh your tenant data here.
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting Tenant:", error);
          });
      } else {
        swal("Cancelled", "Tenant is safe :)", "info");
      }
    });
  };

  React.useEffect(() => {
    // Fetch initial data
    getTenantsDate();
  }, []);

  const filterTenantsBySearch = () => {
    if (searchQuery === undefined) {
      return paginatedData;
    }
    console.log(paginatedData);
    return paginatedData.filter((tenant) => {
      const name = tenant.tenant_firstName + " " + tenant.tenant_lastName;
      console.log(tenant);
      return (
        tenant.entries.rental_adress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.tenant_firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.entries.lease_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.tenant_lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };
  // const filterTenantsBySearch = () => {
  //   if (searchQuery === undefined) {
  //     return tentalsData;
  //   }

  //   return tentalsData.filter((tenant) => {
  //     const name = tenant.tenant_firstName + " " + tenant.tenant_lastName;
  //     const rentalAddress = tenant.entries && tenant.entries.rental_adress;
  //     const leaseType = tenant.entries && tenant.entries.lease_type;

  //     return (
  //       (rentalAddress && rentalAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //       (tenant.tenant_firstName && tenant.tenant_firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //       (leaseType && leaseType.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //       (tenant.tenant_lastName && tenant.tenant_lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //       (name.toLowerCase().includes(searchQuery.toLowerCase()))
  //     );
  //   });
  // };

  const editLeasing = (id, entryIndex) => {
    navigate(`/admin/Leaseing/${id}/${entryIndex}`);
    console.log(id, entryIndex, "fsdfsdfhdiuysdifusdyiuf");
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
          `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`
        );
        tenantData = response.data.data;
        console.log(tenantData, "tenantData");
      }
      const doc = new jsPDF();
      doc.text(`Lease Details`, 10, 10);

      const headers = ["Title", "Value"];
      const data = [
        [
          "Tenant Name",
          `${tenantData.tenant_firstName} ${tenantData.tenant_lastName}`,
        ],
        ["Phone", tenantData.tenant_mobileNumber],
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
        ["Recurring Amount", tenantData.entries.recuring_amount],
        ["Recurring Account", tenantData.entries.recuring_account],
        ["Recurring NextDue Date", tenantData.entries.recuringnextDue_date],
        ["Recurring Memo", tenantData.entries.recuringmemo],
        ["Recurring Frequency", tenantData.entries.recuringfrequency],
        ["One Time Amont", tenantData.entries.onetime_amount],
        ["One Time Account", tenantData.entries.onetime_account],
        [
          "One Time Due Date",
          formatDateWithoutTime(tenantData.entries.onetime_Due_date),
        ],
        ["One Time Memo", tenantData.entries.onetime_memo],
        // ["Uploaded Files", tenantData.upload_file[0]],
      ];

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
          head: [headers],
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

  return (
    <>
      <Header />
      {/* Page content */}
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
              href="#rms"
              onClick={() => navigate("/admin/Leaseing")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Lease
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
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
                      <th scope="col">Tenant name</th>
                      <th scope="col">Property Type</th>
                      <th scope="col">Lease Type</th>
                      <th scope="col">Start Date</th>
                      <th scope="col">End Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearch().map((tenant) => (
                      <>
                        <tr
                          key={tenant._id}
                          onClick={() =>
                            navigateToTenantsDetails(
                              tenant._id,
                              tenant.entries.entryIndex
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {tenant.tenant_firstName} {tenant.tenant_lastName}
                          </td>
                          <td>{tenant.entries.rental_adress}</td>
                          <td>{tenant.entries.lease_type}</td>
                          <td>{tenant.entries.start_date}</td>
                          <td>{tenant.entries.end_date}</td>
                          {/* <td>{tenant.entries.entryIndex}</td>
                          <td>{tenant.entries.rental_adress}</td> */}
                          <td style={{}}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTenants(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                  // console.log(entry.entryIndex,"dsgdg")
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editLeasing(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                }}
                              >
                                <EditIcon />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generatePDF(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                }}
                              >
                                <PictureAsPdfIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
                {paginatedData.length > 0 ? (
                  <Row>
                    <Col className="text-right m-3">
                      <Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
                        <DropdownToggle caret>{pageItem}</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(6);
                              setCurrentPage(1);
                            }}
                          >
                            6
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(12);
                              setCurrentPage(1);
                            }}
                          >
                            12
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(18);
                              setCurrentPage(1);
                            }}
                          >
                            18
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
                          class="bi bi-caret-left"
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
                          class="bi bi-caret-right"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                        </svg>
                      </Button>{" "}
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
      </Container>
    </>
  );
};

export default TenantsTable;
