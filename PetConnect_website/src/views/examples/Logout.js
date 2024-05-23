import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownItem } from "reactstrap";
import { signOut } from 'firebase/auth';
import { auth } from "components/Firebase/Firebase.js"; // Adjust this path as necessary

function Logout() {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();

    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        localStorage.removeItem('userUid');  // Clear user session UID from local storage
        navigate('/login');  // Redirect to login page or home page after logout
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <DropdownItem href="#pablo" onClick={handleLogout}>
      Odjava
    </DropdownItem>
  );

}

export default Logout;
