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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import deleicon from "../../assets/img/icons/common/delete.svg";
import editicon from "../../assets/img/icons/common/editicon.svg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const TenantsTable = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let [tentalsData, setTenantsDate] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  let [loader, setLoader] = React.useState(true);
  const { admin } = useParams();
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
  let getTenantsData = async () => {
    if (accessType?.admin_id) {
      try {
        let response = await axios.get(
          `${baseUrl}/tenant/tenants/${accessType?.admin_id}`
        );
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          let reversedData = data.reverse();
          setTenantsDate(reversedData);
          setTotalPages(Math.ceil(reversedData.length / pageItem));
          // setLoader(false);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching tenants data:", error);
      }
      finally {
        setLoader(false);

      }
    }
  };

  const [countRes, setCountRes] = useState("");
  const getTenantsLimit = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/tenant/limitation/${accessType?.admin_id}`
        );
        setCountRes(response.data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }
  };

  React.useEffect(() => {
    getTenantsData();
    getTenantsLimit();
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
          `${baseUrl}/tenant/tenant/${tenant_id}`
        );
        console.log(res);
        if (res.data.statusCode === 200) {
          getTenantsData();
          getTenantsLimit();
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 800,
          });
        } else {
          toast.warning(res.data.message, {
            position: "top-center",
            autoClose: 800,
          });
        }
      } else {
        toast.success("Tenant is safe!", {
          position: "top-center",
          autoClose: 800,
        });
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
          case "updatedAt":
            filteredData.sort(
              (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
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

  // const generatePDF = async (tenantId, tenantDetails, entryIndex) => {
  //   try {
  //     let tenantData = tenantDetails;
  //     if (!tenantData || !tenantData._id) {
  //       const response = await axios.get(
  //       );
  //       tenantData = response.data.data;
  //       console.log(tenantData, "tenantData");
  //     }
  //     const doc = new jsPDF();
  //     doc.text(`Lease Details`, 10, 10);

  //     const headers = ["Title", "Value", ""];
  //     const data = [
  //       [
  //         "Tenant Name",
  //         `${tenantData.tenant_firstName} ${tenantData.tenant_lastName}`,
  //         "",
  //       ],
  //       ["Phone", tenantData.tenant_phoneNumber],
  //       ["Email", tenantData.tenant_email],
  //       ["Birthdate", formatDateWithoutTime(tenantData.birth_date)],
  //       ["Textpayer Id", tenantData.textpayer_id],
  //       ["Comments", tenantData.comments],
  //       ["Contact Name", tenantData.contact_name],
  //       ["Relationship With Tenants", tenantData.relationship_tenants],
  //       ["Emergency Email", tenantData.email],
  //       ["Emergench PhoneNumber", tenantData.emergency_PhoneNumber],
  //       ["Property Type", tenantData.entries.rental_adress],
  //       ["Lease Type", tenantData.entries.lease_type],
  //       ["Start Date", formatDateWithoutTime(tenantData.entries.start_date)],
  //       ["End Date", formatDateWithoutTime(tenantData.entries.end_date)],
  //       ["Rent Cycle", tenantData.entries.rent_cycle],
  //       ["Amount", tenantData.entries.amount],
  //       ["Accout", tenantData.entries.account],
  //       [
  //         "Next Due Date",
  //         formatDateWithoutTime(tenantData.entries.nextDue_date),
  //       ],
  //       ["Memo", tenantData.entries.memo],
  //       ["Cosigner Firstname", tenantData.entries.cosigner_firstName],
  //       ["Cosigner Lastname", tenantData.entries.cosigner_lastName],
  //       ["Cosigner Mobilenumber", tenantData.entries.cosigner_mobileNumber],
  //       ["Cosigner Worknumber", tenantData.entries.cosigner_workNumber],
  //       ["Cosigner HomeNumber", tenantData.entries.cosigner_homeNumber],
  //       [
  //         "Cosigner FaxPhone Number",
  //         tenantData.entries.cosigner_faxPhoneNumber,
  //       ],
  //       ["Cosigner Email", tenantData.entries.cosigner_email],
  //       ["Cosigner AlternateEmail", tenantData.entries.cosigner_alternateemail],
  //       ["Cosigner StreeAddress", tenantData.entries.cosigner_streetAdress],
  //       ["Cosigner City", tenantData.entries.cosigner_city],
  //       ["Cosigner State", tenantData.entries.cosigner_state],
  //       ["Cosigner Country", tenantData.entries.cosigner_country],
  //       ["Cosigner PostalCode", tenantData.entries.cosigner_postalcode],

  //       ["Recurring Charges", "", ""], // Add a header for Recurring Charges
  //     ];

  //     data.push(["Recurring Charge", "Recurring Amount", "Recurring Account"]);

  //     tenantData.entries.recurring_charges.forEach((charge, index) => {
  //       data.push([
  //         ` ${index + 1}`,
  //         charge.recuring_amount,
  //         charge.recuring_account,
  //       ]);
  //     });
  //     data.push(["One Time Charge", "One Time Amount", "One Time Account"]);

  //     tenantData.entries.one_time_charges.forEach((charge, index) => {
  //       data.push([
  //         ` ${index + 1}`,
  //         charge.onetime_amount,
  //         charge.onetime_account,
  //       ]);
  //     });
  //     if (tenantData.upload_file && Array.isArray(tenantData.upload_file)) {
  //       tenantData.upload_file.forEach((item, index) => {
  //         data.push([`Uploaded File ${index + 1}`, item]);
  //       });
  //     }

  //     const filteredData = data.filter(
  //       (row) => row[1] !== undefined && row[1] !== null && row[1] !== ""
  //     );

  //     if (filteredData.length > 0) {
  //       doc.autoTable({
  //         head: [headers, ""],
  //         body: filteredData,
  //         startY: 20,
  //       });

  //       doc.save(`${tenantId}.pdf`);
  //     } else {
  //       console.error("No valid data to generate PDF.");
  //     }
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

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
      {/* <Container className="mt--8" fluid> */}
      <Container className="" fluid style={{ marginTop: "3rem", height: "100vh" }}>

        <Row>

          <Col className="text-right">
            <Button
              // color="primary"
              // className="mr-4"
              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding tenants according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  navigate("/" + admin + "/Leaseing");
                }
              }}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Add New Tenant
            </Button>
          </Col>
          <Col xs="12" lg="12" sm="6">
            {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Tenants</h1>
            </FormGroup> */}
            <CardHeader
              className=" mt-3 "
              style={{
                backgroundColor: "#152B51",
                borderRadius: "10px",
                boxShadow: " 0px 4px 4px 0px #00000040 ",
              }}
            >
              <h2
                className=""
                style={{
                  color: "#ffffff",
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  fontSize: "26px",
                }}
              >
                Tenants
              </h2>
            </CardHeader>
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
              <>
                {/* <Card className="shadow"> */}
                {/* <CardHeader className="border-0"> */}
                <Row className="mb-3">
                  <Col xs="12" sm="6">
                    <FormGroup className="">
                      <Input
                        fullWidth
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          minWidth: "200px",
                          boxShadow: " 0px 4px 4px 0px #00000040",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <FormGroup>
                      <p style={{ fontFamily: "Poppins", fontSize: "18px", fontWeight: "500" }}>

                        Added :{" "}
                        <b style={{ color: "#152B51", fontWeight: 1000 }}>

                          {countRes.rentalCount}
                        </b>{" "}
                        {" / "}
                        Total :{" "}
                        <b style={{ color: "#152B51", fontWeight: 1000 }}>

                          {countRes.propertyCountLimit}
                        </b>
                      </p>
                    </FormGroup>
                  </Col>
                </Row>
                {/* </CardHeader> */}
                <Table className="align-items-center table-flush" responsive style={{ borderCollapse: "collapse" }}>
                  <thead className="" style={{
                    height: "45px",
                    fontSize: "14px",
                    fontFamily: "poppins",
                    fontWeight: "600",
                    boxShadow: " 0px 4px 4px 0px #00000040",
                  }}>
                    <tr style={{
                      border: "2px solid rgba(50, 69, 103, 1)",
                    }}>
                      <th className="tablefontstyle" scope="col" style={{
                        borderTopLeftRadius: "15px",
                        color: "#152B51",

                      }}>
                        Tenant name
                        {sortBy.includes("tenant_firstName") ? (
                          upArrow.includes("tenant_firstName") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_firstName")}
                          />
                        )}
                      </th>

                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Phone
                        {sortBy.includes("tenant_phoneNumber") ? (
                          upArrow.includes("tenant_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_phoneNumber")}
                          />
                        )}
                      </th>

                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Email
                        {sortBy.includes("tenant_email") ? (
                          upArrow.includes("tenant_email") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_email")}
                          />
                        )}
                      </th>

                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Created At
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ color: "#152B51" }}>
                        Last Updated{" "}
                        {sortBy.includes("updatedAt") ? (
                          upArrow.includes("updatedAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("updatedAt")}
                          />
                        )}
                      </th>
                      <th className="tablefontstyle" scope="col" style={{ borderTopRightRadius: "15px", color: "#152B51" }}>Action</th>
                    </tr>
                  </thead>
                  {tentalsData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No Tenants Added
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      <tr style={{
                        border: "none",
                      }}>
                        {/* Empty row */}
                        <td colSpan="9"></td>
                      </tr>
                      {filterTenantsBySearchAndPage().map((tenant) => (
                        <>
                          <tr
                            key={tenant.tenant_id}
                            onClick={() =>
                              navigateToTenantsDetails(tenant.tenant_id)
                            }
                            style={{
                              cursor: "pointer",
                              border: "0.5px solid rgba(50, 69, 103, 1)",
                              fontSize: "12px",
                              height: "40px",
                              fontFamily: "poppins",
                              fontWeight: "600",
                              lineHeight: "10.93px",
                            }}
                          >
                            <td className="bordertopintd tablebodyfont ">
                              {tenant.tenant_firstName} {tenant.tenant_lastName}
                            </td>
                            <td className="bordertopintd tablebodyfont ">{tenant.tenant_phoneNumber}</td>
                            <td className="bordertopintd tablebodyfont ">{tenant.tenant_email}</td>
                            <td className="bordertopintd tablebodyfont ">{tenant.createdAt} </td>
                            <td className="bordertopintd tablebodyfont ">
                              {tenant.updatedAt ? tenant.updatedAt : "-"}{" "}
                            </td>
                            <td className="bordertopintd">
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTenants(tenant.tenant_id);
                                  }}
                                >
                                  <img src={deleicon} width={20} height={20} />

                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editLeasing(tenant.tenant_id);
                                  }}
                                >
                                  <img src={editicon} width={20} height={20} />

                                </div>

                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  )}
                </Table>
                {/* <Row
                  className="mx-4 mt-3 d-flex align-items-center py-1"
                  style={{ borderRadius: "10px", height: "auto" }}
                >
                  <Col>
                    <Row
                      className="d-flex align-items-center"
                      style={{
                        border: "2px solid rgba(50, 69, 103, 1)",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        height: "45px",
                        fontSize: "14px",
                        fontFamily: "poppins",
                        fontWeight: "600",
                        boxShadow: " 0px 4px 4px 0px #00000040",
                      }}
                    >
                      <Col style={{ color: "#152B51" }}>
                           Tenant name
                        {sortBy.includes("tenant_firstName") ? (
                          upArrow.includes("tenant_firstName") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_firstName")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_firstName")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                         Phone
                        {sortBy.includes("tenant_phoneNumber") ? (
                          upArrow.includes("tenant_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_phoneNumber")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_phoneNumber")}
                          />
                        )}
                      </Col>

                      <Col style={{ color: "#152B51" }}>

                       
                         Email
                        {sortBy.includes("tenant_email") ? (
                          upArrow.includes("tenant_email") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("tenant_email")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("tenant_email")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                      
                         Created At
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("createdAt")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                         Last Updated{" "}
                        {sortBy.includes("updatedAt") ? (
                          upArrow.includes("updatedAt") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("updatedAt")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>
                        Action{" "}

                      </Col>
                    </Row>
                    {tentalsData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No Tenants Added
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                      <Row
                        className="mt-3"
                        style={{
                          border: "0.5px solid rgba(50, 69, 103, 1)",
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                          overflow: "hidden",
                          fontSize: "16px",
                          fontWeight: "600",
                          // lineHeight: "19.12px",
                        }}
                      >
                        <Col>
                        {filterTenantsBySearchAndPage().map((tenant) => (
                            <Row
                            key={tenant.tenant_id}
                              className="d-flex align-items-center"
                              onClick={() =>
                                navigateToTenantsDetails(tenant.tenant_id)
                              }

                              style={{
                                cursor: "pointer",
                                border: "0.5px solid rgba(50, 69, 103, 1)",
                                fontSize: "12px",
                                height: "40px",
                                fontFamily: "poppins",
                                fontWeight: "600",
                                lineHeight: "10.93px",
                              }}
                            >
                              <Col style={{ color: "#152B51" }}>{tenant?.tenant_firstName} {tenant?.tenant_lastName} </Col>
                              <Col style={{ color: "#152B51" }}>{tenant?.tenant_phoneNumber}</Col>
                              <Col style={{ color: "#152B51" }}>{tenant?.tenant_email}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {tenant.createdAt} 
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                              {tenant.updatedAt ? tenant.updatedAt : "-"}{" "}
                              </Col>
                              <Col> 
                               <div style={{ display: "flex" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTenants(tenant.tenant_id);
                                  }}
                                >
                                  <img src={deleicon} width={20} height={20} />

                                </div>
                                &nbsp; &nbsp; &nbsp;
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editLeasing(tenant.tenant_id);
                                  }}
                                >
                                  <img src={editicon} width={20} height={20} />

                                </div>
                              </div></Col>
                            </Row>
                          )
                          )}
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row> */}
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
                {/* </Card> */}
              </>

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
