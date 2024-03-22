import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import StaffHeader from "components/Headers/StaffHeader";
import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap"; // Import other necessary components from 'reactstrap'
import { jwtDecode } from "jwt-decode";
import "./Staffdashboard.css";

const StaffProfile = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  //console.log(id);
  const [staffDetails, setStaffDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getStaffData = async () => {
    if (accessType?.staffmember_id) {
      try {
        if (accessType?.staffmember_id) {
          const response = await axios.get(
            `${baseUrl}/staffmember/staffmember_profile/${accessType?.staffmember_id}`
          );
          //console.log(response.data.data);
          setStaffDetails(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching staff details:", error.message);
        setError(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getStaffData();
  }, [accessType]);

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="" fluid style={{ marginTop: "4rem" }}>
        <Row>
          <div className="col">
            <Card
              className="shadow"
              style={{
                backgroundColor: "#152B51",
                padding: "20px",
                borderRadius: "20px",
                paddingRight: "90px",
                paddingLeftL: "90px",
              }}
            >
              <h2 className="mb-0" style={{ color: "white" }}>
                Personal Details
              </h2>
            </Card>
            {/* <Table
                className="align-items-center table-flush"
                responsive
                style={{ width: "100%" }}
              >
                {loading ? (
                  <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                    <RotatingLines
                      strokeColor="grey"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="50"
                      visible={loading}
                    />
                  </div>
                ) : (
                  <>
                    <tbody
                      className="tbbody p-0 m-0"
                      style={{
                        borderTopRightRadius: "5px",
                        borderTopLeftRadius: "5px",
                        borderBottomLeftRadius: "5px",
                        borderBottomRightRadius: "5px",
                      }}
                    >
                      <tr className="header">
                        <th>First name</th>
                        <th>Designation</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                      </tr>
                      <>
                        <>
                          {!staffDetails ? (
                            <tbody>
                              <tr className="text-center">
                                <td colSpan="8" style={{ fontSize: "15px" }}>
                                  No Data Added
                                </td>
                              </tr>
                            </tbody>
                          ) : (
                            <tr className="body">
                              <td>{staffDetails?.staffmember_name}</td>
                              <td>{staffDetails?.staffmember_designation}</td>
                              <td>{staffDetails?.staffmember_phoneNumber}</td>
                              <td>{staffDetails?.staffmember_email}</td>
                            </tr>
                          )}
                        </>
                      </>
                    </tbody>
                  </>
                )}
              </Table> */}
            {/* <table class="rwd-table">
                <tbody> */}
            <Row
              className="mx-3 py-0 mt-3"
              style={{
                border: ".5px solid rgba(50, 69, 103, 1)",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                height: "45px",
                alignItems: "center",
                borderBottom:"0px",
                color:"#152B51",
                

              }}
            >
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                First Name
              </Col>
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Designation
              </Col>
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Phone Number
              </Col>
              <Col
                style={{
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                Email
              </Col>
            </Row>
            <Row
              className="mx-3 py-0"
              style={{
                border: ".5px solid rgba(50, 69, 103, 1)",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                height: "45px",
                alignItems: "center",
                color:"#152B51",
                boxShadow: "0px 4px 4px 0px #00000040"
              }}
            >
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  fontSize:"12px"
                }}
              >
                {staffDetails?.staffmember_name}
              </Col>
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  fontSize:"12px"
                }}
              >
                {staffDetails?.staffmember_designation}
              </Col>
              <Col
                style={{
                  borderRight: ".5px solid rgba(50, 69, 103, 1)",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  fontSize:"12px"
                }}
              >
                {staffDetails?.staffmember_phoneNumber}
              </Col>
              <Col
                style={{
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  fontSize:"12px"
                }}
              >
                {staffDetails?.staffmember_email}
              </Col>
            </Row>
            {/* </tbody>
              </table> */}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default StaffProfile;
