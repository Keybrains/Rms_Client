import React from 'react';

const NotFound = () => {
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4D4D4D', // Grey background color
  };

  const boxStyle = {
    padding: '20px',
    textAlign: 'left', // Adjusted textAlign to left
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Shadow effect
    backgroundColor: '#fff', // Box background color
    height: 'auto', // Increased height
    width: 'auto', // Increased width
    fontSize: '18px', // Increased font size
  };

  const headingStyle = {
    color: '#333',
  };

  const paragraphStyle = {
    color: '#666',
  };

  const linkStyle = {
    color: '#007BFF', // Blue color for the link
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  // Responsive padding for all screen sizes
  const responsivePadding = {
    padding: '40px',
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...boxStyle, ...responsivePadding }}>
        <h1 style={headingStyle}>Admin Not Found</h1>
        <p style={paragraphStyle}>Sorry, we can't find the page you requested</p>
        <p style={paragraphStyle}>The website could have moved, or you might have mistyped the URL.</p>
        <p style={paragraphStyle}>If you have an account with 302 properties, you can try to sign in at:</p>
        <p style={paragraphStyle}>
          <a href="mailto:support@302properties.com" style={linkStyle}>support@302properties.com</a>
        </p>
        <p style={paragraphStyle}>Don't have an account with us? We would love to help you out!</p>
        <p style={paragraphStyle}>
          Sign up for a FREE trial at <a href="https://302properties.com" style={linkStyle}>302properties.com</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
