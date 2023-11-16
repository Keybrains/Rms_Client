import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Col,
  Input
} from "reactstrap";

// core components
import Header from "components/Headers/Header";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import Cookies from 'universal-cookie';
import { RotatingLines } from "react-loader-spinner";

const Workorder = () => {
  let navigate = useNavigate();
  let [workData, setWorkData] = useState();
  let [loader, setLoader] = React.useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getWorkData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/workorder/workorder"
      );
      setWorkData(response.data.data);
      setLoader(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const deleteRentals = (id) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this work order!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete("http://localhost:4000/api/workorder/delete_workorder", {
            data: { _id: id },
          })
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal("Success!", "Work Order deleted successfully", "success");
              getWorkData(); // Refresh your work order data or perform other actions
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting work order:", error);
          });
      } else {
        swal("Cancelled", "Work Order is safe :)", "info");
      }
    });
  };

  React.useEffect(() => {
    getWorkData();
  }, []);

  const editWorkOrder = (id) => {
    navigate(`/admin/addworkorder/${id}`);
    console.log(id);
  };

  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      return workData;
    }

    return workData.filter((rental) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        rental.work_subject.toLowerCase().includes(lowerCaseQuery) ||
        rental.work_category.toLowerCase().includes(lowerCaseQuery) ||
        rental.status.toLowerCase().includes(lowerCaseQuery) ||
        rental.rental_adress.toLowerCase().includes(lowerCaseQuery)||
        rental.staffmember_name.toLowerCase().includes(lowerCaseQuery)||
        rental.priority.toLowerCase().includes(lowerCaseQuery)
        // rental.due_date.formattedDate.includes(lowerCaseQuery)
      );
    });
  };

  const navigateToDetails = (workorder_id) => {
    // const propDetailsURL = `/admin/WorkOrderDetails/${tenantId}`;
    navigate(`/admin/workorderdetail/${workorder_id}`);
    console.log(workorder_id);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        {/* Table */}
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Orders</h1>
            </FormGroup>
          </Col>

          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/addworkorder")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add Work Order
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
              <Row>
                    <Col xs="12" sm="6">
                      <FormGroup>
                        <Input
                          fullWidth
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            maxWidth: "200px",
                            minWidth: "200px",
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Work Order</th>
                    <th scope="col">Property</th>
                    <th scope="col">Category</th>
                    <th scope="col">Assigned</th>
                    <th scope="col">Status</th>
                    <th scope="col">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                {filterRentalsBySearch().map((rental) => (
                     <tr
                     key={rental._id}
                     onClick={
                       () => navigateToDetails(rental.workorder_id)}
                     style={{ cursor: 'pointer' }}
                     > 
                      <td>{rental.work_subject}</td>
                      <td>{`${rental.unit_no} ${rental.rental_adress}`}</td>
                      <td>{rental.work_category}</td>
                      <td>{rental.staffmember_name}</td>
                      <td>{rental.status}</td>

                      <td>
                        <div style={{ display: "flex", gap: "0px" }}>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRentals(rental._id);
                            }}
                          >
                            <DeleteIcon />
                          </div>
                          &nbsp; &nbsp; &nbsp;
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>{ 
                              e.stopPropagation();
                              editWorkOrder(rental.workorder_id)}}
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

export default Workorder;
