import axios from "axios";
import { Button, Card, CardBody, Col, FormGroup, Row } from "reactstrap";
import swal from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import { OpenImageDialog } from "components/OpenImageDialog";
import { Autocomplete, TextField } from "@mui/material";

const baseUrl = process.env.REACT_APP_BASE_URL;
const imageUrl = process.env.REACT_APP_IMAGE_URL;

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

//add unit
const handleSubmit = async (rental_id, admin_id, object) => {
  object.admin_id = admin_id;
  object.rental_id = rental_id;
  try {
    const res = await axios.post(`${baseUrl}/unit/unit`, object);
    console.log(res.data.statusCode, "yashuj");
    if (res.data.statusCode === 200) {
      swal("", res.data.message, "success");
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error:", error.message);
    swal("", error.message, "error");
    return true;
  }
};

//edite unit
const handleUnitDetailsEdit = async (unit_id, object) => {
  try {
    const res = await axios.put(`${baseUrl}/unit/unit/${unit_id}`, object);
    console.log(res.data.statusCode, "yashuj");
    if (res.data.statusCode === 200) {
      swal("", res.data.message, "success");
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error:", error.message);
    swal("", error.message, "error");
    return true;
  }
};

//add appliance
const addAppliancesSubmit = async (unit_id, admin_id, object) => {
  object.admin_id = admin_id;
  object.unit_id = unit_id;
  try {
    const res = await axios.post(`${baseUrl}/appliance/appliance`, object);
    if (res.data.statusCode === 200) {
      swal("", res.data.message, "success");
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error:", error.message);
    swal("", error.message, "error");
    return true;
  }
};

//edite appliance
const editeAppliancesSubmit = async (object) => {
  try {
    const res = await axios.put(
      `${baseUrl}/appliance/appliance/${object.appliance_id}`,
      object
    );
    console.log(res.data.statusCode, "yashuj");
    if (res.data.statusCode === 200) {
      swal("", res.data.message, "success");
      return false;
    } else {
      swal("", res.data.message, "warning");
      return true;
    }
  } catch (error) {
    console.error("Error:", error.message);
    swal("", error.message, "error");
    return true;
  }
};

//delete appliance
const deleteAppliance = async (appliance_id) => {
  swal("Are You Sure You Want TO Delete ?", {
    buttons: ["No", "Yes"],
  }).then(async (buttons) => {
    if (buttons === true) {
      try {
        const res = await axios.delete(
          `${baseUrl}/appliance/appliance/${appliance_id}`
        );
        if (res.data.statusCode === 200) {
          swal("", res.data.message, "success");
          return res.data.statusCode;
        }
      } catch (error) {
        console.error("Error:", error.message);
        swal("", error.message, "error");
      }
    }
  });
};

const UnitEdite = ({
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
  closeModal,
  addUnitDialogOpen,
}) => {
  return (
    <Row style={{ width: "600px" }}>
      <Col md={12}>
        <Card style={{ position: "relative" }}>
          <CardBody>
            <form onSubmit={addUnitFormik.handleSubmit}>
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
                    {clickedObject?.rental_bath ? (
                      <Col>
                        <div>
                          <h5>Bath</h5>
                        </div>
                        <Autocomplete
                          className="form-control-alternative"
                          id="input-unitadd"
                          freeSolo
                          size="small"
                          value={addUnitFormik.values.rental_bath}
                          options={bathArray.map((option) => option)}
                          onChange={(event, newValue) => {
                            addUnitFormik.setFieldValue(
                              `rental_bath`,
                              newValue
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name={`rental_bath`}
                              id={`rental_bath`}
                              value={addUnitFormik.values.rental_bath}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                addUnitFormik.setFieldValue(
                                  `rental_bath`,
                                  newValue
                                );
                              }}
                            />
                          )}
                        />
                      </Col>
                    ) : null}
                    {clickedObject?.rental_bed ? (
                      <Col>
                        <div>
                          <h5>Bed</h5>
                        </div>
                        <Autocomplete
                          className="form-control-alternative"
                          id="input-unitadd"
                          freeSolo
                          size="small"
                          value={addUnitFormik.values.rental_bed}
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
                    ) : null}
                  </Row>
                </>
              ) : addUnitDialogOpen === "" ? (
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
                    {addUnitDialogOpen === "Residential" ? (
                      <>
                        <Col>
                          <div>
                            <h5>Bath</h5>
                          </div>
                          <Autocomplete
                            className="form-control-alternative"
                            id="input-unitadd"
                            freeSolo
                            size="small"
                            value={addUnitFormik.values.rental_bath}
                            options={bathArray.map((option) => option)}
                            onChange={(event, newValue) => {
                              addUnitFormik.setFieldValue(
                                `rental_bath`,
                                newValue
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name={`rental_bath`}
                                id={`rental_bath`}
                                value={addUnitFormik.values.rental_bath}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  addUnitFormik.setFieldValue(
                                    `rental_bath`,
                                    newValue
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
                            value={addUnitFormik.values.rental_bed}
                            options={roomsArray.map((option) => option)}
                            onChange={(event, newValue) => {
                              addUnitFormik.setFieldValue(
                                `rental_bed`,
                                newValue
                              );
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
                      </>
                    ) : null}
                  </Row>
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
                <Button color="success" type="submit">
                  Save
                </Button>
                <Button
                  onClick={() => {
                    closeModal();
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
  UnitEdite,
  handleUnitDetailsEdit,
  addAppliancesSubmit,
  editeAppliancesSubmit,
  deleteAppliance,
};
