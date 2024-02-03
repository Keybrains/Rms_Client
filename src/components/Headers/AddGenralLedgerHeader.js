import React from 'react';
import { Container, Row, Col } from "reactstrap";


// const AddGenralLedgerHeader = () => {
//   return (
//     <>
//       <div className="header pb-8 pt-5 pt-md-8" 
//       style={{
//           background: '#263238'
//         }}
//         >
//         <Container fluid>
//           <div className="header-body">
//           </div>
//         </Container>
//       </div>
//     </>
//   )
// }


const AddGenralLedgerHeader = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "300px",
          background:"blue",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-info opacity-8" />
        
        {/* Header container */}
        <Container className=" align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Add General Ledger</h1>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddGenralLedgerHeader