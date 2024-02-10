import * as React from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "react-bootstrap";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import Collapse from "@mui/material/Collapse";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "universal-cookie";
import moment from "moment";
import Switch from "@mui/material/Switch";
// import { useHistory } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import deleterecord from "../assets/img/delete.png";
import SuperAdminHeader from "../Headers/SuperAdminHeader";

import { Col, Container, Row } from "reactstrap";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import ProfileIcon from "../Images/profile.png";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Tenant Name",
  },
  {
    label: "Lease",
  },
  {
    label: "Lease Type",
  },
  {
    label: "Status",
  },
  {
    label: "Rental Company Name",
  },
];

function Rows(props) {
  const { row, handleClick, isItemSelected, labelId, seletedEditData } = props;
  const navigate = useNavigate();

  const getStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (currentDate >= startDateObj && currentDate <= endDateObj) {
      return "Tenant";
    } else {
      return "Future Tenant";
    }
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row._id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="left">
          {row?.tenant_data?.tenant_firstName}{" "}
          {row?.tenant_data?.tenant_lastName}
        </TableCell>
        <TableCell align="left">
          {row?.unit_data?.rental_unit_adress} - {row?.unit_data?.rental_unit}
        </TableCell>
        <TableCell align="left">{row?.lease_type}</TableCell>
        <TableCell align="left">
          {getStatus(row.start_date, row.end_date)}
        </TableCell>

        <TableCell align="left">
          {row?.start_date} to {row?.end_date}
        </TableCell>
        <TableCell align="left">{row?.rental_city}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Leasing() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let cookies = new Cookies();
  // const history = useHistory();
  // React.useEffect(() => {
  //   const userData = cookies.get("token");
  //   if (!userData) {
  //     history.push("/superadmin/sign-in");
  //   }
  // }, [cookies]);

  const [propertiesData, setPropertiesData] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);
  const [adminName, setAdminName] = useState();
  const { admin_id } = useParams();

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/leases/lease/get/${admin_id}`, {
        params: {
          pageSize: rowsPerPage,
          pageNumber: page,
        },
      });
      setLoader(false);
      setPropertiesData(res.data.data);
      setAdminName(res.data.data[0].admin_data);
      setCountData(res.data.count); // Make sure to adjust the key here
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, [rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = propertiesData?.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Delete selected
  var handleDelete = () => {
    swal("Are You Sure You Want TO Delete ?", {
      buttons: ["No", "Yes"],
    }).then(async (buttons) => {
      if (buttons === true) {
        axios
          .delete(`${baseUrl}/admin/admin`, {
            data: selected,
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              getData();
              setSelected([]);
              toast.success(response.data.message, {
                position: "top-center",
                autoClose: 1000,
              });
            }
          });
      }
    });
  };

  //
  // Searchbar
  const [searchLoader, setSearchLoader] = useState(false);
  let handleSearchData = async (values) => {
    setSearchLoader(true);
    // const token = cookies.get("token");
    let res = await axios.post(`${baseUrl}/plans/search`, {
      search: values,
    });
    if (res.data.statusCode === 200) {
      if (values !== "") {
        setSearchLoader(false);
        setPropertiesData(res.data.data);
        setCountData(res.data.count);
      } else {
        setSearchLoader(false);
        getData();
      }
    }
  };

  //   edit machine-type here
  let [modalShowForPopupForm, setModalShowForPopupForm] = React.useState(false);
  let [id, setId] = React.useState();

  var handleSubmit;

  if (!id) {
    handleSubmit = async (values) => {
      try {
        const res = await axios.post(`${baseUrl}/plans/plans`, values);
        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          toast.success(res.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          toast.error(res.data.message, {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error(error, {
          position: "top-center",
        });
      }
    };
  } else {
    handleSubmit = async (values) => {
      try {
        const response = await axios.put(
          `${baseUrl}/plans/plans/${id}`, // Use template literals to include the id
          values
        );

        if (response.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          toast.success(response.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(error, {
          position: "top-center",
        });
      }
    };
  }

  //    // "add fom logic"
  let [editData, setEditData] = React.useState({});

  //   auto form fill up in edit
  let seletedEditData = async (datas) => {
    setModalShowForPopupForm(true);
    setId(datas._id);
    setEditData(datas);
  };

  const [adminDataCount, setAdminDataCount] = useState();
  const adminCount = async () => {
    try {
      // Make an HTTP request to your API endpoint with the adminId
      const res = await axios.get(
        `${baseUrl}/admin/admin_count/${admin_id}`
      );
      setAdminDataCount(res.data);
    } catch (error) {
      console.error("Error occurred while calling API:", error);
    }
  };

  React.useEffect(() => {
    adminCount();
  }, [admin_id]);

  // Formik
  //   let [ProductDetailsFormik, setProductDetailsFormik] = useState({});
  //   const FormikValues = () => {
  //     const formik = useFormikContext();
  //     React.useEffect(() => {
  //       setProductDetailsFormik(formik.values);
  //     }, [formik.values]);
  //     return null;
  //   };

  const navigate = useNavigate();

  return (
    <>
      <SuperAdminHeader />
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col>
            <nav
              className="navbar navbar-expand-lg navbar-light bg-light mb-1"
              style={{ cursor: "pointer", borderRadius: "15px" }}
            >
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/staffmember/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                      style={{
                        borderBottom: "2px solid transparent",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      Staff Member({adminDataCount?.staff_member})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/propertytype/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                      style={{
                        borderBottom: "2px solid transparent",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      Property Type({adminDataCount?.property_type})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/properties/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                      style={{
                        borderBottom: "2px solid transparent",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      Properties({adminDataCount?.rentals_properties})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/rental-owner/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                      style={{
                        borderBottom: "2px solid transparent",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      Rental Owner({adminDataCount?.rental_owner})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/tenant/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                      style={{
                        borderBottom: "2px solid transparent",
                        borderRadius: "0 0 10px 10px",
                      }}
                    >
                      Tenant({adminDataCount?.tenant})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/unit/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                    >
                      Unit({adminDataCount?.unit})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to={`/superadmin/lease/${admin_id}`}
                      className="nav-link"
                      activeClassName="active"
                    >
                      Lease({adminDataCount?.lease})
                    </NavLink>
                  </li>
                  {/* Add more links as needed */}
                </ul>
              </div>
            </nav>
            <div>
              <Paper
                sx={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Toolbar
                  className="border-top border-bottom"
                  sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    bgcolor: "#fff", // Set the background color here
                    color: "white", // Set the font color to white
                  }}
                >
                  <Typography
                    sx={{ flex: "1 1 100%", color: "black" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                  >
                    Lease: {adminName?.first_name} {adminName?.last_name}
                  </Typography>

                  {/* <form className="form-inline">
                    <input
                      id="serchbar-size"
                      className="form-control mr-sm-2"
                      type="search"
                      onChange={(e) => handleSearchData(e.target.value)}
                      placeholder="Search"
                      aria-label="Search"
                    />
                  </form> */}

                  <>
                    {selected.length > 0 ? (
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete()}>
                          <img
                            src={deleterecord}
                            style={{
                              width: "20px",
                              height: "20px",
                              margin: "10px",
                              alignItems: "center",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </>
                </Toolbar>

                {loader || searchLoader ? (
                  <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                    <Circles
                      height="50"
                      width="50"
                      color="#1171ef"
                      ariaLabel="circles-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </div>
                ) : (
                  <TableContainer>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          {/* <TableCell align="center"></TableCell> */}

                          {headCells.map((headCell, id) => {
                            return (
                              <TableCell
                                style={{ fontWeight: "bold" }}
                                key={id}
                                className="fw-bold"
                                align="left"
                              >
                                {headCell.label}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {propertiesData?.map((row, index) => {
                          const isItemSelected = isSelected(row._id);
                          const labelId = `enhanced-table-checkbox-${index}`;
                          return (
                            <Rows
                              row={row}
                              isItemSelected={isItemSelected}
                              labelId={labelId}
                              handleClick={handleClick}
                              selected={selected}
                              index={index}
                              seletedEditData={seletedEditData}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      component="div"
                      count={countData}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                )}
              </Paper>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
}
