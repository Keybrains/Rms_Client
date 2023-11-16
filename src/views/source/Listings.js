
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
  import ListingsHeader from "components/Headers/ListingsHeader";
  import * as React from "react";
  import axios from "axios";
  import { useState, useEffect } from "react";
  import Cookies from 'universal-cookie';
  import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";


  
  const PropertiesTables = () => {
    const [rentalsData, setRentalsData] = useState([]);

  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/rentals/listings"
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
                      
                      <td>{rental.  rental_bed}</td>
                      <td>{rental.  rental_bath}</td>


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
  