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
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RotatingLines } from "react-loader-spinner";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";


const Agent = () => {
  const { id } = useParams();
  let [AgentData, setAgentData] = useState();
  let [loader, setLoader] = React.useState(true);
  let navigate = useNavigate();
 let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  // Delete selected
  const deleteAgent = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this agent!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("https://propertymanager.cloudpress.host/api/addagent/delete_agent", {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Agent deleted successfully!", "success");
              getAgentData(); // Refresh your agent data or perform other actions
            } 
            else if (response.data.statusCode === 201) {
              swal("Warning!", "Agent already assigned to lease!", "warning");
              getAgentData();
            } 
            else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting agent:", error);
          });
      } else {
        swal("Cancelled", "Agent is safe :)", "info");
      }
    });
  };

  const getAgentData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/addagent/addagent"
      );
      setLoader(false);
      setAgentData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getAgentData();
  }, []);

  const editAgent = (id) => {
    navigate(`/admin/AddAgent/${id}`);
    console.log(id);
  };
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Agents</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/AddAgent")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Agent
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
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
                  {/* <h3 className="mb-0">Staff Members</h3>    */}
                </CardHeader>

                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">PHONE NUMBER</th>
                      <th scope="col">E-MAIL</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AgentData?.map((agent) => (
                      <tr key={agent._id}>
                        <td>{agent.agent_name}</td>
                        <td>{agent.agent_phoneNumber}</td>
                        <td>{agent.agent_email}</td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteAgent(agent._id)}
                            >
                              <DeleteIcon />
                            </div>
                            &nbsp; &nbsp; &nbsp;
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => editAgent(agent._id)}
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
      </Container>
    </>
  );
};

export default Agent;
