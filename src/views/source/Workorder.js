import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Col,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import Header from "components/Headers/Header";
import * as React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect } from "react";

const Workorder = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { admin } = useParams();
  const [workData, setWorkData] = useState();
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageItem, setPageItem] = useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = useState(false);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  // const getWorkData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/work-order/work-orders/1707904648270`
  //     );
  //     const filteredData = response?.data?.data?.map((item) => ({
  //       workOrder_id: item?.workOrderData?.workOrder_id,
  //       work_subject: item?.workOrderData?.work_subject,
  //       work_category: item?.workOrderData?.work_category,
  //       status: item?.workOrderData?.status,
  //       createdAt: item?.workOrderData?.createdAt,
  //       updateAt: item?.workOrderData?.updatedAt,
  //       rental_id: item?.rentalAdress?.rental_id,
  //       rental_adress: item?.rentalAdress?.rental_adress,
  //       unit_id: item?.rentalUnit?.unit_id,
  //       rental_unit: item?.rentalUnit?.rental_unit,
  //       staffmember_id: item?.staffMember?.staffmember_id,
  //       staffmember_name: item?.staffMember?.staffmember_name,
  //     }));
  //     setWorkData(filteredData);
  //     setLoader(false);
  //     setTotalPages(Math.ceil(filteredData?.length / pageItem));
  //   } catch (error) {
  //     setLoader(false);
  //     console.error("Error fetching data:", error);
  //   } finally{
  //     setLoader(false);

  //   }
  // };

  const getWorkData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/work-orders/${accessType?.admin_id}`
      );
      if (response?.data?.data) {
        const filteredData = response.data.data.map((item) => ({
          workOrder_id: item?.workOrderData?.workOrder_id,
          work_subject: item?.workOrderData?.work_subject,
          work_category: item?.workOrderData?.work_category,
          status: item?.workOrderData?.status,
          createdAt: item?.workOrderData?.createdAt,
          updateAt: item?.workOrderData?.updatedAt,
          rental_id: item?.rentalAdress?.rental_id,
          rental_adress: item?.rentalAdress?.rental_adress,
          unit_id: item?.rentalUnit?.unit_id,
          rental_unit: item?.rentalUnit?.rental_unit,
          staffmember_id: item?.staffMember?.staffmember_id,
          staffmember_name: item?.staffMember?.staffmember_name,
        }));
        setWorkData(filteredData);
        setTotalPages(Math.ceil(filteredData.length / pageItem));
      } else {
        setWorkData([]);
        setTotalPages(0);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };

  const [accessType, setAccessType] = useState();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const deleteRentals = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this work order!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${baseUrl}/workorder/delete_workorder`, {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              toast.success("Work Order deleted successfully", {
                position: "top-center",
              });
              getWorkData();
            } else {
              toast.error(response.data.message, {
                position: "top-center",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        toast.success("Work Orer is safe!", {
          position: "top-center",
        });
      }
    });
  };

  useEffect(() => {
    getWorkData();
  }, [accessType]);

  const startIndex = (currentPage - 1) * pageItem;
  const endIndex = currentPage * pageItem;
  var paginatedData;
  if (workData) {
    paginatedData = workData.slice(startIndex, endIndex);
  }
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const editWorkOrder = (id) => {
    console.log(id, "id male che");
    navigate(`/${admin}/addworkorder/${id}`);
  };

  const filterRentalsBySearch = () => {
    let filteredData = [...workData];

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toString().toLowerCase();
      filteredData = filteredData.filter((work) => {
        return (
          (work.rental_adress &&
            work.rental_adress.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.work_subject &&
            work.work_subject.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.work_category &&
            work.work_category.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (work.staffmember_name &&
            work.staffmember_name.toLowerCase().includes(lowerCaseSearchQuery))
        );
      });
    }

    if (upArrow.length > 0) {
      const sortingArrows = upArrow;
      sortingArrows.forEach((value) => {
        switch (value) {
          case "rental_adress":
            filteredData.sort((a, b) =>
              a.rental_adress.localeCompare(b.rental_adress)
            );
            break;
          case "work_subject":
            filteredData.sort((a, b) =>
              a.work_subject.localeCompare(b.work_subject)
            );
            break;
          case "work_category":
            filteredData.sort((a, b) =>
              a.work_category.localeCompare(b.work_category)
            );
            break;
          case "staffmember_name":
            filteredData.sort((a, b) =>
              a.staffmember_name.localeCompare(b.staffmember_name)
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
    const filteredData = filterRentalsBySearch();
    const paginatedData = filteredData.slice(startIndex, endIndex);
    return paginatedData;
  };

  const navigateToDetails = (workorder_id) => {
    // navigate(`/${admin} /workorderdetail/${workorder_id}`);
    navigate(`/${admin}/workorderdetail/${workorder_id}`);
    //console.log(workorder_id);
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
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        {/* Table */}
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Orders</h1>
            </FormGroup>
          </Col>

                    <Col className="text-right">

            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/" + admin + "/addworkorder")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Work Order
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
                      <FormGroup>
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
                        Work Order
                        {sortBy.includes("work_subject") ? (
                          upArrow.includes("work_subject") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("work_subject")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("work_subject")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("work_subject")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Property
                        {sortBy.includes("rental_adress") ? (
                          upArrow.includes("rental_adress") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("rental_adress")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rental_adress")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Category
                        {sortBy.includes("work_category") ? (
                          upArrow.includes("work_category") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("work_category")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("work_category")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("work_category")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Assigned
                        {sortBy.includes("staffmember_name") ? (
                          upArrow.includes("staffmember_name") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("staffmember_name")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("staffmember_name")}
                          />
                        )}
                      </th>
                      <th scope="col">Status</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Updated At</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead> 
                  {workData.length === 0 ? (
                    <tbody>
                      <tr className="text-center">
                        <td colSpan="7"style={{fontSize:"15px"}}>No Workorder Added</td>
                      </tr>
                    </tbody>
                    ) : (

                  <tbody>

                    {filterTenantsBySearchAndPage().map((rental) => (
                      <tr
                        key={rental.workOrder_id}
                        onClick={() => navigateToDetails(rental.workOrder_id)}
                        style={{ cursor: "pointer" }}
                      >{console.log(rental, "yash")}
                        <td>{rental.work_subject}</td>
                        <td>
                          {rental.rental_adress}{" "}
                          {rental.rental_units
                            ? " - " + rental.rental_units
                            : null}
                        </td>
                        <td>{rental.work_category}</td>
                        <td>{rental.staffmember_name || "-"}</td>
                        <td>{rental.status || "-"}</td>
                        <td>{rental.createdAt}</td>
                        <td>{rental.updateAt || "-"}</td>

                        <td>
                          <div style={{ display: "flex", gap: "0px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRentals(rental.workOrder_id);
                              }}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            {console.log(rental, "rental js")}
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                editWorkOrder(rental.workOrder_id);
                              }}
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
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
        <ToastContainer />
      </Container>
    </>
  );
};

export default Workorder;
