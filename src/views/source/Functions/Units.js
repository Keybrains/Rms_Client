import axios from "axios";
import { Button, Card, CardBody, Col, FormGroup, Row } from "reactstrap";
import swal from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import { OpenImageDialog } from "components/OpenImageDialog";
import { Autocomplete, TextField } from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;

const roomsArray = [
  "1 Bed",
  "2 Bed",
  "3 Bed",
  "4 Bed",
  "5 Bed",
  "6 Bed",
  "7 Bed",
  "8 Bed",
  "9 Bed",
  "9+ Bed",
];

const bathArray = [
  "1 Bath",
  "1.5 Bath",
  "2 Bath",
  "2.5 Bath",
  "3 Bath",
  "3.5 Bath",
  "4 Bath",
  "4.5 Bath",
  "5 Bath",
  "5+ Bath",
];

function formatDateWithoutTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
}

const handleListingEdit = async (id, addUnitFormik) => {
  const updatedValues = {
    description: addUnitFormik.values.description,
    market_rent: addUnitFormik.values.market_rent,
    rental_sqft: addUnitFormik.values.size,
  };

  await axios
    .put(`${baseUrl}/propertyunit/propertyunit/` + id, updatedValues)
    .then((response) => {})
    .catch((err) => {
      console.log(err);
    });
};

const handleDeleteUnit = (id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this applicants!",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      axios
        .delete(`${baseUrl}/propertyunit/propertyunit/` + id)
        .then((response) => {
          swal("", "Your data is deleted", "success");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      swal("Cancelled", "Your data is safe", "error");
    }
  });
};

const handleSubmit = async (event) => {};

const getUnitProperty = async (unit_id) => {};

const handleUnitDetailsEdit = () => {};

const UnitEdite = ({
  openEdite,
  setOpenEdite,
  clickedObject,
  selectedImage,
  setOpen,
  open,
  clearSelectedPhoto,
  setSelectedImage,
  unitImage,
  fileData,
  togglePhotoresDialog,
  addUnitFormik,
}) => {
  return (
    <Row>
      <Col md={12}>
        <Card style={{ position: "relative" }}>
          <CardBody>
            <form onSubmit={addUnitFormik}>
              {clickedObject?.rental_unit ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div>
                      <h5>Unit Number</h5>
                    </div>
                    <TextField
                      type="text"
                      size="small"
                      id="rental_unit"
                      name="rental_unit"
                      value={addUnitFormik.values.rental_unit}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <h5>Street Address</h5>
                    </div>
                    <TextField
                      type="text"
                      size="small"
                      id="rental_unit_adress"
                      name="rental_unit_adress"
                      value={addUnitFormik.values.rental_unit_adress}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
                    />
                  </div>
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "10px",
                    }}
                  >
                    <Col>
                      <div>
                        <h5>SQFT</h5>
                      </div>
                      <TextField
                        type="text"
                        size="small"
                        id="rental_sqft"
                        name="rental_sqft"
                        value={addUnitFormik.values.rental_sqft}
                        onChange={addUnitFormik.handleChange}
                        onBlur={addUnitFormik.handleBlur}
                      />
                    </Col>
                    <Col>
                      <div>
                        <h5>Bath</h5>
                      </div>
                      <Autocomplete
                        className="form-control-alternative"
                        id="input-unitadd"
                        freeSolo
                        size="small"
                        options={bathArray.map((option) => option)}
                        onChange={(event, newValue) => {
                          addUnitFormik.setFieldValue(`rental_bath`, newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name={`rental_bath`}
                            id={`rental_bath`}
                            value={addUnitFormik.values.rental_bath}
                            onChange={(e) => {
                              addUnitFormik.setFieldValue(
                                `rental_bath`,
                                e.target.value
                              );
                            }}
                          />
                        )}
                      />
                    </Col>
                    <Col>
                      <div>
                        <h5>Bed</h5>
                      </div>
                      <Autocomplete
                        className="form-control-alternative"
                        id="input-unitadd"
                        freeSolo
                        size="small"
                        options={roomsArray.map((option) => option)}
                        onChange={(event, newValue) => {
                          addUnitFormik.setFieldValue(`rental_bed`, newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name={`rental_bed`}
                            id={`rental_bed`}
                            value={addUnitFormik.values.rental_bed}
                            onChange={(e) => {
                              addUnitFormik.setFieldValue(
                                `rental_bed`,
                                e.target.value
                              );
                            }}
                          />
                        )}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div>
                      <h5>Unit Number</h5>
                    </div>
                    <TextField
                      type="text"
                      size="small"
                      id="unit_number"
                      name="unit_number"
                      value={addUnitFormik.values.unit_number}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <h5>Street Address</h5>
                    </div>
                    <TextField
                      type="text"
                      size="small"
                      id="address1"
                      name="address1"
                      value={addUnitFormik.values.address1}
                      onChange={addUnitFormik.handleChange}
                      onBlur={addUnitFormik.handleBlur}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <div>
                        <h5>SQFT</h5>
                      </div>
                      <TextField
                        type="text"
                        size="small"
                        id="rental_sqft"
                        name="rental_sqft"
                        value={addUnitFormik.values.rental_sqft}
                        onChange={addUnitFormik.handleChange}
                        onBlur={addUnitFormik.handleBlur}
                      />
                    </div>
                  </div>
                </>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Col lg="5">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "10px",
                    }}
                  >
                    <FormGroup
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label
                        className="form-control-label"
                        htmlFor="input-unitadd"
                      >
                        Photo
                      </label>
                      <span
                        onClick={togglePhotoresDialog}
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          fontFamily: "monospace",
                          color: "blue",
                        }}
                      >
                        {" "}
                        <br />
                        <input
                          type="file"
                          className="form-control-file d-none"
                          accept="image/*"
                          multiple
                          id={`unit_img`}
                          name={`unit_img`}
                          onChange={(e) => {
                            fileData(e);
                          }}
                        />
                        <label htmlFor={`unit_img`}>
                          <b
                            style={{
                              fontSize: "20px",
                            }}
                          >
                            +
                          </b>{" "}
                          Add
                        </label>
                      </span>
                    </FormGroup>
                    <FormGroup
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        paddingLeft: "10px",
                      }}
                    >
                      <div className="d-flex">
                        {unitImage &&
                          unitImage.length > 0 &&
                          unitImage.map((unitImg, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                margin: "10px",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <img
                                src={unitImg}
                                alt=""
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  borderRadius: "10px",
                                }}
                                onClick={() => {
                                  setSelectedImage(unitImg);
                                  setOpen(true);
                                }}
                              />
                              <ClearIcon
                                style={{
                                  cursor: "pointer",
                                  alignSelf: "flex-start",
                                  position: "absolute",
                                  top: "-12px",
                                  right: "-12px",
                                }}
                                onClick={() =>
                                  clearSelectedPhoto(index, "propertyres_image")
                                }
                              />
                            </div>
                          ))}
                        <OpenImageDialog
                          open={open}
                          setOpen={setOpen}
                          selectedImage={selectedImage}
                        />
                      </div>
                    </FormGroup>
                  </div>
                </Col>
              </div>

              <div style={{ marginTop: "10px" }}>
                <Button
                  color="success"
                  type="submit"
                  onClick={() => {
                    handleUnitDetailsEdit(
                      clickedObject?._id,
                      clickedObject?.rentalId
                    );
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setOpenEdite(!openEdite);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export {
  formatDateWithoutTime,
  handleListingEdit,
  handleDeleteUnit,
  roomsArray,
  bathArray,
  handleSubmit,
  getUnitProperty,
  UnitEdite,
};
