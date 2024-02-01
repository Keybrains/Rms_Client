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
  Input,
} from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AccountDialog(props) {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [selectedAccountType, setselectedAccountType] = useState("");
  const [selectedFundType, setselectedFundType] = useState("");
  const [selectAccountDropDown, setSelectAccountDropDown] = useState(false);
  const [selectFundTypeDropDown, setSelectFundTypeDropDown] = useState(false);

  const toggles = () => setSelectAccountDropDown(!selectAccountDropDown);

  const toggles2 = () => setSelectFundTypeDropDown(!selectFundTypeDropDown);

  const hadleselectedAccountType = (account_type) => {
    setselectedAccountType(account_type);
    accountFormik.setFieldValue("account_type", account_type);
  };

  const hadleselectedFundType = (fund_type) => {
    setselectedFundType(fund_type);
    accountFormik.setFieldValue("fund_type", fund_type);
  };

  let accountFormik = useFormik({
    initialValues: {
      account: "",
      account_type: "",
      fund_type: "",
      charge_type: props.accountTypeName || "",
      notes: "",
    },
    validationSchema: yup.object({
      account: yup.string().required("Required"),
      account_type: yup.string().required("Required"),
      fund_type: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleAdd(values);
    },
  });

  const handleAdd = async (values) => {
    const object = {
      ...values,
      charge_type: props.accountTypeName,
      admin_id: props.adminId,
    };
    console.log(object);
    try {
      const res = await axios.post(`${baseUrl}/accounts/accounts`, object);
      if (res.status === 200) {
        toast.success('', res.data.message,'success', {
          position: 'top-center',
          autoClose: 500,
        })
        accountFormik.resetForm();
        props.setAddBankAccountDialogOpen(false);
      } else {
   
        toast.error(res.data.message, {
          position: 'top-center',
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.warning('Account already exists', {
          position: 'top-center',
        })
      }
      accountFormik.resetForm();
    }
  };

  return (
    <Dialog
      open={props.addBankAccountDialogOpen}
      onClose={() => {
        props.setAddBankAccountDialogOpen(false);
      }}
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
            name="account"
            onBlur={accountFormik.handleBlur}
            onChange={accountFormik.handleChange}
            value={accountFormik.values.account}
          />
          {accountFormik.touched.account && accountFormik.errors.account ? (
            <div style={{ color: "red" }}>{accountFormik.errors.account}</div>
          ) : null}
        </div>

        <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Account Type
          </label>
          <br />
          <Dropdown isOpen={selectAccountDropDown} toggle={toggles}>
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
              <DropdownItem onClick={() => hadleselectedAccountType("Income")}>
                Income
              </DropdownItem>
              <DropdownItem
                onClick={() => hadleselectedAccountType("Non Operating Income")}
              >
                Non Operating Income
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="formInput" style={{ margin: "30px 10px" }}>
          <label className="form-control-label" htmlFor="input-address">
            Fund Type
          </label>
          <br />
          <Dropdown isOpen={selectFundTypeDropDown} toggle={toggles2}>
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
        <Button
          onClick={() => {
            props.setAddBankAccountDialogOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            accountFormik.handleSubmit();
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
    
  );
}

export default AccountDialog;
