import React, { useState } from "react";
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  InputGroupAddon,
  InputGroup,
} from "reactstrap";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [FirstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [businessCenter, setBusinessCenter] = useState("");
  const [fax, setFax] = useState("");
  const [property, setProperty] = useState(""); // Add this line

  // Step 1: Create state to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Step 2: Event handler to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Event handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // // Step 3: Create a function to handle form submission in the modal
  // const handleFormSubmit = () => {
  //     // Perform your form submission logic here
  //     // For example, you can make an API call to create an applicant
  //     // Then close the modal
  //     closeModal();
  // };
  // ...

  const handleFormSubmit = () => {
    const formData = {
      applicant_firstName: FirstName,
      applicant_lastName: lastName,
      applicant_email: email,
      applicant_phoneNumber: mobileNumber,
      applicant_homeNumber: homeAddress,
      applicant_businessNumber: businessCenter,
      applicant_telephoneNumber: fax,
      applicant_property: property,
    };

    //console.log('Form Data:', formData); // Log the formData

    axios
      .post(`${baseUrl}/applicant/applicant`, formData)
      .then((response) => {
        //console.log('Applicant created successfully:', response.data); // Log the response
        closeModal();
        // Reset the form fields by setting state variables to empty strings
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobileNumber("");
        setHomeAddress("");
        setBusinessCenter("");
        setFax("");
        setProperty("");
      })

      .catch((error) => {
        console.error("Error creating applicant:", error); // Log any errors
      });
  };

  return (
    <>
      <AuthNavbar />
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Step 2: Add a click event to open the modal */}
            <Button
              color="primary"
              href="#rms"
              onClick={openModal}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Create Applicants
            </Button>
          </div>
        </Container>
      </div>

      <Modal isOpen={isModalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal} className="bg-secondary text-white">
          <strong> Add Applicant</strong>
        </ModalHeader>

        <ModalBody>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="applicantName">Name</Label>

                  <Input
                    type="text"
                    id="FirstName"
                    placeholder="First Name"
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="Email">Email</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fas fa-envelope"></i>
                  </span>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="Email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <div className="mb-3 form-check">
              <Input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <Label className="form-check-label" for="exampleCheck1">
                email link to online rental application
              </Label>
            </div>
            <FormGroup>
              <Label for="MobileNumber">Mobile Number</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fas fa-mobile-alt"></i>
                  </span>
                </InputGroupAddon>
                <Input
                  type="tel" // Use type "tel" for mobile numbers
                  id="MobileNumber"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fas fa-home"></i>
                  </span>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="HomeAddress"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  // placeholder="Home Address"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fas fa-fax"></i>
                  </span>
                </InputGroupAddon>
                <Input
                  id="BusinessCenter"
                  value={businessCenter}
                  onChange={(e) => setBusinessCenter(e.target.value)}
                  // placeholder="Home Address"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text">
                    <i className="fas fa-fax"></i>
                  </span>
                </InputGroupAddon>
                <Input
                  type="text"
                  id="fax"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}

                  // placeholder=""
                />
              </InputGroup>
            </FormGroup>
            <hr></hr>
            <FormGroup>
              <Label for="property">Property</Label>
              <Input
                type="select"
                id="property"
                value={property}
                onChange={(e) => setProperty(e.target.value)}
              >
                <option value="" disabled selected hidden>
                  Select Property
                </option>
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </Input>
            </FormGroup>
            <hr></hr>
          </Form>
          {/* Add more form fields here */}
        </ModalBody>

        <ModalFooter>
          {/* <Button color="secondary" onClick={closeModal}>
                        Close
                    </Button> */}
          <Button color="success" onClick={handleFormSubmit}>
            Create Applicant
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Header;
