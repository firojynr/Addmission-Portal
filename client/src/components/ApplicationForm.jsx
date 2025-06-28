import React from "react";

function ApplicationForm() {
  return (
    <div className="register-container">
      <h2 className="register-title">Application Form</h2>
      <p>Welcome! Fill in your application here...</p>
      <button
        className="button blue-button"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default ApplicationForm;
