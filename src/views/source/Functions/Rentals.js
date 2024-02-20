import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const baseUrl = process.env.REACT_APP_BASE_URL;

export const dialogPaperStyles = {
  maxWidth: "lg",
  width: "100%",
  verflowY: "auto",
};

export const editProperty = async (
  rentals,
  rentalOwners,
  admin_id,
  property_id
) => {
  try {
    const object = {
      rentalOwner: {
        admin_id: admin_id,
        rentalowner_id: rentalOwners.rentalowner_id,
        rentalOwner_firstName: rentalOwners.rentalOwner_firstName,
        rentalOwner_lastName: rentalOwners.rentalOwner_lastName,
        rentalOwner_companyName: rentalOwners.rentalOwner_companyName,
        rentalOwner_primaryEmail: rentalOwners.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber: rentalOwners.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalOwners.rentalOwner_homeNumber,
        rentalOwner_businessNumber: rentalOwners.rentalOwner_businessNumber,
      },
      rental: {
        admin_id: admin_id,
        rental_id: rentals.rental_id,
        property_id: property_id,
        rental_adress: rentals.rental_adress,
        rental_city: rentals.rental_city,
        rental_state: rentals.rental_state,
        rental_country: rentals.rental_country,
        rental_postcode: rentals.rental_postcode,
        staffmember_id: rentals.staffmember_id,
      },
    };
    const res = await axios.put(
      `${baseUrl}/rentals/rentals/${rentals.rental_id}`,
      object
    );
    if (res.data.statusCode === 200) {
      toast.success(res.data.message, {
        position: "top-center",
      });
      return false;
    } else {
      toast.warning(res.data.message, {
        position: "top-center",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    toast.error("An error occurred while adding the property", {
      position: "top-center",
    });
  }
};

export const handleSubmit = async (
  rentals,
  rentalOwners,
  admin_id,
  property_id
) => {
  try {
    const object = {
      rentalOwner: {
        admin_id: admin_id,
        rentalOwner_firstName: rentalOwners.rentalOwner_firstName,
        rentalowner_id: rentalOwners.rentalowner_id,
        rentalOwner_lastName: rentalOwners.rentalOwner_lastName,
        rentalOwner_companyName: rentalOwners.rentalOwner_companyName,
        rentalOwner_primaryEmail: rentalOwners.rentalOwner_primaryEmail,
        rentalOwner_phoneNumber: rentalOwners.rentalOwner_phoneNumber,
        rentalOwner_homeNumber: rentalOwners.rentalOwner_homeNumber,
        rentalOwner_businessNumber: rentalOwners.rentalOwner_businessNumber,
        city: rentalOwners.city,
        state: rentalOwners.state,
        country: rentalOwners.country,
        postal_code: rentalOwners.postal_code,
      },
      rental: {
        admin_id: admin_id,
        property_id: property_id,
        rental_adress: rentals.rental_adress,
        rental_city: rentals.rental_city,
        rental_state: rentals.rental_state,
        rental_country: rentals.rental_country,
        rental_postcode: rentals.rental_postcode,
        staffmember_id: rentals.staffmember_id,
      },
      units:
        rentals.property_type === "Residential"
          ? rentals.residential.map((residentialItem) => {
              const {
                rental_unit,
                rental_unit_adress,
                rental_sqft,
                rental_bath,
                rental_bed,
                propertyres_image,
              } = residentialItem;

              return {
                admin_id: admin_id,
                rental_unit: rental_unit,
                rental_unit_adress: rental_unit_adress,
                rental_sqft: rental_sqft,
                rental_bath: rental_bath,
                rental_bed: rental_bed,
                rental_images: propertyres_image,
              };
            })
          : rentals.commercial.map((commercialItem) => {
              const {
                rental_unit,
                rental_unit_adress,
                rental_sqft,
                propertyres_image,
              } = commercialItem;

              return {
                admin_id: admin_id,
                rental_unit: rental_unit,
                rental_unit_adress: rental_unit_adress,
                rental_sqft: rental_sqft,
                rental_images: propertyres_image,
              };
            }),
    };
    const res = await axios.post(`${baseUrl}/rentals/rentals`, object);
    if (res.data.statusCode === 200) {
      toast.success("Property Added Successfully!", {
        position: "top-center",
      });
      return false;
    } else {
      if (res.data.statusCode === 201) {
        toast.error(res.data.message, {
          position: "top-center",
        });
      } else {
        toast.error(res.data.message, {
          position: "top-center",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    toast.error("An error occurred while adding the property", {
      position: "top-center",
    });
  }
};
