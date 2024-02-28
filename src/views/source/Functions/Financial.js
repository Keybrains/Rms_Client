import axios from "axios";
import moment from "moment";

const baseUrl = process.env.REACT_APP_BASE_URL;
const imageUrl = process.env.REACT_APP_IMAGE_POST_URL;

const financialTypeArray = ["Month to date", "Three months to date", "All"];

const todayDate = () => {
  const todayDate = moment().format("YYYY-MM-DD");
  const monthNumber = todayDate.substring(5, 7);
  const month = new Date(0, monthNumber - 1).toLocaleString("en-US", {
    month: "long",
  });
  return month;
};

const calculateTotalIncome = (property) => {
  let totalIncome = 0;

  property?.unit?.forEach((unit) => {
    unit?.paymentAndCharges?.forEach((charge) => {
      totalIncome += charge.amount || 0;
    });
  });

  return totalIncome.toFixed(2);
};

const calculateTotalExpenses = (property) => {
  let totalExpenses = 0;

  property?.unit?.forEach((unit) => {
    unit?.property_expense?.forEach((charge) => {
      totalExpenses += charge.amount || 0;
    });
  });

  return totalExpenses.toFixed(2);
};

const calculateNetIncome = (property) => {
  const totalIncome = calculateTotalIncome(property);
  const totalExpenses = calculateTotalExpenses(property);
  const netIncome = (totalIncome - totalExpenses).toFixed(2);
  return netIncome;
};

const handleImageChange = async (event, rental_id) => {
  const files = event.target.files;

  const formData = new FormData();
  formData.append(`files`, files[0]);

  var image;

  try {
    const result = await axios.post(`${imageUrl}/images/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    image = {
      rental_image: result.data.files[0].filename,
    };

    const response = await axios.put(`${baseUrl}/rentals/proparty_image/${rental_id}`, image);
    if (response.data.statusCode === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error, "Error");
    return false;
  }
};


export {
  financialTypeArray,
  todayDate,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetIncome,
  handleImageChange,
};
