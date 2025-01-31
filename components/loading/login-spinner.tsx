import React from "react";

const LoginSpinner = () => {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"
      role="status"
    ></div>
  );
};

export default LoginSpinner;
