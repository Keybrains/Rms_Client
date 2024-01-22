import moment from "moment";

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

export {
  financialTypeArray,
  todayDate,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetIncome,
};
