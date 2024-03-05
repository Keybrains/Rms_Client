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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Radio, RadioGroup, FormGroup } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "universal-cookie";
import moment from "moment";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "@mui/material/Switch";
// import { useHistory } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import deleterecord from "../assets/img/delete.png";
import SuperAdminHeader from "../Headers/SuperAdminHeader";
// import ArrowDownLineIcon from "@rsuite/icons/ArrowDownLine";
// import ArrowUpLineIcon from "@rsuite/icons/ArrowUpLine";
import { jwtDecode } from "jwt-decode";
import { Col, Container, Row } from "reactstrap";

const label = { inputProps: { "aria-label": "Switch demo" } };

const headCells = [
  {
    label: "Plan Name",
  },
  {
    label: "Free/Paid",
  },
  {
    label: "Price",
  },
  {
    label: "Annual Discount",
  },
  {
    label: "Duration",
  },
  // {
  //   label: "Max Add.",
  // },
  // {
  //   label: "Annual Discount",
  // },
  {
    label: "Date",
  },
];

function Rows(props) {
  const { row, handleClick, isItemSelected, labelId, seletedEditData } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate()

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={(event) => handleClick(event, row.plan_id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>

        {/* <TableCell align="center">{ row + 1}</TableCell> */}
        <TableCell align="center">{row?.plan_name}</TableCell>
        <TableCell align="center">
          {row?.is_free_trial ? (
            <span className="badge badge-pill bg-warning text-dark">Free</span>
          ) : (
            <span className="badge badge-pill bg-success">Paid</span>
          )}
        </TableCell>
        <TableCell align="center">{row?.plan_price}</TableCell>
        <TableCell align="center">
          {console.log(row,'row')}
          {row?.annual_discount != null ? row.annual_discount + "%" : "-"}
        </TableCell>
        <TableCell align="center">
          { row?.billing_interval }
        </TableCell>
        {/* <TableCell align="center">
          {row.is_free_trial === true ? row?.plan_days : "Monthly"}
        </TableCell> */}
        {/* <TableCell align="center">{row?.maximum_add}</TableCell>
        <TableCell align="center">
          {row?.annual_discount === null ? (
            "-"
          ) : (
            // row?.annual_discount + "%"
            <span class="badge badge-pill badge-info">
              {row?.annual_discount + "%"}
            </span>
          )}
        </TableCell> */}
        <TableCell align="center">
          {moment(row.createdAt).format("DD-MM-YYYY")}
        </TableCell>

        {/* <TableCell align="center">
          <button
            class="btn "
            onClick={() => {
              navigate(`/superadmin/addplan/${row.plan_id}`)
              // seletedEditData(row);
            }}
          >
            <EditIcon />
          </button>
        </TableCell> */}
      </TableRow>

      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ paddingLeft: 15, margin: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Other Data :
            </Typography>
            <hr />

            <table
              style={{
                fontFamily: "arial, sans-serif",
                border: "collapse",
                width: "50%",
              }}
            >
              <tr>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Index
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    textAlign: "left",
                    padding: "8px",
                  }}
                >
                  Feature
                </th>
              </tr>

              {row?.features?.map((index, id) => (
                <tr key={id}>
                  <th
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {id + 1}
                  </th>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "left",
                      padding: "8px",
                    }}
                  >
                    {index?.features}
                  </td>
                </tr>
              ))}
            </table>
          </Box>
        </Collapse>
      </TableCell>
    </React.Fragment>
  );
}

const PlanList = () => {
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

  let [priorityData, setPriorityData] = useState([]);
  let [loader, setLoader] = useState(true);
  let [countData, setCountData] = useState(0);

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/plans/plans`, {
        params: {
          pageSize: rowsPerPage,
          pageNumber: page,
        },
      });
      setLoader(false);
      setPriorityData(res.data.data);
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
      const newSelected = priorityData?.map((n) => n.plan_id);
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
          .delete(`${baseUrl}/plans/plans`, {
            data: selected,
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              // axios.delete(`${baseUrl}/nmipayment/delete-plan`,{
              //   planId:selected
              // });
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
        setPriorityData(res.data.data);
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
  const [showBillingPeriods, setShowBillingPeriods] = useState(false);

  var handleSubmit;

  if (!id) {
    handleSubmit = async (values) => {
      try {
        values["features"] = inputFields;
        const res = await axios.post(`${baseUrl}/plans/plans`, values);
        if (res.data.statusCode === 200) {
          setModalShowForPopupForm(false);
          getData();
          toast.success(res.data?.message, {
            position: "top-center",
          });
        } else {
          toast.error(res.data.message, {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error:", error);
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
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.warning(error, {
          position: "top-center",
        });
      }
    };
  }

  // "add form logic"
  let [editData, setEditData] = React.useState({});

  //   auto form fill up in edit
  let seletedEditData = async (datas) => {
    setModalShowForPopupForm(true);
    setId(datas._id);
    setEditData(datas);
  };

  const [inputFields, setInputFields] = useState([
    {
      features: "",
    },
  ]);

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        features: "",
      },
    ]);
  };
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };
  const handleFeaturesChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    setInputFields(list);
  };
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
                    // onClick={() => {
                    //   setModalShowForPopupForm(true);
                    //   setId(null);
                    //   setShowBillingPeriods(false);
                    //   setEditData({});
                    //   setInputFields([
                    //     {
                    //       features: "",
                    //     },
                    //   ]);
                    // }}
                    onClick={() => navigate("/superadmin/addplan")}
                    variant="contained"
                    style={{ backgroundColor: "#4A5073", color: "#ffffff" }} // Set background color and text color
                  >
                    Add Plan
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
                  {selected.length > 0 ? (
                    <Typography
                      sx={{ flex: "1 1 100%" }}
                      color="inherit"
                      variant="subtitle1"
                      component="div"
                    >
                      {selected.length} selected
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ flex: "1 1 100%", color: "black" }}
                      variant="h6"
                      id="tableTitle"
                      component="div"
                    >
                      Plans
                    </Typography>
                  )}

                  <form className="form-inline">
                    <input
                      id="serchbar-size"
                      className="form-control mr-sm-2"
                      type="search"
                      onChange={(e) => handleSearchData(e.target.value)}
                      placeholder="Search"
                      aria-label="Search"
                    />
                  </form>

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
                          <TableCell align="center"></TableCell>

                          <TableCell align="center" padding="checkbox">
                            <Checkbox
                              color="primary"
                              indeterminate={
                                selected.length > 0 &&
                                selected.length < priorityData?.length
                              }
                              checked={
                                priorityData?.length > 0 &&
                                selected.length === priorityData?.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all desserts",
                              }}
                            />
                          </TableCell>
                                  {console.log("selected", selected)}
                          {/* <TableCell align="center"></TableCell> */}

                          {headCells.map((headCell, id) => {
                            return (
                              <TableCell
                                key={id}
                                className="fw-bold"
                                align="center"
                              >
                                {headCell.label}
                              </TableCell>
                            );
                          })}

                          {/* <TableCell className="fw-bold" align="center">
                            Action
                          </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {priorityData?.map((row, index) => {
                          const isItemSelected = isSelected(row.plan_id);
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
              <DialogTitle>{"Plan Form"}</DialogTitle>
              <DialogContent dividers>
                <Formik
                  initialValues={{
                    plan_name:
                      editData && editData.plan_name ? editData.plan_name : "",
                    plan_price:
                      editData && editData.plan_price
                        ? editData.plan_price
                        : "",
                    maximum_add:
                      editData && editData.maximum_add
                        ? editData.maximum_add
                        : "",
                    plan_days:
                      editData && editData.plan_days ? editData.plan_days : "",
                    is_annual_discount:
                      editData && editData.is_annual_discount
                        ? editData.is_annual_discount === "true"
                        : false,
                    annual_discount:
                      editData && editData.annual_discount
                        ? editData.annual_discount
                        : "",
                  }}
                  validationSchema={Yup.object().shape({
                    plan_name: Yup.string().required("Required"),
                    plan_price: Yup.number().required("Required"),
                    maximum_add: Yup.number().required("Required"),
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
                            placeholder="Add Plan *"
                            label="Plan Name*"
                            name="plan_name"
                            value={values.plan_name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.plan_name && errors.plan_name ? (
                            <div className="text-danger">
                              {errors.plan_name}
                            </div>
                          ) : null}
                        </div>

                        {/* Plan Price */}
                        <div className="mt-3">
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Add Price *"
                            label="Cost Per Billing Cycle *"
                            name="plan_price"
                            value={values.plan_price}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.plan_price && errors.plan_price ? (
                            <div className="text-danger">
                              {errors.plan_price}
                            </div>
                          ) : null}
                        </div>

                        {/*  Add Days (If set plna price 0 means this is free plan so after show add Days how many days this plan for free) */}
                        {values.plan_price === 0 ? (
                          <div className="mt-3">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Add Days *"
                              label="Add Days *"
                              name="plan_days"
                              value={values.plan_days}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.plan_days && errors.plan_days ? (
                              <div className="text-danger">
                                {errors.plan_days}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {/* Set Interval (this plan for how many time Monthly/Annually) */}
                        {/* {values.plan_price !== 0 ? (
                          <div className="mt-3">
                            <FormControl fullWidth>
                              <InputLabel size="small">
                                Plan Billing Interval
                              </InputLabel>
                              <Select
                                size="small"
                                label="Select Billing-Interval"
                                name="billing_interval"
                                value={values.billing_interval}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                MenuProps={{
                                  style: {
                                    maxHeight: 210,
                                  },
                                }}
                              >
                                <MenuItem value={"Monthly"}>Monthly</MenuItem>
                                <MenuItem value={"Annual"}>Annual</MenuItem>
                              </Select>
                              {touched.billing_interval &&
                              errors.billing_interval ? (
                                <div className="text-danger">
                                  {errors.billing_interval}
                                </div>
                              ) : null}
                            </FormControl>
                          </div>
                        ) : null} */}

                        {values.plan_price === 0 ||
                        values.plan_price === "" ? null : (
                          <div className="mt-3">
                            <FormControl fullWidth>
                              <InputLabel size="small">
                                Anuual Discount?
                              </InputLabel>
                              <Select
                                size="small"
                                label="Anuual Discount?"
                                name="is_annual_discount"
                                value={values.is_annual_discount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                MenuProps={{
                                  style: {
                                    maxHeight: 210,
                                  },
                                }}
                              >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                              </Select>
                              {touched.is_annual_discount &&
                              errors.is_annual_discount ? (
                                <div className="text-danger">
                                  {errors.is_annual_discount}
                                </div>
                              ) : null}
                            </FormControl>
                          </div>
                        )}

                        {values.is_annual_discount === true ? (
                          <div className="mt-3">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Add Annual Discount *"
                              label="Add Annual Discount *"
                              name="annual_discount"
                              value={values.annual_discount}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.annual_discount &&
                            errors.annual_discount ? (
                              <div className="text-danger">
                                {errors.annual_discount}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <div className="mt-3">
                          <TextField
                            type="number"
                            size="small"
                            fullWidth
                            placeholder="Maximum Add Count *"
                            label="Maximum Add Count *"
                            name="maximum_add"
                            value={values.maximum_add}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                          {touched.maximum_add && errors.maximum_add ? (
                            <div className="text-danger">
                              {errors.maximum_add}
                            </div>
                          ) : null}
                        </div>

                        <div className="col-sm-8">
                          {inputFields.map((data, index) => {
                            const { features } = data;
                            return (
                              <div className="row" key={index}>
                                <div className="col">
                                  <div className="form-group">
                                    <TextField
                                      type="text"
                                      size="small"
                                      fullWidth
                                      onChange={(evnt) =>
                                        handleFeaturesChange(index, evnt)
                                      }
                                      value={features}
                                      name="features"
                                      className="form-control"
                                      placeholder="Features"
                                    />
                                  </div>
                                  <div className="">
                                    {inputFields.length !== 1 ? (
                                      <div
                                        className="mt-2"
                                        style={{ cursor: "pointer" }}
                                        onClick={removeInputFields}
                                      >
                                        ✖️
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="row">
                            <div className="col-sm-12">
                              <button
                                className="btn btn-outline-primary"
                                sm
                                onClick={addInputField}
                              >
                                Add New
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Set how many times you wish to charge the
                              customer?
                            </FormLabel>
                            <RadioGroup
                              aria-label="billingOption"
                              name="billingOption"
                              value={values.billingOption}
                              onChange={handleChange}
                            >
                              <FormControlLabel
                                value="autoRenew"
                                control={<Radio />}
                                onChange={() => setShowBillingPeriods(true)}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Auto renew plan after term expires
                                  </span>
                                }
                              />
                              <FormControlLabel
                                value="chargeUntilTerm"
                                control={<Radio />}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Charge customers until their term commitment
                                    expires
                                  </span>
                                }
                                onChange={() => setShowBillingPeriods(false)}
                              />
                              <FormControlLabel
                                value="chargeUntilCancellation"
                                control={<Radio />}
                                onChange={() => setShowBillingPeriods(false)}
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Charge customers until cancellation, no term
                                    commitment
                                  </span>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>

                        {showBillingPeriods && (
                          <div className="mt-2 mb-3">
                            <TextField
                              type="number"
                              size="small"
                              fullWidth
                              placeholder="Add Number *"
                              label="Number of Billing Periods *"
                              name="plan_periods"
                              value={values.plan_periods}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                            {touched.plan_periods && errors.plan_periods ? (
                              <div className="text-danger">
                                {errors.plan_periods}
                              </div>
                            ) : null}
                          </div>
                        )}

                        <div className="mt-3">
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Additional Options:
                            </FormLabel>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.earlyCancellationFee}
                                    onChange={handleChange}
                                    name="earlyCancellationFee"
                                  />
                                }
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Set early membership cancellation fee
                                  </span>
                                }
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.changePlan}
                                    onChange={handleChange}
                                    name="changePlan"
                                  />
                                }
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Allow member to change plan
                                  </span>
                                }
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.cancelMembership}
                                    onChange={handleChange}
                                    name="cancelMembership"
                                  />
                                }
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Allow member to cancel billing/membership
                                  </span>
                                }
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.pauseMembership}
                                    onChange={handleChange}
                                    name="pauseMembership"
                                  />
                                }
                                label={
                                  <span style={{ fontSize: "0.8rem" }}>
                                    Allow member to pause billing/membership
                                  </span>
                                }
                              />
                            </FormGroup>
                          </FormControl>
                        </div>

                        {!id ? (
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="success"
                          >
                            Add Plan
                          </Button>
                        ) : (
                          <Button
                            className="mt-3"
                            type="submit"
                            variant="warning"
                          >
                            Update Plan
                          </Button>
                        )}
                        <Button
                          className="mt-3"
                          type=""
                          variant=""
                          onClick={() => setModalShowForPopupForm(false)}
                        >
                          Cancel
                        </Button>
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
};

export default PlanList;
