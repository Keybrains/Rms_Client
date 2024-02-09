import React from "react";
import { Container } from "reactstrap";

function SuperAdminHeader() {
  return (
    <>
      <div className="header pb-8 pt-5 pt-md-8" style={{
          background: '#006600'
        }}>
        <Container fluid>
          <div className="header-body">
          </div>
        </Container>
      </div>
    </>
  );
}

export default SuperAdminHeader;
