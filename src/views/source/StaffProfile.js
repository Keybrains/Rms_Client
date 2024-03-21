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

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

  function createData(
    // name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  ) {
    return { calories, fat, carbs, protein };
  }
  const rows = [
    createData(159, 6.0, 24, 4.0),
    createData(237, 9.0, 37, 4.3),
    createData(262, 16.0, 24, 6.0),
    createData(305, 3.7, 67, 4.3),
    createData(356, 16.0, 49, 3.9),
  ];

  return (
    <>
      <StaffHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card
              className="shadow"
              style={{
                backgroundColor: "#152B51",
                padding: "20px",
                borderRadius: "20px",
              }}
            >
              <h2 className="mb-0" style={{ color: "white" }}>
                Personal Details
              </h2>
            </Card>
            <TableContainer component={Paper}>
              <Table className="" sx={{ minWidth: 650,  }} style={{minHeight:"10px"}} aria-label="simple table">
                <TableHead >
                  <TableRow style={{alignItems:"center"}}>
                    <TableCell align="left" style={{border:"none"}}>Calories</TableCell>
                    <TableCell align="left" style={{border:"none"}}>Fat&nbsp;(g)</TableCell>
                    <TableCell align="left" style={{border:"none"}}>Carbs&nbsp;(g)</TableCell>
                    <TableCell align="left" style={{border:"none"}}>Protein&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <TableContainer component={Paper} style={{marginTop:"20px"}}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                {/* <TableHead> */}
                  {/* <TableRow>
                    <TableCell align="left">Calories</TableCell>
                    <TableCell align="left">Fat&nbsp;(g)</TableCell>
                    <TableCell align="left">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="left">Protein&nbsp;(g)</TableCell>
                  </TableRow> */}
                {/* </TableHead> */}
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">{row.calories}</TableCell>
                      <TableCell align="left">{row.fat}</TableCell>
                      <TableCell align="left">{row.carbs}</TableCell>
                      <TableCell align="left">{row.protein}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default StaffProfile;
