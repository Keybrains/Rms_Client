import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ApplicantForm = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const sidenavMain = document.getElementById("sidenav-main");
    const headerElement = document.querySelector(".header");
    if (sidenavMain) {
      sidenavMain.style.display = "none";
    }
    if (headerElement) {
      headerElement.style.display = "none";
    }
    return () => {
      if (sidenavMain) {
        sidenavMain.style.display = "block";
      }
      if (headerElement) {
        headerElement.style.display = "block";
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${baseUrl}/applicant/applicant_details/${id}`
          );
          console.log(response, "yashu");
          setFormData(response.data.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [id]);

  const [formData, setFormData] = useState({
    applicant_id: "",
    admin_id: "",

    applicant_firstName: "",
    applicant_lastName: "",
    applicant_email: "",
    applicant_phoneNumber: "",
    applicant_birthDate: "",
    applicant_streetAddress: "",
    applicant_city: "",
    applicant_state: "",
    applicant_country: "",
    applicant_postalCode: "",
    agreeBy: "",

    emergency_contact: {
      first_name: "",
      last_name: "",
      relationship: "",
      email: "",
      phone_number: "",
    },

    rental_history: {
      rental_adress: "",
      rental_city: "",
      rental_state: "",
      rental_country: "",
      rental_postcode: "",
      start_date: "",
      end_date: "",
      rent: "",
      leaving_reason: "",
      rentalOwner_firstName: "",
      rentalOwner_lastName: "",
      rentalOwner_primaryEmail: "",
      rentalOwner_phoneNumber: "",
    },

    employment: {
      name: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      employment_primaryEmail: "",
      employment_phoneNumber: "",
      employment_position: "",
      supervisor_firstName: "",
      supervisor_lastName: "",
      supervisor_title: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const object = { ...formData, applicant_id: id };
      const url = `${baseUrl}/applicant/application/${id}`;
      const response = await axios.post(url, object);

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-center",
        });
        navigate("/admin/Applicants/");
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    const [mainField, nestedField] = name.split(".");
    if (nestedField) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [mainField]: {
          ...prevFormData[mainField],
          [nestedField]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <Container className="mt-5" style={{ paddingLeft: 30, paddingRight: 30 }}>
        <Box>
          <section
            className=" justify-content-center align-items-center"
            style={{
              backgroundColor: "white",
              zIndex: 10000,
              borderRadius: 15,
            }}
          >
            <div className="row d-flex justify-content-center p-5">
              <form style={{ width: "100%" }}>
                <div>
                  <h2>Applicant information</h2>
                  <div className="form-row mt-4">
                    <div className="col">
                      <lable>First name</lable>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        name="applicant_firstName"
                        value={formData?.applicant_firstName}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <lable>Last name</lable>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        name="applicant_lastName"
                        value={formData?.applicant_lastName}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  {console.log(formData, "yash")}
                  <div className="form-row mt-4">
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Applicant email"
                        name="applicant_email"
                        value={formData?.applicant_email}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="Number"
                        className="form-control"
                        placeholder="Applicant phone number"
                        name="applicant_phoneNumber"
                        value={formData?.applicant_phoneNumber}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <div className="form-row mt-4">
                    <div className="col">
                      <label htmlFor="applicantHomePhone">
                        Applicant birth date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="First name"
                        name="applicant_birthDate"
                        value={formData?.applicant_birthDate}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h2>Applicant Street Adress</h2>
                  </div>
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Street Adress"
                        name="applicant_streetAddress"
                        value={formData?.applicant_streetAddress}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="City"
                        name="applicant_city"
                        value={formData?.applicant_city}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="State"
                        name="applicant_state"
                        value={formData?.applicant_state}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <div className="form-row mt-4">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Country"
                        name="applicant_country"
                        value={formData?.applicant_country}
                        onChange={handleApplicantChange}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Zip"
                        name="applicant_postalCode"
                        value={formData?.applicant_postalCode}
                        onChange={handleApplicantChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h2>Emergency contact</h2>
                    <div className="form-row mt-4">
                      <div className="col-md-6 form-group">
                        <label htmlFor="firstName">First name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="emergency_contact?.first_name"
                          value={formData?.emergency_contact?.first_name}
                          onChange={handleApplicantChange}
                        />
                      </div>

                      <div className="col-md-6 form-group">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="emergency_contact?.last_name"
                          value={formData?.emergency_contact?.last_name}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-row">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Relationship
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter relationship"
                            name="emergency_contact?.relationship"
                            value={formData?.emergency_contact?.relationship}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col-6">
                          <label htmlFor="emergencyContactRelationship">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Emergency contact email"
                            name="emergency_contact?.email"
                            value={formData?.emergency_contact?.email}
                            onChange={handleApplicantChange}
                          />
                        </div>
                        <div className="col-6">
                          <label htmlFor="applicantHomePhone">
                            Phone number
                          </label>
                          <input
                            type="Number"
                            className="form-control"
                            placeholder="Emergency contact phone"
                            name="emergency_contact?.phone_number"
                            value={formData?.emergency_contact?.phone_number}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                  <div>
                    <h2>Rental history</h2>
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Adress"
                          name="rental_history?.rental_adress"
                          value={formData?.rental_history?.rental_adress}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          name="rental_history?.rental_city"
                          value={formData?.rental_history?.rental_city}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State"
                          name="rental_history?.rental_state"
                          value={formData?.rental_history?.rental_state}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Adress"
                          name="rental_history?.rental_country"
                          value={formData?.rental_history?.rental_country}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Zip"
                          name="rental_history?.rental_postcode"
                          value={formData?.rental_history?.rental_postcode}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Start date</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Enter first name"
                          id="firstName"
                          name="rental_data_from"
                          value={formData?.rental_data_from}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">End date</label>
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Enter last name"
                          id="lastName"
                          name="rental_date_to"
                          value={formData?.rental_date_to}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Monthly rent
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=" Monthly rent"
                            name="rental_monthlyRent"
                            value={formData?.rental_monthlyRent}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Reason for leaving
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Reason for leaving"
                            name="rental_resaonForLeaving"
                            value={formData?.rental_resaonForLeaving}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <h2>Rental owner information</h2>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Rental owner name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="rental_history?.rentalOwner_firstName"
                          value={formData?.rental_history?.rentalOwner_firstName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="rental_history?.rentalOwner_lastName"
                          value={formData?.rental_history?.rentalOwner_lastName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div className="form-row mt-4">
                      <div className="col-6">
                        <label htmlFor="emergencyContactRelationship">
                          Rental owner email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Rental owner email"
                          name="rental_history?.rentalOwner_primaryEmail"
                          value={
                            formData?.rental_history?.rentalOwner_primaryEmail
                          }
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="firstName">
                          Rental owner phone number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Rental owner phone number"
                          name="rental_history?.rentalOwner_phoneNumber"
                          value={
                            formData?.rental_history?.rentalOwner_phoneNumber
                          }
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h2>Employment</h2>
                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Employer name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Employer name"
                            name="rental_history?.name"
                            value={formData?.rental_history?.name}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="emergencyContactRelationship">
                          Employer Street address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Street Adress"
                          name="rental_history?.streetAddress"
                          value={formData?.rental_history?.streetAddress}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="City"
                          name="rental_history?.city"
                          value={formData?.rental_history?.city}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="State"
                          name="rental_history?.state"
                          value={formData?.rental_history?.state}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Country"
                          name="rental_history?.country"
                          value={formData?.rental_history?.country}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Zip"
                          name="rental_history?.postalCode"
                          value={formData?.rental_history?.postalCode}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>
                    <div className="form-row mt-4">
                      <div className="col-6">
                        <label htmlFor="emergencyContactRelationship">
                          Employer email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Employer email"
                          name="rental_history?.employment_primaryEmail"
                          value={formData?.rental_history?.employment_primaryEmail}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="firstName">Employer phone number</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Employer phone number"
                          name="rental_history?.employment_phoneNumber"
                          value={formData?.rental_history?.employment_phoneNumber}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Position held
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Position held"
                            name="rental_history?.employment_position"
                            value={formData?.rental_history?.employment_position}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row mt-4">
                      <div className="col">
                        <label htmlFor="firstName">Supervisor first name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter first name"
                          name="rental_history?.supervisor_firstName"
                          value={formData?.rental_history?.supervisor_firstName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="lastName">Supervisor last name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter last name"
                          name="rental_history?.supervisor_lastName"
                          value={formData?.rental_history?.supervisor_lastName}
                          onChange={handleApplicantChange}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Supervisor title
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Supervisor title"
                            name="rental_history?.supervisor_title"
                            value={formData?.rental_history?.supervisor_title}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <h2>Terms and conditions</h2>

                    <div>
                      <div className="form-row mt-4 pl-2">
                        <p>
                          I understand that this is a routine application to
                          establish credit, character, employment, and rental
                          history. I also understand that this is NOT an
                          agreement to rent and that all applications must be
                          approved. I authorize verification of references
                          given. I declare that the statements above are true
                          and correct, and I agree that the Rental owner may
                          terminate my agreement entered into in reliance on any
                          misstatement made above.
                        </p>
                      </div>

                      <div className="form-row mt-4 pl-4">
                        <div className="col-md-12">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                          />
                          <label
                            className="form-check-label"
                            for="defaultCheck1"
                          >
                            Agreed to*
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4">
                        <div className="col">
                          <label htmlFor="emergencyContactRelationship">
                            Agreed by
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Agreed by"
                            name="agreeBy"
                            value={formData?.agreeBy}
                            onChange={handleApplicantChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="form-row mt-4 pl-2">
                        <p>
                          By submitting this application, I am: (1) giving
                          gecbhavnagar.managebuilding.com permission to run a
                          background check on me, which may include obtaining my
                          credit report from a consumer reporting agency; and
                          (2) agreeing to the{" "}
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {" "}
                            Privacy Policy{" "}
                          </span>{" "}
                          and{" "}
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {" "}
                            Terms of Service.{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 d-flex flex-column flex-sm-row">
                  <button
                    type="button"
                    className="btn btn-primary mb-3 mb-sm-0 mr-sm-3"
                    style={{ borderRadius: "10px" }}
                    onClick={handleSubmit}
                  >
                    Save Application
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ borderRadius: "10px" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        </Box>
        <ToastContainer />
      </Container>
    </>
  );
};

export default ApplicantForm;
