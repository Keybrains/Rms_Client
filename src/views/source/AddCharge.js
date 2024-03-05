import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Popover,
} from "reactstrap";
import ChargeHeader from "components/Headers/ChargeHeader";
import CloseIcon from "@mui/icons-material/Close";
import "jspdf-autotable";
import { values } from "pdf-lib";
import "jspdf-autotable";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { OverlayTrigger } from "react-bootstrap";

const AddCharge = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { lease_id, admin, charge_id } = useParams();
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  
  const [loader, setLoader] = useState(false);

  const generalledgerFormik = useFormik({
    initialValues: {
      charge_id: "",
      date: "",
      total_amount: "",
      charges_memo: "",
      charges: [
        {
          entry_id: "",
          account: "",
          amount: "",
          charge_type: "",
        },
      ],
      charges_attachment: [],
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      total_amount: yup.string().required("Required"),
      charges: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      if (Number(generalledgerFormik.values.total_amount) === Number(total)) {
        handleSubmit(values);
      }
    },
  });

  const editCharge = async (values) => {
    setLoader(true);
    const fileUrl = [];
    if (file) {
      try {
        const uploadPromises = file?.map(async (fileItem, i) => {
          if (fileItem.upload_file instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem.upload_file);

              const res = await axios.post(`${imageUrl}/images/upload`, form);
              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem.upload_file = res.data.files[0].filename;
                fileUrl.push(res.data.files[0].filename);
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            fileUrl.push(fileItem.upload_file);
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const object = {
      charge_id: charge_id,
      admin_id: accessType.admin_id,
      tenant_id: tenantData?.tenant_id,
      lease_id: lease_id,

      entry: values.charges?.map((item) => {
        const data = {
          entry_id: item.entry_id,
          account: item.account,
          amount: Number(item.amount),
          memo: values?.charges_memo || "charge",
          date: values?.date,
          charge_type: item.charge_type,
        };
        return data;
      }),

      total_amount: total,
      uploaded_file: fileUrl,
    };

    try {
      const res = await axios.put(
        `${baseUrl}/charge/charge/${charge_id}`,
        object
      );
      if (res.data.statusCode === 200) {
        toast.success("Charge Updated Successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(`/${admin}/rentrolldetail/${lease_id}`);
        }, 2000);
      } else {
        toast.warning(res.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1000,
      });
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoader(true);
    const fileUrl = [];
    if (file) {
      try {
        const uploadPromises = file?.map(async (fileItem, i) => {
          if (fileItem.upload_file instanceof File) {
            try {
              const form = new FormData();
              form.append("files", fileItem.upload_file);

              const res = await axios.post(`${imageUrl}/images/upload`, form);
              if (
                res &&
                res.data &&
                res.data.files &&
                res.data.files.length > 0
              ) {
                fileItem.upload_file = res.data.files[0].filename;
                fileUrl.push(res.data.files[0].filename);
              } else {
                console.error("Unexpected response format:", res);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
            }
          } else {
            fileUrl.push(fileItem.upload_file);
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error processing file uploads:", error);
      }
    }

    const object = {
      admin_id: accessType.admin_id,
      tenant_id: tenantData?.tenant_id,
      lease_id: lease_id,

      entry: values.charges?.map((item) => {
        const data = {
          account: item.account,
          amount: Number(item.amount),
          memo: values?.charges_memo || "charge",
          date: values?.date,
          account: item.account,
          charge_type: item.charge_type,
          is_repeatable: false,
        };
        return data;
      }),

      total_amount: total,
      is_leaseAdded: false,
      uploaded_file: fileUrl,
    };

    try {
      const res = await axios.post(`${baseUrl}/charge/charge`, object);
      if (res.data.statusCode === 200) {
        toast.success("Charge Added Successfully", {
          position: "top-center",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(`/${admin}/rentrolldetail/${lease_id}`);
        }, 2000);
      } else {
        toast.warning(res.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      setLoader(false);
    }
  };

  const [recAccounts, setRecAccounts] = useState([]);
  const [oneTimeAccounts, setoneTimeAccounts] = useState([]);
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/accounts/accounts/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        const filteredData1 = res.data.data.filter(
          (item) => item.charge_type === "Recurring Charge"
        );
        const filteredData2 = res.data.data.filter(
          (item) => item.charge_type === "One Time Charge"
        );
        setRecAccounts(filteredData1);
        setoneTimeAccounts(filteredData2);
      } else if (res.data.statusCode === 201) {
        setRecAccounts();
        setoneTimeAccounts();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchTenant = async () => {
    try {
      const res = await axios.get(`${baseUrl}/leases/lease_tenant/${lease_id}`);
      if (res.data.statusCode === 200) {
        setTenantData(res.data.data);
      }
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

  const fetchChargeData = async () => {
    if (charge_id) {
      try {
        const res = await axios.get(`${baseUrl}/charge/charge/${charge_id}`);
        if (res.data.statusCode === 200) {
          const data = res.data.data[0];
          setFile(data?.uploaded_file);
          generalledgerFormik.setValues({
            charge_id: charge_id,
            date: data.entry[0].date,
            total_amount: data?.total_amount,
            charges_memo: data.entry[0].memo,
            charges: data.entry.map((item) => {
              const items = {
                entry_id: item.entry_id,
                account: item.account,
                amount: item.amount,
                charge_type: item.charge_type,
              };
              return items;
            }),
            charges_attachment: data?.uploaded_file,
          });
        }
      } catch (error) {
        console.error("Error: ", error.message);
      }
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [accessType?.admin_id]);

  useEffect(() => {
    fetchTenant();
  }, [lease_id]);

  useEffect(() => {
    fetchChargeData();
  }, [charge_id]);

  const [tenantData, setTenantData] = useState({});

  const toggleDropdown = (index) => {
    const updatedCharges = [...generalledgerFormik.values.charges];
    updatedCharges[index].dropdownOpen = !updatedCharges[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      charges: updatedCharges,
    });
  };

  const handleAccountSelection = (value, index, chargeType) => {
    const updatedCharges = [...generalledgerFormik.values.charges];

    if (updatedCharges[index]) {
      updatedCharges[index].account = value;
      updatedCharges[index].charge_type = chargeType;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        charges: updatedCharges,
      });
    }
  };

  const [total, setTotal] = useState(0);
  const handleTotal = () => {
    let sum = 0;
    generalledgerFormik.values.charges?.forEach((element) => {
      sum += parseInt(Number(element.amount));
    });
    setTotal(sum);
  };

  useEffect(() => {
    handleTotal();
  }, [generalledgerFormik.values.charges]);

  const handleAddRow = () => {
    const newCharges = {
      account: "",
      amount: "",
      total_amount: "",
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      charges: [...generalledgerFormik.values.charges, newCharges],
    });
  };

  const handleRemoveRow = (index) => {
    const updatedCharges = [...generalledgerFormik.values.charges];
    updatedCharges.splice(index, 1);
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      charges: updatedCharges,
    });
  };

  const [file, setFile] = useState([]);
  const fileData = (files) => {
    const filesArray = [...files];

    if (file.length <= 10 && file.length === 0) {
      const finalArray = [];
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    generalledgerFormik.setFieldValue("charges_attachment", newFile);
  };

  const handleOpenFile = (item) => {
    if (typeof item !== "string") {
      const url = URL.createObjectURL(item?.upload_file);
      window.open(url, "_blank");
    } else {
      window.open(
        `${imageGetUrl}/${item}`,
        "_blank"
      );
    }
  };

  const handleCloseButtonClick = () => {
    navigate(`/${admin}/rentrolldetail/${lease_id}`);
  };

  return (
    <>
      <ChargeHeader />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card
              className="bg-secondary shadow"
              onSubmit={generalledgerFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {charge_id ? "Edit Charge" : "New Charge"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col lg="2">
                      <label
                        className="form-control-label"
                        htmlFor="input-unitadd"
                      >
                        Charge for:{" "}
                        <span>
                          {tenantData?.tenant_firstName}{" "}
                          {tenantData?.tenant_lastName}
                        </span>
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="3000"
                          type="date"
                          name="date"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.date}
                        />
                        {generalledgerFormik.touched.date &&
                        generalledgerFormik.errors.date ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.date}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {/* </Row> */}
                    {/* <Row> */}
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Amount
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="$0.00"
                          type="number"
                          name="total_amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.total_amount}
                        />
                        {generalledgerFormik.touched.total_amount &&
                        generalledgerFormik.errors.total_amount ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.total_amount}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Memo
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="if left blank, will show 'charge'"
                          type="text"
                          name="charges_memo"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.charges_memo}
                        />
                        {generalledgerFormik.touched.charges_memo &&
                        generalledgerFormik.errors.charges_memo ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.charges_memo}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                {generalledgerFormik.values.charges?.map(
                                  (charges, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={charges.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {charges.account
                                              ? charges.account
                                              : "Select"}
                                          </DropdownToggle>
                                          <DropdownMenu
                                            style={{
                                              zIndex: 999,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Liability Account
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Last Month's Rent",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Last Month's Rent
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Prepayments",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Prepayments
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Security Deposit Liability",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Security Deposit Liability
                                            </DropdownItem>
                                            {recAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  Reccuring Charges
                                                </DropdownItem>
                                                {recAccounts?.map((item) => (
                                                  <DropdownItem
                                                    key={item._id}
                                                    onClick={() => {
                                                      handleAccountSelection(
                                                        item.account,
                                                        index,
                                                        "Recurring Charge"
                                                      );
                                                    }}
                                                  >
                                                    {item.account}
                                                  </DropdownItem>
                                                ))}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {oneTimeAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  One Time Charges
                                                </DropdownItem>
                                                {oneTimeAccounts?.map(
                                                  (item) => (
                                                    <DropdownItem
                                                      key={item._id}
                                                      onClick={() => {
                                                        handleAccountSelection(
                                                          item.account,
                                                          index,
                                                          "One Time Charge"
                                                        );
                                                      }}
                                                    >
                                                      {item.account}
                                                    </DropdownItem>
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </DropdownMenu>
                                        </Dropdown>
                                      </td>
                                      {/* <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`charges[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={charges.balance}
                                        />
                                        {generalledgerFormik.touched.charges &&
                                        generalledgerFormik.touched.charges[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.charges &&
                                        generalledgerFormik.errors.charges[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.charges[
                                          index
                                        ].balance ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .charges[index].balance
                                            }
                                          </div>
                                        ) : null}
                                      </td> */}
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          style={{ width: "80%" }}
                                          type="text"
                                          name={`charges[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={(e) => {
                                            generalledgerFormik.handleChange(e);
                                            // handleTotal();
                                          }}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                          value={charges.amount}
                                        />
                                        {generalledgerFormik.touched.charges &&
                                        generalledgerFormik.touched.charges[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.charges &&
                                        generalledgerFormik.errors.charges[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.charges[
                                          index
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .charges[index].amount
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      {!charge_id && (
                                        <td>
                                          <ClearIcon
                                            type="button"
                                            style={{
                                              cursor: "pointer",
                                              padding: 0,
                                            }}
                                            onClick={() =>
                                              handleRemoveRow(index)
                                            }
                                          >
                                            Remove
                                          </ClearIcon>
                                        </td>
                                      )}
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <th>Total</th>
                                  <th>{total.toFixed(2)}</th>
                                </tr>
                                {Number(
                                  generalledgerFormik.values.total_amount || 0
                                ) !== Number(total) ? (
                                  <tr>
                                    <th colSpan={2}>
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                        }}
                                      >
                                        The payment's amount must match the
                                        total applied to balance. The difference
                                        is $
                                        {Math.abs(
                                          generalledgerFormik.values
                                            .total_amount - total
                                        ).toFixed(2)}
                                      </span>
                                    </th>
                                  </tr>
                                ) : null}
                              </>
                            </tbody>
                            {!charge_id && (
                              <tfoot>
                                <tr>
                                  <td colSpan="4">
                                    <Button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleAddRow}
                                    >
                                      Add Row
                                    </Button>
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div className="d-flex">
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" className="btn">
                              Choose Files
                            </label>
                          </div>

                          <div className="d-flex ">
                            {file?.length > 0 &&
                              file?.map((file, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    marginLeft: "50px",
                                  }}
                                >
                                  <p
                                    onClick={() =>
                                      handleOpenFile(file ? file : file)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file && typeof file !== "string"
                                      ? file?.file_name?.substr(0, 5)
                                      : file.substr(0, 5)}
                                    {file && typeof file !== "string"
                                      ? file?.file_name?.length > 5
                                        ? "..."
                                        : null
                                      : file?.length > 5
                                      ? "..."
                                      : null}
                                  </p>
                                  <CloseIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      left: "64px",
                                      top: "-2px",
                                    }}
                                    onClick={() => deleteFile(index)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {loader ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              background: "green",
                              cursor: "not-allowed",
                            }}
                            disabled
                          >
                            Loading...
                          </button>
                        ) : charge_id ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editCharge(generalledgerFormik.values);
                            }}
                          >
                            Edit Charge
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              generalledgerFormik.handleSubmit();
                            }}
                          >
                            Add Charge
                          </button>
                        )}

                        <Button
                          color="primary"
                          className="btn btn-primary"
                          onClick={handleCloseButtonClick}
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
};

export default AddCharge;
