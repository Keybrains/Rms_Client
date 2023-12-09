import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

function AccountDialog(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [selectedAccountType, setselectedAccountType] = useState("");
  const [selectedAccountLevel, setselectedAccountLevel] = useState("");
  const [selectedFundType, setselectedFundType] = useState("");
  const [AddBankAccountDialogOpen, setAddBankAccountDialogOpen] =
    useState(false);
  const [selectedAccount, setselectedAccount] = useState("");

  const hadleselectedAccountType = (frequency) => {
    setselectedAccountType(frequency);
    accountFormik.values.account_type = frequency;
    // localStorage.setItem("leasetype", leasetype);
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setselectedAccountLevel(value);
  };

  const hadleselectedAccountLevel = (level) => {
    setselectedAccountLevel(level);
  };

  const hadleselectedFundType = (level) => {
    setselectedFundType(level);
    accountFormik.values.fund_type = level;
  };

  const handleCloseDialog = () => {
    props.setAddBankAccountDialogOpen(false);
  };

  let accountFormik = useFormik({
    initialValues: {
      account_name: "",
      account_type: "",
      // account_number: "",
      fund_type: "",
      notes: "",
    },
    validationSchema: yup.object({
      account_name: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleAdd(values);
      //console.log(values, "values");
    },
  });

  const navigate = useNavigate();
  // //console.log(props,'props');

  const handleAdd = async (values) => {
    values["account_name "] = props.selectedAccount;
    values["account_type"] = selectedAccountType;
    values["fund_type"] = selectedFundType;
    if (props.accountTypeName === "rentAccountName") {
      try {
        const res = await axios.post(
          `${baseUrl}/addaccount/addaccount`,
          values
        );
        if (res.status === 200) {
          swal("", res.data.message, "success");
          props.setToggleApiCall(!props.toggleApiCall);
          props.hadleselectedAccount(values.account_name)

          // navigate("/admin/RentRollLeaseing");
        } else {
          swal("", res.data.message, "error");
        }
        accountFormik.setValues({
          account_name: "",
          account_type: "",
          // account_number: "",
          fund_type: "",
          notes: "",
        });
      } catch (error) {
        if (error.response.status === 400) {
          swal("", "Account already exists", "warning");
        }
        accountFormik.setValues({
          account_name: "",
          account_type: "",
          // account_number: "",
          fund_type: "",
          notes: "",
        });
        //console.log(error, "error");
      }
    }

    if (props.accountTypeName === "recAccountName") {
      try {
        // values["property_type"] = localStorage.getItem("propertyType");
        const res = await axios.post(
          `${baseUrl}/recurringAcc/addRecuringAcc`,
          values
        );
        if (res.data.statusCode === 200) {
          swal("", res.data.message, "success");
          // navigate("/admin/RentRollLeaseing");
          props.setToggleApiCall(!props.toggleApiCall);
          props.hadleselectedRecuringAccount(values.account_name)
          accountFormik.setValues({
            account_name: "",
            account_type: "",
            // account_number: "",
            fund_type: "",
            notes: "",
          });
        } else {
          swal("", res.data.message, "error");
        }
      } catch (error) {
        //console.log(error);
      }
    }
    if (props.accountTypeName === "oneTimeName") {
      try {
        // values["property_type"] = localStorage.getItem("propertyType");
        const res = await axios.post(
          `${baseUrl}/onetimecharge/addOneTimeAcc`,
          values
        );
        if (res.data.statusCode === 200) {
          swal("", res.data.message, "success");
          // navigate("/admin/RentRollLeaseing");
          props.setToggleApiCall(!props.toggleApiCall);
          props.hadleselectedOneTimeAccount(values.account_name)
          accountFormik.setValues({
            account_name: "",
            account_type: "",
            // account_number: "",
            fund_type: "",
            notes: "",
          });
        } else {
          swal("", res.data.message, "error");
        }
      } catch (error) {
        //console.log(error);
      }
    }
    // try {
    //   // values["property_type"] = localStorage.getItem("propertyType");
    //   const res = await axios.post(
    //     "https://propertymanager.cloudpress.host/api/addaccount/addaccount",
    //     values
    //   );
    //   if (res.data.statusCode === 200) {
    //     swal("", res.data.message, "success");
    //     navigate("/admin/Leaseing");
    //   } else {
    //     swal("", res.data.message, "error");
    //   }
    // } catch (error) {
    //   //console.log(error);
    // }
  };
  return (
    <Dialog
      // open={AddBankAccountDialogOpen}
      // onClose={handleCloseDialog}
      open={props.AddBankAccountDialogOpen}
      onClose={props.handleCloseDialog}
    >
      <DialogTitle style={{ background: "#F0F8FF" }}>Add account</DialogTitle>
      <DialogContent
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="formInput" style={{ margin: "10px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Account Name *
          </label>
          <br />
          <Input
            className="form-control-alternative"
            id="input-accname"
            placeholder="Account Name"
            type="text"
            name="account_name"
            onBlur={accountFormik.handleBlur}
            onChange={accountFormik.handleChange}
            value={accountFormik.values.account_name}
          />
          {accountFormik.touched.account_name &&
            accountFormik.errors.account_name ? (
            <div style={{ color: "red" }}>
              {accountFormik.errors.account_name}
            </div>
          ) : null}
        </div>

        <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Account Type
          </label>
          <br />
          <Dropdown
            //   isOpen={selectAccountDropDown}
            //   toggle={toggle8}
            isOpen={props.selectAccountDropDown}
            toggle={props.toggle8}
          >
            <DropdownToggle caret style={{ width: "100%" }}>
              {selectedAccountType ? selectedAccountType : "Select"}
            </DropdownToggle>
            <DropdownMenu
              style={{ width: "100%" }}
              name="rent_cycle"
              onBlur={accountFormik.handleBlur}
              onChange={accountFormik.handleChange}
              value={accountFormik.values.account_type}
            >
              {/* {accountFormik.touched.account_type &&
              accountFormik.errors.account_type ? (
                <div style={{ color: "red" }}>
                  {accountFormik.errors.account_type}
                </div>
              ) : null} */}
              <DropdownItem onClick={() => hadleselectedAccountType("Income")}>
                Income
              </DropdownItem>
              <DropdownItem
                onClick={() => hadleselectedAccountType("Non Operating Income")}
              >
                Non Operating Income
              </DropdownItem>
            </DropdownMenu>
            {/* {//console.log(accountFormik.values, selectedAccountType)} */}
          </Dropdown>
        </div>
        {/* <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Account Level
          </label>
          <br />
          <FormGroup check>
            <Label
              check
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
              }}
            >
              <Input
                type="radio"
                name="radio1"
                value="Parent Account"
                onChange={handleRadioChange}
              />{" "}
              Parent Account
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label
              check
              style={{
                fontSize: "15px",
                fontFamily: "sans-serif",
              }}
            >
              <Input
                type="radio"
                name="radio1"
                value="Sub Account"
                onChange={handleRadioChange}
              />{" "}
              Sub Account
            </Label>
          </FormGroup>
          {selectedAccountLevel === "Sub Account" && (
            <div className="formInput" style={{ margin: "30px 10px" }}>
              <label className="form-control-label" htmlFor="input-address">
                Parent Account
              </label>
              <br />
              <Dropdown
                //   isOpen={
                //     selectAccountLevelDropDown
                //   } // Control the open/closed state
                //   toggle={toggle1}
                isOpen={props.selectAccountLevelDropDown}
                toggle={props.toggle1}
              >
                <DropdownToggle caret style={{ width: "100%" }}>
                  {selectedAccountLevel ? selectedAccountLevel : "Select"}
                </DropdownToggle>
                <DropdownMenu style={{ width: "100%" }}>
                  <DropdownItem
                    onClick={() => hadleselectedAccountLevel("Income")}
                  >
                    Income
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      hadleselectedAccountLevel("Non Operating Income")
                    }
                  >
                    Non Operating Income
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div> */}
        {/* <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Account Number
          </label>
          <br />
          <Input
            className="form-control-alternative"
            id="input-no"
            placeholder=""
            type="number"
            // name="account_number"
            onBlur={accountFormik.handleBlur}
            onChange={accountFormik.handleChange}
            // value={accountFormik.values.account_number}
          />
          {accountFormik.touched.account_number &&
            accountFormik.errors.account_number ? (
            <div style={{ color: "red" }}>
              {accountFormik.errors.account_number}
            </div>
          ) : null}
        </div> */}
        <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Fund Type
          </label>
          <br />
          <Dropdown
            //   isOpen={selectFundTypeDropDown}
            //   toggle={toggle10}
            isOpen={props.selectFundTypeDropDown}
            toggle={props.toggle10}
          >
            <DropdownToggle caret style={{ width: "100%" }}>
              {selectedFundType ? selectedFundType : "Select"}
            </DropdownToggle>
            <DropdownMenu
              style={{ width: "100%" }}
              name="fund_type"
              onBlur={accountFormik.handleBlur}
              onChange={accountFormik.handleChange}
              value={accountFormik.values.fund_type}
            >
              {/* {accountFormik.touched.fund_type &&
              accountFormik.errors.fund_type ? (
                <div style={{ color: "red" }}>
                  {accountFormik.errors.fund_type}
                </div>
              ) : null} */}
              <DropdownItem onClick={() => hadleselectedFundType("Reserve")}>
                Reserve
              </DropdownItem>
              <DropdownItem onClick={() => hadleselectedFundType("Operating")}>
                Operating
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div />
        <div className="formInput" style={{ margin: "10px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Notes
          </label>
          <br />
          <Input
            className="form-control-alternative"
            id="input-accname"
            placeholder="Notes"
            type="text"
            name="notes"
            onBlur={accountFormik.handleBlur}
            onChange={accountFormik.handleChange}
            value={accountFormik.values.notes}
          />
          {accountFormik.touched.notes && accountFormik.errors.notes ? (
            <div style={{ color: "red" }}>{accountFormik.errors.notes}</div>
          ) : null}
        </div>

        <div className="formInput" style={{ margin: "30px 10px" }}>
          We stores this information{" "}
          <b
            style={{
              color: "blue",
              fontSize: "15px",
            }}
          >
            Privately
          </b>{" "}
          and{" "}
          <b
            style={{
              color: "blue",
              fontSize: "15px",
            }}
          >
            Securely
          </b>
          .
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button
          onClick={() => {
            handleAdd(accountFormik.values); // Call handleAdd with the form values
            handleCloseDialog();
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AccountDialog;
