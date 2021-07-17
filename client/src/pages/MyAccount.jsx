import React from "react";
import Page from "../components/Page";

function MyAccount(props) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <Page>
        <button
          className="btn btn-primary btn-sm shadow-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
        <h3 className="text-center mt-3">Account</h3>
      </Page>
    </>
  );
}

export default MyAccount;