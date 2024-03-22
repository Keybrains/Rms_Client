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
import { jwtDecode } from "jwt-decode";
import VendorHeader from "components/Headers/VendorHeader";
import { RotatingLines } from "react-loader-spinner";

const VendorProfile = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const [vendorDetails, setVendorDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [accessType, setAccessType] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            const jwt = jwtDecode(localStorage.getItem("token"));
            setAccessType(jwt);
        } else {
            navigate("/auth/login");
        }
    }, []);

    const getVendorData = async () => {
        if (accessType?.vendor_id) {
            try {
                const response = await axios.get(
                    `${baseUrl}/vendor/get_vendor/${accessType.vendor_id}`
                );
                setVendorDetails(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tenant details:", error);
            }
        }
    };
    useEffect(() => {
        getVendorData();
    }, [accessType]);

    return (
        <>
            <VendorHeader />

            <Container className="" fluid style={{ marginTop: "4rem", height: "100vh" }}>
                <CardHeader
                    className=" mt-3 mb-3"
                    style={{
                        backgroundColor: "#152B51",
                        borderRadius: "10px",
                        boxShadow: " 0px 4px 4px 0px #00000040 ",
                    }}
                >
                    <h2
                        className="mb-0"
                        style={{
                            color: "#ffffff",
                            fontFamily: "Poppins",
                            fontWeight: "500",
                            fontSize: "26px",
                        }}
                    >
                        Personal Details
                    </h2>
                </CardHeader>
                <Row>
                    <div className="col mb-5" style={{


                    }}>
                        {/* <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}> */}
                        {/* <CardHeader className="border-0">
                                <h2 className="mb-0" style={{ color: "#36013F" }}>
                                    Personal Details
                                </h2>
                            </CardHeader> */}

                        <Row
                            className="mx-3 py-0 mt-3"
                            style={{
                                border: ".5px solid rgba(50, 69, 103, 1)",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "12px",
                                height: "45px",
                                alignItems: "center",
                                borderBottom: "0px",
                                color: "#152B51",
                                fontWeight: "500",
                                fontFamily: "Poppins",
                                fontSize: "14px", color: "#152B51"

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
                                color: "#152B51",
                                fontWeight: "500",
                                fontFamily: "Poppins",
                                fontSize: "12px", color: "#152B51",
                                boxShadow: " 0px 4px 4px 0px #00000040",

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
                                {vendorDetails.vendor_name}
                            </Col>

                            <Col
                                style={{
                                    borderRight: ".5px solid rgba(50, 69, 103, 1)",
                                    height: "100%",
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                {vendorDetails.vendor_phoneNumber}
                            </Col>
                            <Col
                                style={{
                                    height: "100%",
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                {vendorDetails.vendor_email}
                            </Col>
                        </Row>
                        {/* </Card> */}
                    </div>
                </Row>
            </Container>
        </>
    );
};
export default VendorProfile;
