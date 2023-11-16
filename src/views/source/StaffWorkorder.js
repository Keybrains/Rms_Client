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
  } from "reactstrap";
  import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import VendorHeader from "components/Headers/VendorHeader";

const StaffWorkOrder = () => {
  
  const [workOrderDetails, setWorkOrderDetails] = useState({});
  const { id } = useParams();
  console.log(id, workOrderDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  let cookies = new Cookies();
  let cookie_id = cookies.get("Staff ID");
  let cookie_name = cookies.get("Staff Name")

  // let cookies = new Cookies();
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
      "http://localhost:4000/api/register/auth",
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

  const getWorkOrderDetails = async () => {
    try {
      if (!cookie_id) {
        throw new Error("Staff ID not found in cookies");
      }

      const response = await axios.get(
        `http://localhost:4000/api/workorder/workorder_summary/${id}`
      );

      console.log("API Response:", response.data.data);
      setWorkOrderDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching work order details:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkOrderDetails();
  }, [id]);

  return (
    <>
      <VendorHeader />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0"></CardHeader>
              <div className="table-responsive">
                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ width: "100%" }}
                >
                  {loading ? (
                    <tr>
                      <td>Loading work order details...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td>Error: {error.message}</td>
                    </tr>
                  ) : workOrderDetails._id ? (
                    <>
                      <tbody>
                        <tr>
                          <th
                            colSpan="2"
                            className="text-lg"
                            style={{ color: "#3B2F2F" }}
                          >
                            Work Order Details
                          </th>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Work Subject:
                          </td>
                          <td>{workOrderDetails.work_subject}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Unit No:</td>
                          <td>{workOrderDetails.unit_no}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Work Property:
                          </td>
                          <td>{workOrderDetails.rental_adress}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Work Category:
                          </td>
                          <td>{workOrderDetails.work_category}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">
                            Work Assigned:
                          </td>
                          <td>{workOrderDetails.staffmember_name}</td>
                        </tr>
                        <tr>
                          <td className="font-weight-bold text-md">Status:</td>
                          <td>{workOrderDetails.status}</td>
                        </tr>
                      </tbody>
                    </>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No Work Order details found.</td>
                      </tr>
                    </tbody>
                  )}
                </Table>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default StaffWorkOrder;
