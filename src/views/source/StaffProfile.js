import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
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

const StaffProfile = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  //console.log(id);
  const [staffDetails, setStaffDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);
  let cookie_id = cookies.get("Staff ID");

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  
  useEffect(() => {
    const getStaffData = async () => {
      try {
        if (!cookie_id) {
          throw new Error("Staff ID not found in cookies");
        }

        const response = await axios.get(
          `${baseUrl}/addstaffmember/staffmember_summary/${cookie_id}`
        );
        //console.log(response.data.data);
        setStaffDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching staff details:", error.message);
        setError(error);
        setLoading(false);
      }
    };

    getStaffData();
  }, [cookie_id, id]);

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
       
         <Row>
          <div className="col">
            <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
              <CardHeader className="border-0">
                <h3 className="mb-0">Personal detail </h3>
              </CardHeader>
              <div className="table-responsive" style={{padding:"15px"}}>
              
                  <Table
                    className="align-items-center table-flush"
                    responsive
                    style={{ width: "100%" }}
                  >
                    {loading ? (
                      <tr>
                        <td>Loading staff details...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td>Error: {error.message}</td>
                      </tr>
                    ) : staffDetails._id ? (
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
                              <tr className="body">
                              <td>{staffDetails.staffmember_name}</td>
                              <td>{staffDetails.staffmember_designation}</td>
                              <td>{staffDetails.staffmember_phoneNumber}</td>
                               <td>{staffDetails.staffmember_email}</td>
                              </tr>
                            </>
                          </>
                        </tbody>
                      </>
                    ) : (
                      <tbody>
                        <tr>
                          <td>No vendor details found.</td>
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

export default StaffProfile;
