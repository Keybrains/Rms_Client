import {
  Badge,
  Card,
  CardHeader,
  // CardFooter,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown,
  // DropdownToggle,
  // Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  // Progress,
  Table,
  Container,
  Row,

  // UncontrolledTooltip,
} from "reactstrap";
// core components
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import ListingsHeader from "components/Headers/ListingsHeader";
import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const PropertiesTables = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [rentalsData, setRentalsData] = useState([]);

  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/listings`
      );
      setRentalsData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRentalsData();
  }, []);

  let navigate = useNavigate();

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <>
      <ListingsHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Listings</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">Listed</th> */}
                    {/* <th scope="col">Available</th> */}
                    <th scope="col">Beds</th>
                    <th scope="col">Baths</th>
                    <th scope="col">UnitAddress</th>
                    <th scope="col">Soft</th>

                    {/* <th scope="col">Size</th> */}
                    {/* <th scope="col">Listing Rent</th> */}
                  </tr>
                </thead>
                <tbody>
                  {rentalsData.map((rental, index) => (
                    <tr key={index}>
                      <td>{rental.rental_bed}</td>
                      <td>{rental.rental_bath}</td>

                      <td>{rental.rental_unitsAdress}</td>
                      <td>{rental.rental_soft}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default PropertiesTables;
