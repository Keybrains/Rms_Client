import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RentalHeader from "components/Headers/PlanHeader";
import { Container, Row, Col, Card, CardHeader,CardBody, Table, Button } from 'reactstrap';
import { RotatingLines } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
import Header from "components/Headers/Header.js";
import swal from "sweetalert";

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
      axios
        .get(`${baseUrl}/purchase/plan-purchase/${accessType?.admin_id}`)
        .then((response) => {
          setPurchase(response.data.data);
          setLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching purchase data:", error);
        });
    }
  }, [accessType]);

  const updateSubscription = async () => {
    // try {
    //   const response = await axios.post(
    //     `${baseUrl}/nmipayment/custom-delete-subscription`,
    //     { subscription_id: purchase?.subscription_id }
    //   );
      alert('Success')
    //   console.log('Subscription cancellation successful:', response.data);
      // Add any additional logic here after successful cancellation
    // } catch (error) {
    //     alert('Error')
    //   console.error('Error cancelling subscription:', error);
    //   // Handle error or show a message to the user
    // }
  };

  const cancelSubscription = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/nmipayment/custom-delete-subscription`,
        { subscription_id: purchase?.subscription_id }
      );
      alert('Success')
      console.log('Subscription cancellation successful:', response.data);
      // Add any additional logic here after successful cancellation
    } catch (error) {
        alert('Error')
      console.error('Error cancelling subscription:', error);
      // Handle error or show a message to the user
    }
  };

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
      <Container className="mt--7">
      <Row>
        {/* Current Plan Details */}
        <Col md={12}>
          <Card className="shadow mb-4">
            <CardHeader className="bg-secondary text-white">
            <div className="text-left"> 
              <h3 className="mb-0">Current Subscription Details</h3>
              </div>
              <div className="text-right">
                <Button
                  color="success"
                  onClick={(e) => {
                    e.preventDefault();
                    updateSubscription();
                  }}
                >
                  Plan Upgrade
                </Button>
                <Button
                  color="danger"
                  className="ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    cancelSubscription();
                  }}
                >
                  Cancel Subscription
                </Button>
              </div>
            </CardHeader>
            <CardBody>
            <Row className="mb-4">
                <Col md={2} className="text-muted">Plan Name:</Col>
                <Col md={3}>{purchase?.plan_detail?.plan_name}</Col>
                <Col md={2} className="text-muted">Purchase Date:</Col>
                <Col md={3}>{purchase?.purchase_date}</Col>
              </Row>
              <Row className="mb-3">
                <Col md={2} className="text-muted">Plan Price:</Col>
                <Col md={3}>{purchase?.plan_amount}</Col>
                <Col md={2} className="text-muted">Billing Period:</Col>
                <Col md={3}>{purchase?.plan_detail?.billing_interval}</Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        {/* Past Subscriptions */}
        <Col md={12}>
          <Card className="shadow">
            <CardHeader className="bg-secondary text-white">
              <h3 className="mb-0">Past Subscriptions</h3>
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Plan name</th>
                    <th>Status</th>
                    <th>Start date</th>
                    <th>End date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Silver Plan</td>
                    <td>Active</td>
                    <td>2023-01-01</td>
                    <td>2024-01-01</td>
                  </tr>
                  {/* Additional rows for past subscriptions */}
                </tbody>
              </Table>
              <div className="text-center mt-3">
              <Button size="sm" className="bg-primary text-white">
                View All Subscriptions
              </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default Purchaseplan;
