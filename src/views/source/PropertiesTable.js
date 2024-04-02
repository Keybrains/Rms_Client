import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Input,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import Header from "components/Headers/Header";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";
import deleicon from "../../assets/img/icons/common/delete.svg";
import editicon from "../../assets/img/icons/common/editicon.svg";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const PropertiesTables = () => {
  const { admin } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [rentalsData, setRentalsData] = useState([]);
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const toggle3 = () => setSearch((prevState) => !prevState);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  const navigateToPropDetails = (rental_id) => {
    const propDetailsURL = `/${admin}/PropDetails/${rental_id}`;
    navigate(propDetailsURL);
  };

  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getRentalsData = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/rentals/rentals/${accessType?.admin_id}`
        );

        setRentalsData(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageItem));
        setLoader(false);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }
  };

  const [countRes, setCountRes] = useState("");
  const getRentalsLimit = async () => {
    if (accessType?.admin_id) {
      try {
        const response = await axios.get(
          `${baseUrl}/rentals/limitation/${accessType?.admin_id}`
        );
        console.log(response.data);
        setCountRes(response.data);
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    }
  };

  const deleteRentals = (id, entryIndex) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this rental property!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/rentals/rental/${id}`)
          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Property deleted successfully!", {
                position: "top-center",
                autoClose: 500,
              });
              getRentalsData();
              getRentalsLimit();
            } else if (response.data.statusCode === 201) {
              toast.warning("Property already assigned to Tenant!", {
                position: "top-center",
                autoClose: 500,
              });
              getRentalsData();
            } else {
              toast.error(response.data.message, {
                position: "top-center",
                autoClose: 500,
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting rental property:", error);
          });
      } else {
        toast.success("Property is safe :)", {
          position: "top-center",
          autoClose: 500,
        });
      }
    });
  };

  useEffect(() => {
    getRentalsData();
    getRentalsLimit();
  }, [accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (rentalsData) {
    paginatedData = rentalsData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const editProperty = (rental_id) => {
    navigate(`/${admin}/rentals/${rental_id}`);
  };

  const filterRentalsBySearch = () => {
    let filteredData = rentalsData;
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((Rental) => {
        const name = `${Rental?.rental_owner_data.rentalOwner_firstName} ${Rental?.rental_owner_data.rentalOwner_lastName}`;
        const address = `${Rental?.rental_adress} ${Rental?.rental_city}`;
        return (
          Rental?.rental_adress?.toLowerCase().includes(lowerCaseSearchQuery) ||
          Rental?.property_type_data.property_type
            .toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          Rental?.property_type_data.propertysub_type
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          Rental?.rental_city?.toLowerCase().includes(lowerCaseSearchQuery) ||
          Rental?.rental_owner_data.rentalOwner_firstName
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          Rental?.rental_owner_data.rentalOwner_lastName
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          Rental?.rental_owner_data.rentalOwner_companyName
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          Rental?.rental_owner_data.rentalOwner_primaryEmail
            ?.toLowerCase()
            .includes(lowerCaseSearchQuery) ||
          name?.toLowerCase().includes(lowerCaseSearchQuery) ||
          address?.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });
    }
    if (searchQuery2) {
      if (searchQuery2 === "All") {
        return filteredData;
      }
      const lowerCaseSearchQuery = searchQuery2.toLowerCase();
      filteredData = filteredData.filter((property) => {
        const isPropertyTypeMatch = property?.property_type_data?.property_type
          .toLowerCase()
          .includes(lowerCaseSearchQuery);
        const isPropertySubTypeMatch =
          property?.property_type_data?.property_type
            .toLowerCase()
            .includes(lowerCaseSearchQuery);
        return isPropertyTypeMatch || isPropertySubTypeMatch;
      });
    }
    console.log(upArrow, "vvvv");
    if (upArrow.length > 0) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) => {
              const comparison = a.rental_adress.localeCompare(b.rental_adress);
              return upArrow.includes("rental_adress")
                ? comparison
                : -comparison;
            });
            break;
          case "type":
            filteredData.sort((a, b) => {
              const comparison =
                a.property_type_data.property_type.localeCompare(
                  b.property_type_data.property_type
                );
              return upArrow.includes("type") ? comparison : -comparison;
            });
            break;
          case "property_type":
            filteredData.sort((a, b) => {
              const comparison =
                a.property_type_data.propertysub_type.localeCompare(
                  b.property_type_data.propertysub_type
                );
              return upArrow.includes("property_type")
                ? comparison
                : -comparison;
            });
            break;
          case "rental_city":
            filteredData.sort((a, b) => {
              const comparison = a.rental_city.localeCompare(b.rental_city);
              return upArrow.includes("rental_city") ? comparison : -comparison;
            });
            break;
          case "rentalOwner_firstName":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_firstName.localeCompare(
                  b.rental_owner_data.rentalOwner_firstName
                );
              return upArrow.includes("rentalOwner_firstName")
                ? comparison
                : -comparison;
            });
            break;
          case "rentalOwner_companyName":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_companyName.localeCompare(
                  b.rental_owner_data.rentalOwner_companyName
                );
              return upArrow.includes("rentalOwner_companyName")
                ? comparison
                : -comparison;
            });
            break;
          case "rentalOwner_primaryEmail":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_primaryEmail.localeCompare(
                  b.rental_owner_data.rentalOwner_primaryEmail
                );
              return upArrow.includes("rentalOwner_primaryEmail")
                ? comparison
                : -comparison;
            });
            break;
          case "rentalOwner_phoneNumber":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_phoneNumber -
                b.rental_owner_data.rentalOwner_phoneNumber;
              return upArrow.includes("rentalOwner_phoneNumber")
                ? comparison
                : -comparison;
            });
            break;
          case "createdAt":
            filteredData.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              const comparison = dateA - dateB;
              return upArrow.includes("createdAt") ? comparison : -comparison;
            });

            break;
          case "updatedAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
              return upArrow.includes("updatedAt") ? comparison : -comparison;
            });
            break;
          case "-rental_adress":
            filteredData.sort((a, b) => {
              const comparison = a.rental_adress.localeCompare(b.rental_adress);
              return upArrow.includes("-rental_adress")
                ? -comparison
                : comparison;
            });
            break;
          case "-type":
            filteredData.sort((a, b) => {
              const comparison =
                a.property_type_data.property_type.localeCompare(
                  b.property_type_data.property_type
                );
              return upArrow.includes("-type") ? -comparison : comparison;
            });
            break;
          case "-property_type":
            filteredData.sort((a, b) => {
              const comparison =
                a.property_type_data.propertysub_type.localeCompare(
                  b.property_type_data.propertysub_type
                );
              return upArrow.includes("-property_type")
                ? -comparison
                : comparison;
            });
            break;
          case "-rental_city":
            filteredData.sort((a, b) => {
              const comparison = a.rental_city.localeCompare(b.rental_city);
              return upArrow.includes("-rental_city")
                ? -comparison
                : comparison;
            });
            break;
          case "-rentalOwner_firstName":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_firstName.localeCompare(
                  b.rental_owner_data.rentalOwner_firstName
                );
              return upArrow.includes("-rentalOwner_firstName")
                ? -comparison
                : comparison;
            });
            break;
          case "-rentalOwner_companyName":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_companyName.localeCompare(
                  b.rental_owner_data.rentalOwner_companyName
                );
              return upArrow.includes("-rentalOwner_companyName")
                ? -comparison
                : comparison;
            });
            break;
          case "-rentalOwner_primaryEmail":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_primaryEmail.localeCompare(
                  b.rental_owner_data.rentalOwner_primaryEmail
                );
              return upArrow.includes("-rentalOwner_primaryEmail")
                ? -comparison
                : comparison;
            });
            break;
          case "-rentalOwner_phoneNumber":
            filteredData.sort((a, b) => {
              const comparison =
                a.rental_owner_data.rentalOwner_phoneNumber -
                b.rental_owner_data.rentalOwner_phoneNumber;
              return upArrow.includes("-rentalOwner_phoneNumber")
                ? -comparison
                : comparison;
            });
            break;
          case "-createdAt":
            filteredData.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              const comparison = dateA - dateB;
              return upArrow.includes("-createdAt") ? -comparison : comparison;
            });

            break;
          case "-updatedAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
              return upArrow.includes("-updatedAt") ? -comparison : comparison;
            });
            break;
          default:
            break;
        }
      });
    }

    return filteredData;
  };

  const filterRentalsBySearchAndPage = () => {
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const sortData = (value) => {
    const isSorting = sortBy.includes(value);

    if (!isSorting) {
      // If not sorting, add the value to both arrays in ascending order
      setSortBy([value]);
      setUpArrow([value]);
    } else {
      // If already sorting, toggle the direction in upArrow array
      const index = upArrow.indexOf(value);
      const newUpArrow = index !== -1 ? [] : [value];

      // If sorting in descending order, add a hyphen to the value
      if (newUpArrow.length === 0) {
        newUpArrow[0] = `-${value}`;
      }

      setUpArrow(newUpArrow);
    }

    filterRentalsBySearchAndPage();
  };

  useEffect(() => {
    getRentalsData();
  }, [upArrow, sortBy]);

  return (
    <>
      <Header />
      <Container className="" fluid style={{ marginTop: "3rem", height: "100vh" }}>

        <Row>
          <Col className="text-right">
            <Button
              // color="primary"
              //  href="#rms"
              // className="mr-4"
              onClick={() => {
                if (countRes.statusCode === 201) {
                  swal(
                    "Plan Limitation",
                    "The limit for adding properties according to the plan has been reached.",
                    "warning"
                  );
                } else {
                  navigate("/" + admin + "/rentals");
                }
              }}
              size="small"
              style={{ background: "#152B51", color: "#fff" }}

            >
              Add New Property
            </Button>
          </Col>
          <Col xs="12" lg="12" sm="6">
            {/* <FormGroup className="">
              <h1 style={{ color: "white" }}>Property Type</h1>
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
                Properties
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
                <CardHeader className="border-0">
                  <Row className="d-flex ">
                    <Col>
                      <Row>
                        <FormGroup className="mr-sm-2">
                          <Input
                            fullWidth
                            type="text"
                            placeholder="Search here..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setSearchQuery2("");
                            }}
                            style={{
                              width: "100%",
                              maxWidth: "200px",
                              minWidth: "200px",
                              boxShadow: " 0px 4px 4px 0px #00000040",
                              border: "1px solid #ced4da",
                            }}
                          />
                        </FormGroup>
                        <FormGroup className="mr-sm-2">
                          <Dropdown isOpen={search} toggle={toggle3}>
                            <DropdownToggle
                              caret
                              style={{
                                boxShadow: " 0px 4px 4px 0px #00000040",
                                border: "1px solid #ced4da",
                                maxWidth: "200px",
                                minWidth: "200px",
                                backgroundColor: "transparent",
                                color: "#A7A7A7"
                              }}
                            >
                              {searchQuery2
                                ? searchQuery
                                  ? "Select Type"
                                  : searchQuery2
                                : "Select Type"}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() => {
                                  setSearchQuery2("Residential");
                                  setSearchQuery("");
                                }}
                              >
                                Residential
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setSearchQuery2("Commercial");
                                  setSearchQuery("");
                                }}
                              >
                                Commercial
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setSearchQuery2("All");
                                  setSearchQuery("");
                                }}
                              >
                                All
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>
                      </Row>
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
                </CardHeader>
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
                      <th scope="col" style={{
                        borderTopLeftRadius: "15px",

                        color: "#152B51"
                      }}>
                        Property{" "}
                        {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Property Typess{" "}
                        {sortBy.includes("type") ? (
                          upArrow.includes("type") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("type")}
                            />
                          ) : (
                            <ArrowDropUpIcon onClick={() => sortData("type")} />
                          )
                        ) : (
                          <ArrowDropDownIcon onClick={() => sortData("type")} />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Property Sub Type{" "}
                        {sortBy.includes("property_type") ? (
                          upArrow.includes("property_type") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("property_type")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("property_type")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("property_type")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Rental Owners Name{" "}
                        {sortBy.includes("rentalOwner_firstName") ? (
                          upArrow.includes("rentalOwner_firstName") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_firstName")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Rental Company Name{" "}
                        {sortBy.includes("rentalOwner_companyName") ? (
                          upArrow.includes("rentalOwner_companyName") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_companyName")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Locality{" "}
                        {sortBy.includes("rental_city") ? (
                          upArrow.includes("rental_city") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_city")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_city")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rental_city")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Primary Email{" "}
                        {sortBy.includes("rentalOwner_primaryEmail") ? (
                          upArrow.includes("rentalOwner_primaryEmail") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_primaryEmail")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Phone Number
                        {sortBy.includes("rentalOwner_phoneNumber") ? (
                          upArrow.includes("rentalOwner_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_phoneNumber")}
                          />
                        )}
                      </th>
                      <th scope="col" style={{ color: "#152B51" }}>
                        Created At{" "}
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
                      <th style={{ color: "#152B51" }}>
                        Last Updated At{" "}
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

                      <th scope="col" style={{ borderTopRightRadius: "15px", color: "#152B51" }}>ACTION</th>
                    </tr>
                  </thead>
                  {rentalsData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="8" style={{ fontSize: "15px" }}>
                          No Properties Added
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
                      {filterRentalsBySearchAndPage()?.map((Rental) => (
                        <>
                          <tr
                            key={Rental.rental_id}
                            onClick={() =>
                              navigateToPropDetails(Rental.rental_id)
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
                            <td className="bordertopintd">{Rental.rental_adress}</td>
                            <td className="bordertopintd">{Rental?.property_type_data?.property_type}</td>
                            <td className="bordertopintd">
                              {Rental?.property_type_data?.propertysub_type}
                            </td>
                            <td className="bordertopintd">
                              {Rental.rental_owner_data.rentalOwner_firstName}{" "}
                              {Rental.rental_owner_data.rentalOwner_lastName}
                            </td>
                            <td className="bordertopintd">
                              {Rental.rental_owner_data.rentalOwner_companyName}
                            </td>
                            <td className="bordertopintd">{`${Rental.rental_city}`}</td>
                            <td className="bordertopintd">
                              {
                                Rental.rental_owner_data
                                  .rentalOwner_primaryEmail
                              }
                            </td>
                            <td className="bordertopintd">
                              {Rental.rental_owner_data.rentalOwner_phoneNumber}
                            </td>
                            <td className="bordertopintd">
                              {moment(Rental.createdAt).format("DD-MM-YYYY")}
                            </td>
                            <td className="bordertopintd">
                              {Rental.updatedAt
                                ? moment(Rental.updatedAt).format("DD-MM-YYYY")
                                : "-"}
                            </td>
                            <td  className="bordertopintd">
                              <div style={{ display: "flex", gap: "5px" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRentals(Rental.rental_id, Rental);
                                  }}
                                >
                                   <img src={deleicon} width={20} height={20} />
                                </div>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editProperty(Rental.rental_id);
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
                  className="mx-4 mt-3 d-flex align-items-center py-1 responsive"
                  style={{ borderRadius: "10px", height: "auto", overflow: "auto" }}
                >
                  <Col>
                    <Row
                      className="d-flex align-items-center"
                      style={{
                        border: "2px solid rgba(50, 69, 103, 1)",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        height: "auto",
                        fontSize: "14px",
                        fontFamily: "poppins",
                        fontWeight: "600",
                        boxShadow: " 0px 4px 4px 0px #00000040",
                      }}
                    >
                      <Col style={{ color: "#152B51" }}>

                        Property{" "}
                        {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Property Types{" "}
                        {sortBy.includes("type") ? (
                          upArrow.includes("type") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("type")}
                            />
                          ) : (
                            <ArrowDropUpIcon onClick={() => sortData("type")} />
                          )
                        ) : (
                          <ArrowDropDownIcon onClick={() => sortData("type")} />
                        )}
                      </Col>

                      <Col style={{ color: "#152B51" }}>
                        Property Sub Type{" "}
                        {sortBy.includes("property_type") ? (
                          upArrow.includes("property_type") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("property_type")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("property_type")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("property_type")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Rental Owners Name{" "}
                        {sortBy.includes("rentalOwner_firstName") ? (
                          upArrow.includes("rentalOwner_firstName") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_firstName")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Rental Company Name{" "}
                        {sortBy.includes("rentalOwner_companyName") ? (
                          upArrow.includes("rentalOwner_companyName") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_companyName")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Locality{" "}
                        {sortBy.includes("rental_city") ? (
                          upArrow.includes("rental_city") ? (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_city")}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() => sortData("rental_city")}
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rental_city")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Primary Email{" "}
                        {sortBy.includes("rentalOwner_primaryEmail") ? (
                          upArrow.includes("rentalOwner_primaryEmail") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_primaryEmail")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Phone Number
                        {sortBy.includes("rentalOwner_phoneNumber") ? (
                          upArrow.includes("rentalOwner_phoneNumber") ? (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          ) : (
                            <ArrowDropUpIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          )
                        ) : (
                          <ArrowDropDownIcon
                            onClick={() => sortData("rentalOwner_phoneNumber")}
                          />
                        )}
                      </Col>
                      <Col style={{ color: "#152B51" }}>

                        Created At{" "}
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

                        Last Updated At{" "}
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
                    {rentalsData.length === 0 ? (
                      <tbody>
                        <tr className="text-center">
                          <td colSpan="8" style={{ fontSize: "15px" }}>
                            No Properties Added
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
                          {filterRentalsBySearchAndPage()?.map((Rental) => (
                            <Row
                              key={Rental.rental_id}
                              className="d-flex align-items-center"

                              onClick={() =>
                                navigateToPropDetails(Rental.rental_id)
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
                              <Col style={{ color: "#152B51" }}>{Rental.rental_adress}</Col>
                              <Col style={{ color: "#152B51" }}>{Rental?.property_type_data?.property_type}</Col>
                              <Col style={{ color: "#152B51" }}>{Rental?.property_type_data?.propertysub_type}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {Rental.rental_owner_data.rentalOwner_firstName}{" "}
                                {Rental.rental_owner_data.rentalOwner_lastName}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {Rental.rental_owner_data.rentalOwner_companyName}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {`${Rental.rental_city}`}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {
                                  Rental.rental_owner_data
                                    .rentalOwner_primaryEmail
                                }
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {Rental.rental_owner_data.rentalOwner_phoneNumber}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {moment(Rental.createdAt).format("DD-MM-YYYY")}
                              </Col>
                              <Col style={{ color: "#152B51" }}>
                                {Rental.updatedAt
                                  ? moment(Rental.updatedAt).format("DD-MM-YYYY")
                                  : "-"}
                              </Col>


                              <Col>  <div style={{ display: "flex" }}>
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRentals(Rental.rental_id, Rental);
                                  }}
                                >
                                  <img src={deleicon} width={20} height={20} />

                                </div>
                                &nbsp; &nbsp; &nbsp;
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editProperty(Rental.rental_id);
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
                      </Button>{" "}
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

export default PropertiesTables;
