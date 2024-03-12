import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RentalHeader from "components/Headers/PlanHeader";
import {
    Container, Row, Col, Button, Label, Card,
    CardHeader,
} from "reactstrap";
import { RotatingLines } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
import Header from "components/Headers/Header.js";

function Purchaseplan() {
    const { admin } = useParams();
    let navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const [purchase, setPurchase] = useState(null);
    const [loader, setLoader] = useState(true);
    const [accessType, setAccessType] = useState({});

    React.useEffect(() => {
        if (localStorage.getItem("token")) {
            const jwt = jwtDecode(localStorage.getItem("token"));
            setAccessType(jwt);
        } else {
            navigate("/auth/login");
        }
    }, [navigate]);
    useEffect(() => {
        // Fetch purchase data from the API using Axios
        if (accessType?.admin_id) {
            axios.get(`${baseUrl}/purchase/plan-purchase/${accessType?.admin_id}`)
                .then((response) => {
                    setPurchase(response.data.data);
                    setLoader(false);
                })
                .catch((error) => {
                    console.error("Error fetching purchase data:", error);
                })
                
        }
    }, [accessType]);


    const FeaturesList = ({ features }) => {
        const [showAllFeatures, setShowAllFeatures] = useState(false);
        // Check if features is defined
        if (!features) {
            return null; // or return a loading indicator or some default content
        }

        // Display the first four features by default
        const displayFeatures = showAllFeatures ? features : features.slice(0, 4);

        return (
            <>
                <ul>
                    {displayFeatures.map((feature, index) => (
                        <li key={index}>{feature.features}</li>
                    ))}
                </ul>
                {!showAllFeatures && features.length > 4 && (
                    <Button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setShowAllFeatures(true)}
                    >
                        Read More
                    </Button>
                )}
            </>
        );
    };

    return (
        <>
            <Header />
            <Container className="mt--8" fluid>


                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                {/* <b style={{ color: "rgb(10, 37, 59)" }}>
                                    <i
                                    className="fa-solid fa-calendar"
                                    style={{ marginRight: "10px", fontSize: "20px" }}
                                    ></i>
                                    {purchase?.plan_detail?.plan_name}
                                </b> */}
                            </CardHeader>
                            <div className="table-responsive">
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
                                    <div className="row m-3" style={{ overflow: "hidden" }}>
                                        <div className="col-md-12">
                                            <div
                                                className="align-items-center table-flush"
                                                responsive
                                                style={{ width: "100%" }}
                                            >

                                                <>
                                                    <div className="w-100">
                                                        <Row
                                                            className="w-100 my-3 justify-content-center"
                                                            style={{
                                                                fontSize: "18px",
                                                                textTransform: "capitalize",
                                                                color: "#5e72e4",
                                                                fontWeight: "600",
                                                                // borderBottom: "1px solid #ddd",
                                                            }}
                                                        >
                                                            <b className="mb-2" style={{ color: "#11cdef", fontSize: '30px' }}>
                                                                {purchase?.plan_detail?.plan_name}
                                                            </b>
                                                        </Row>
                                                        <Row
                                                            className="w-100 my-3"
                                                            style={{
                                                                fontSize: "18px",
                                                                textTransform: "capitalize",
                                                                color: "#5e72e4",
                                                                fontWeight: "600",
                                                                borderBottom: "1px solid #ddd",
                                                            }}
                                                        >
                                                            <Col style={{ fontSize: "20px" }}>Plan details</Col>
                                                        </Row>
                                                        <Container fluid>
                                                            <Row
                                                                className="w-100 mb-1"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "uppercase",
                                                                    color: "#aaa",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    Purchase Date:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    Plan Price
                                                                </Col>


                                                            </Row>
                                                            <Row
                                                                className="w-100 mt-1 mb-5"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "capitalize",
                                                                    color: "#000",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.purchase_date}
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_amount}
                                                                </Col>

                                                            </Row>
                                                            <Row
                                                                className="w-100 mb-1"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "uppercase",
                                                                    color: "#aaa",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    Billing Period:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    Day of month
                                                                </Col>

                                                            </Row>
                                                            <Row
                                                                className="w-100 mt-1 mb-5"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "capitalize",
                                                                    color: "#000",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.billing_interval}
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.day_of_month}
                                                                </Col>

                                                            </Row>

                                                            <br />

                                                        </Container>

                                                        <Row
                                                            className="w-100 my-3"
                                                            style={{
                                                                fontSize: "18px",
                                                                textTransform: "capitalize",
                                                                color: "#5e72e4",
                                                                fontWeight: "600",
                                                                borderBottom: "1px solid #ddd",
                                                            }}
                                                        >
                                                            <Col style={{ fontSize: "20px" }}>Plan limitations</Col>
                                                        </Row>
                                                        <Container fluid>

                                                            <Row
                                                                className="w-100 mb-1"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "uppercase",
                                                                    color: "#aaa",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    Property limit:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    RentalOwner limit:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    Staffmember limit:
                                                                </Col>
                                                            </Row>
                                                            <Row
                                                                className="w-100 mt-1 mb-5"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "capitalize",
                                                                    color: "#000",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.property_count}
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.rentalowner_count}
                                                                </Col>
                                                                <Col
                                                                    xs={4}
                                                                    md={4}
                                                                    style={{ textTransform: "lowercase" }}
                                                                >
                                                                    {purchase?.plan_detail?.staffmember_count}
                                                                </Col>
                                                            </Row>
                                                            <Row
                                                                className="w-100 mb-1"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "uppercase",
                                                                    color: "#aaa",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    lease_limit:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    tenant_limit:
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    vendor_limit:
                                                                </Col>
                                                            </Row>
                                                            <Row
                                                                className="w-100 mt-1 mb-5"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    textTransform: "capitalize",
                                                                    color: "#000",
                                                                }}
                                                            >
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.lease_count}
                                                                </Col>
                                                                <Col xs={4} md={4}>
                                                                    {purchase?.plan_detail?.tenant_count}
                                                                </Col>
                                                                <Col
                                                                    xs={4}
                                                                    md={4}
                                                                    style={{ textTransform: "lowercase" }}
                                                                >
                                                                    {purchase?.plan_detail?.vendor_count}
                                                                </Col>
                                                            </Row>

                                                            <br />

                                                        </Container>

                                                        <Row
                                                            className="w-100 my-3"
                                                            style={{
                                                                fontSize: "18px",
                                                                textTransform: "capitalize",
                                                                color: "#5e72e4",
                                                                fontWeight: "600",
                                                                borderBottom: "1px solid #ddd",
                                                            }}
                                                        >
                                                            <Col style={{ fontSize: "20px" }}> Plan features</Col>
                                                        </Row>
                                                        <Container fluid>

                                                            <Row
                                                                className="w-100 mb-1"
                                                                style={{
                                                                    fontSize: "18px",
                                                                    color: "#aaa",
                                                                }}
                                                            >

                                                                <Col xs={4} md={4}>

                                                                    <FeaturesList features={purchase?.plan_detail?.features} />
                                                                </Col>

                                                            </Row>

                                                            <br />

                                                        </Container>
                                                    </div>
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </Row >


            </Container >
        </>
    );
}

export default Purchaseplan;

