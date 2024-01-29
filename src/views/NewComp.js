import React from "react";
import { useParams } from "react-router-dom";

function NewComp() {
  const { shivam } = useParams();
  console.log(shivam, "shivam");
  return (
    <div>
      <h2>Hello, {shivam}! Welcome to the signin page.</h2>
      {/* Add your signin form or content here */}
    </div>
  );
}

export default NewComp;
