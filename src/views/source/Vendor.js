import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Col,
} from "reactstrap";
import Header from "components/Headers/Header";
import axios from "axios";
import swal from "sweetalert";
import { RotatingLines } from "react-loader-spinner";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const Vendor = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getVendorData();
  }, []);

  let cookies = new Cookies();
  // Check Authe(token)
  let chackAuth = async () => {
    if (cookies.get("token")) {
      let  authConfig = {
        headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
        token: cookies.get("token"),
      },
    };
    // auth post method
    let res = await axios.post(
      "https://propertymanager.cloudpress.host/api/register/auth",
      { purpose: "validate access" },
      authConfig
    );
    if (res.data.statusCode !== 200) {
      // cookies.remove("token");
      navigate("/auth/login");
    }
  } else {
    navigate("/auth/login");
  }
};

React.useEffect(() => {
  chackAuth();
}, [cookies.get("token")]);

  const getVendorData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/vendor/vendor"
      );
      setLoader(false);
      setVendorData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteVendor = async (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this vendor!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            "https://propertymanager.cloudpress.host/api/vendor/delete_vendor",
            {
              data: { _id: id },
            }
          );
  
          if (response.data.statusCode === 200) {
            swal("Success!", "Vendor deleted successfully", "success");
            getVendorData();
          } 
          else if (response.data.statusCode === 201) {
            swal("Warning!", "Vendor already assigned to workorder!", "warning");
            getVendorData();
          } 
          else {
            swal("", response.data.message, "error");
          }
        } catch (error) {
          console.error("Error deleting vendor:", error);
        }
      } else {
        swal("Cancelled", "Vendor is safe :)", "info");
      }
    });
  };
  

  const editVendor = (id) => {
    navigate(`/admin/addvendor/${id}`);
    console.log(id);
  };

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Vendor</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/addvendor")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Vendor
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
                  <Row></Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Mail ID</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorData.map((vendor) => (
                      <tr key={vendor._id}>
                        <td>{vendor.vendor_name}</td>
                        <td>{vendor.vendor_phoneNumber}</td>
                        <td>{vendor.vendor_email}</td>
                        <td>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteVendor(vendor._id)}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => editVendor(vendor._id)}
                            >
                              <EditIcon />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            )}
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default Vendor;
