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
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../Images/profile.png";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Name",
  },
  {
    label: "Company Name",
  },
  {
    label: "Mobile",
  },
  {
    label: "Email",
  },
  {
    label: "Date",
  },
];

function Rows(props) {
  const { row, handleClick, isItemSelected, labelId, seletedEditData } = props;
  const navigate = useNavigate();

  const handleLoginButtonClick = async () => {
    try {
      // Make an HTTP request to your API endpoint with the adminId
      await axios.get(`http://192.168.1.19:4000/api/test/${row.admin_id}`);
      console.log("API called successfully");
    } catch (error) {
      console.error("Error occurred while calling API:", error);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => {
          // handleClick(event, row.admin_id);
          navigate(`/superadmin/staffmember/${row?.admin_id}`);
        }}
        style={{ cursor: "pointer" }}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        <TableCell align="center" padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onClick={(event) => {
              event.stopPropagation();
              handleClick(event, row.admin_id);
            }}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="left">
          <img src={ProfileIcon} /> {row?.first_name} {row?.last_name}
        </TableCell>
        <TableCell align="left">{row?.company_name}</TableCell>
        <TableCell align="left">{row?.phone_number}</TableCell>
        <TableCell align="left">{row?.email}</TableCell>
        <TableCell align="left">
          {new Date(row.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </TableCell>

        <TableCell align="left">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleLoginButtonClick();
            }}
          >
            Login
          </Button>
        </TableCell>

        {/* <TableCell align="left">
          <button onClick={handleLoginClick}>Login</button>
        </TableCell> */}
      </TableRow>
    </React.Fragment>
  );
}

export default function Admin() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [accessType, setAccessType] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  let [adminData, setAdminData] = useState([]);
  let [loader, setLoader] = React.useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/admin`, {
        params: {
          pageSize: rowsPerPage,
          pageNumber: page,
        },
      });
      setLoader(false);
      setAdminData(res.data.data);
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
      const newSelected = adminData?.map((n) => n.admin_id);
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
            } else {
              toast.error(response.data.message, {
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
        setAdminData(res.data.data);
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
        values["is_addby_superdmin"] = true;
        values["role"] = "admin";
        const res = await axios.post(`${baseUrl}/admin/register`, values);
        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          toast.success(res.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
        } else if (res.data.statusCode === 401) {
          toast.error(res.data?.message, {
            position: "top-center",
            autoClose: 1000,
          });
        } else if (res.data.statusCode === 402) {
          toast.error(res.data?.message, {
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

  // Formik
  //   let [ProductDetailsFormik, setProductDetailsFormik] = useState({});
  //   const FormikValues = () => {
  //     const formik = useFormikContext();
  //     React.useEffect(() => {
  //       setProductDetailsFormik(formik.values);
  //     }, [formik.values]);
  //     return null;
  //   };

  return (
    <>
      <SuperAdminHeader />
      <Container className="mt--8 ml--10" fluid>
        <Row>
          <Col>
            <div>
              <div id="main-btn-add-machinetype">
                <div className="d-flex flex-row justify-content-end mb-2">
                  <Button
                    className="text-capitalize"
                    size="small"
                    onClick={() => {
                      setModalShowForPopupForm(true);
                      setId(null);
                      setEditData({});
                    }}
                    variant="contained"
                    style={{ backgroundColor: "#4A5073", color: "#ffffff" }} // Set background color and text color
                  >
                    Add Admin
                  </Button>
                </div>
              </div>

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
                    Admin
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

                          <TableCell align="center" padding="checkbox">
                            <Checkbox
                              color="primary"
                              indeterminate={
                                selected.length > 0 &&
                                selected.length < adminData?.length
                              }
                              checked={
                                adminData?.length > 0 &&
                                selected.length === adminData?.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                          </TableCell>
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
                        {adminData?.map((row, index) => {
                          const isItemSelected = isSelected(row.admin_id);
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
            <Dialog
              fullWidth
              open={modalShowForPopupForm}
              onClose={() => setModalShowForPopupForm(false)}
            >
              <DialogTitle>{"Admin Form"}</DialogTitle>
              <DialogContent dividers>
                <Formik
                  initialValues={{
                    first_name:
                      editData && editData.first_name
                        ? editData.first_name
                        : "",
                    last_name:
                      editData && editData.last_name ? editData.last_name : "",
                    email: editData && editData.email ? editData.email : "",
                    company_name:
                      editData && editData.company_name
                        ? editData.company_name
                        : "",

                    phone_number:
                      editData && editData.phone_number
                        ? editData.phone_number
                        : "",
                    password:
                      editData && editData.password ? editData.password : "",
                  }}
                  validationSchema={Yup.object().shape({
                    first_name: Yup.string().required("Required"),
                    last_name: Yup.string().required("Required"),
                    email: Yup.string().required("Required"),
                    company_name: Yup.string().required("Required"),
                    phone_number: Yup.number().required("Required"),
                    password: Yup.string().required("Required"),
                  })}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values);
                    resetForm(values);
                  }}
                >
                  {({ values, errors, touched, handleBlur, handleChange }) => (
                    <Form>
                      {/* <FormikValues /> */}
                      <div>
                        {/* Plan Name */}
                        <div className="mt-3">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="First Name *"
                            label="First Name *"
                            name="first_name"
                            value={values.first_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.first_name && errors.first_name ? (
                            <div className="text-danger">
                              {errors.first_name}
                            </div>
                          ) : null}
                        </div>

                        {/* Plan Price */}
                        <div className="mt-3">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Last Name *"
                            label="Last Name *"
                            name="last_name"
                            value={values.last_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.last_name && errors.last_name ? (
                            <div className="text-danger">
                              {errors.last_name}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Email *"
                            label="Email *"
                            name="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.email && errors.email ? (
                            <div className="text-danger">{errors.email}</div>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Company Name *"
                            label="Company Name *"
                            name="company_name"
                            value={values.company_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.company_name && errors.company_name ? (
                            <div className="text-danger">
                              {errors.company_name}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Phone Number *"
                            label="Phone Number *"
                            name="phone_number"
                            value={values.phone_number}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.phone_number && errors.phone_number ? (
                            <div className="text-danger">
                              {errors.phone_number}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3">
                          <TextField
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Password *"
                            label="Password *"
                            name="password"
                            value={values.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.password && errors.password ? (
                            <div className="text-danger">{errors.password}</div>
                          ) : null}
                        </div>

                        {!id ? (
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="primary"
                          >
                            Add
                          </Button>
                        ) : (
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="warning"
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
}
