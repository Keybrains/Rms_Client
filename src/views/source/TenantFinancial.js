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
  import TenantsHeader from "components/Headers/TenantsHeader";
  import Cookies from "universal-cookie";
  import { RotatingLines } from "react-loader-spinner";
  import DeleteIcon from "@mui/icons-material/Delete";
  import EditIcon from "@mui/icons-material/Edit";
  
  const TenantFinancial = () => {
    const [rental_adress, setRentalAddress] = useState([]);
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [propertyLoading, setPropertyLoading] = useState(true);
    const [propertyError, setPropertyError] = useState(null);
    const [tenantDetails, setTenantDetails] = useState({});
    const { id } = useParams();
    const [GeneralLedgerData, setGeneralLedgerData] = useState([]);
    // console.log(id, tenantDetails);
    const [loader, setLoader] = React.useState(true);

    function formatDateWithoutTime(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}-${day}-${year}`;
      }

      const calculateBalance = (data) => {
        let balance = 0;
    
        for (let i = data.length - 1; i >= 0; i--) {
          const currentEntry = data[i];
         
          if (currentEntry.type === "Charge") {
            balance += currentEntry.charges_amount;
          } else if (currentEntry.type === "Payment") {
            balance -= currentEntry.amount;
          }
    
          data[i].balance = balance;
        }
    
        //console.log("data",data)
        return data;
      };

      const getGeneralLedgerData = async () => {
        const apiUrl = `https://propertymanager.cloudpress.host/api/payment/merge_payment_charge/${cookie_id}`;
    
        try {
          const response = await axios.get(apiUrl);
          setLoader(false);
    
          if (response.data && response.data.data) {
            const mergedData = response.data.data;
            mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));
            const dataWithBalance = calculateBalance(mergedData);
            
            setGeneralLedgerData(dataWithBalance);
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        getGeneralLedgerData();
      }, [cookie_id]);
  
    let cookies = new Cookies();
    let cookie_id = cookies.get("Tenant ID");
    //let cookie_email = cookies.get("Tenant email");
    // let cookies = new Cookies();
    // Check Authe(token)
    let chackAuth = async () => {
      if (cookies.get("token")) {
        let authConfig = {
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
        if(!cookies.get("token")){
          navigate("/auth/login");
        }
      }
    };
  
    React.useEffect(() => {
      chackAuth();
    }, [cookies.get("token")]);
  
    const getTenantData = async () => {
      try {
        const response = await axios.get(
          `https://propertymanager.cloudpress.host/api/tenant/tenant_rental_addresses/${cookie_id}`
        );
  
        if (response.data && response.data.rental_adress) {
          // console.log("Data fetched successfully:", response.data);
          // setTenantDetails(response.data.data);
          setRentalAddress(response.data.rental_adress);
  
          const allTenants = await axios.get(
            `https://propertymanager.cloudpress.host/api/tenant/tenant_summary/${cookie_id}`
          );
          setPropertyDetails(allTenants.data.data.entries);
          console.log(allTenants.data.data, "allTenants");
        } else {
          console.error("Data structure is not as expected:", response.data);
          setRentalAddress([]); // Set rental_adress to an empty array
        }
      } catch (error) {
        console.error("Error fetching tenant details:", error);
        setRentalAddress([]); // Set rental_adress to an empty array
        setPropertyError(error);
      } finally {
        setPropertyLoading(false);
      }
    };
  
    useEffect(() => {
      getTenantData();
      console.log(
        `https://propertymanager.cloudpress.host/api/tenant/tenant_rental_addresses/${cookie_id}`
      );
    }, [cookie_id]);
  
    const navigate = useNavigate();
  
    // const getRentalData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `https://propertymanager.cloudpress.host/api/rentals/rentals_property/${rental_adress}`
    //     );
    //     setpropertyDetails(response.data.data);
    //     setpropertyLoading(false);
    //   } catch (error) {
    //     setpropertyError(error);
    //     setpropertyLoading(false);
    //   }
    // };
    // useEffect(() => {
    //   if (rental_adress) {
    //       console.log(`https://propertymanager.cloudpress.host/api/rentals/rentals_property/${rental_adress}`)
    //       getRentalData();
    //   }
    //   //console.log(rental_adress)
    // }, [rental_adress]);
  
    function navigateToTenantsDetails(rental_adress) {
      const tenantsDetailsURL = `/tenant/tenantpropertydetail/${rental_adress}`;
      window.location.href = tenantsDetailsURL;
      console.log("Rental Address", rental_adress);
    }
    return (
      <>
        <TenantsHeader />
        {/* Page content */}
        <Container className="mt--8 ml--10" fluid>
        <Row>
            <Col xs="12" sm="6">
              <FormGroup className="">
                <h1 style={{color:'white'}}>
                  Ledger
                </h1>
                </FormGroup>
            </Col>
          
            <Col className="text-right" xs="12" sm="6">
                    {/* <Button
                      color="primary"
                      href="#rms"
                      onClick={() => navigate("/tenant/taddwork")}
                      size="sm"
                      style={{ background: "white", color: "black" }}
                    >
                      Payment
                    </Button> */}
              </Col>
          </Row><br/>
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
                              <CardHeader className="border-0"></CardHeader>

                              <Table
                                className="align-items-center table-flush"
                                responsive
                              >
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Account</th>
                                    <th scope="col">Memo</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(GeneralLedgerData) ? (
                                    GeneralLedgerData.map((generalledger) => (
                                      <>
                                        {generalledger.entries.map(
                                          (entry, index) => (
                                            <tr
                                              key={`${generalledger._id}_${index}`}
                                            >
                                              <td>
                                                {formatDateWithoutTime(
                                                  generalledger.type ===
                                                    "Charge"
                                                    ? generalledger.date
                                                    : generalledger.date
                                                ) || "N/A"}
                                              </td>
                                              <td>{generalledger.type}</td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? entry.charges_account
                                                  : entry.account}
                                              </td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? generalledger.charges_memo
                                                  : generalledger.memo}
                                              </td>
                                              <td>
                                                {generalledger.type === "Charge"
                                                  ? "$" + entry.charges_amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {generalledger.type ===
                                                "Payment"
                                                  ? "$" + entry.amount
                                                  : "-"}
                                              </td>
                                              <td>
                                                {console.log("first", generalledger.balance)}
                                                {generalledger.balance !== undefined
                                                  ? generalledger.balance >= 0
                                                  ? generalledger.balance
                                                  : `$(${Math.abs(generalledger.balance)})`
                                                  : "0"}
                                                {/* {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )} */}
                                              </td>
                                              {/* <td>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                  }}
                                                >
                                                  {generalledger.type ===
                                                    "Charge" && (
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log(
                                                          "Entry Object:",
                                                          entry
                                                        );
                                                        deleteCharge(
                                                          generalledger._id,
                                                          entry.chargeIndex
                                                        );
                                                        console.log(
                                                          generalledger._id,
                                                          "dsgdg"
                                                        );
                                                        console.log(
                                                          entry.chargeIndex,
                                                          "dsgdg"
                                                        );
                                                      }}
                                                    >
                                                      <DeleteIcon />
                                                    </div>
                                                  )}
                                                  
                                                  {generalledger.type ===
                                                    "Charge" && (
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        editcharge(
                                                          generalledger._id,
                                                          entry.chargeIndex,
                                                         
                                                        );
                                                        
                                                      }}
                                                    >
                                                      <EditIcon />
                                                    </div>
                                                  )}

                                                  {generalledger.type ===
                                                    "Payment" && (
                                                    <div
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        editpayment(
                                                          generalledger._id,
                                                          entry.paymentIndex
                                                        );
                                                      }}
                                                    >
                                                      <EditIcon />
                                                    </div>
                                                  )}
                                                </div>
                                              </td> */}
                                            </tr>
                                          )
                                        )}
                                      </>
                                    ))
                                  ) : (
                                    <p>GeneralLedgerData is not an array</p>
                                  )}
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
  
  export default TenantFinancial;
  