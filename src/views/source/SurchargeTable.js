// import React from 'react'

// function SurchargeTable() {
//   return (
//     <div>SurchargeTable</div>
//   )
// }

// export default SurchargeTable

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
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const SurchargeTable = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id, admin } = useParams();
  const [surChargeData, setSurChargeData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  // let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  // let [id, setId] = React.useState();
  let [loader, setLoader] = React.useState(true);
  // let [editData, setEditData] = React.useState({});
  let navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getsurChargeData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/surcharge/surcharge/${accessType.admin_id}`
      );
      setLoader(false);
      setSurChargeData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //console.log(surChargeData, "hii");
  //console.log("object");

  // Delete selected
  const deleteSurcharge = (surcharge_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Surcharge!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/surcharge/surcharge/${surcharge_id}`)
          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Surcharge deleted successfully!", {
                position: "top-center",
              });
              getsurChargeData();
            } else {
              toast.error(response.data.message, {
                position: "top-center",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting:", error);
          });
      } else {
        toast.success("SurCharge is safe :)", {
          position: "top-center",
        });
      }
    });
  };

  //   auto form fill up in edit
  // let seletedEditData = async (datas) => {
  //   setModalShowForPopupForm(true);
  //   setId(datas._id);
  //   setEditData(datas);
  // };

  useEffect(() => {
    getsurChargeData();
  }, [accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (surChargeData) {
    paginatedData = surChargeData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const editSurcharge = (surcharge_id) => {
    navigate(`/${admin}/add_surcharge/${surcharge_id}`);
  };

  const filterTenantsBySearch = () => {
    let filteredData = surChargeData;

    if (searchQuery) {
      filteredData = filteredData.filter((surcharge) => {
        const isNameMatch = surcharge.surcharge_percent
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return isNameMatch;
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;

      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "surcharge_percent":
            filteredData.sort((a, b) => {
              const numA = parseFloat(a.surcharge_percent);
              const numB = parseFloat(b.surcharge_percent);
              const comparison = numA - numB;

              return upArrow.includes("surcharge_percent")
                ? comparison
                : -comparison;
            });
            break;

          case "createdAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.createdAt) - new Date(b.createdAt);
              return upArrow.includes("createdAt") ? comparison : -comparison;
            });
            break;
          case "updatedAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
              return upArrow.includes("updatedAt") ? comparison : -comparison;
            });
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
    //console.log(value);
    // setOnClickUpArrow(!onClickUpArrow);
  };

  useEffect(() => {
    // setLoader(false);
    // filterRentalsBySearch();
    getsurChargeData();
  }, [upArrow, sortBy]);
  return (
    <>
      <Header />

      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>SurCharge</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/" + admin + "/add_surcharge")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Surcharge
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
                      <th scope="col">
                        Surcharge
                        {sortBy.includes("surcharge_percent") ? (
                          upArrow.includes("surcharge_percent") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("surcharge_percent")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("surcharge_percent")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("surcharge_percent")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Created at
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
                      <th scope="col">
                        Updated at{" "}
                        {sortBy.includes("updatedAt") ? (
                          upArrow.includes("updatedAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("updatedAt")}
                          />
                        )}
                      </th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTenantsBySearchAndPage().map((surcharge) => (
                      <tr key={surcharge._id}>
                        <td>{surcharge.surcharge_percent}</td>
                        <td>{surcharge.createdAt}</td>
                        <td>
                          {surcharge.updatedAt ? surcharge.updatedAt : "-"}
                        </td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                deleteSurcharge(surcharge.surcharge_id)
                              }
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                editSurcharge(surcharge.surcharge_id)
                              }
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
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
              </Card>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SurchargeTable;
