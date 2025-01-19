document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector(".signup form");
  const signinForm = document.querySelector(".signin form");

  // Handle Signup Form
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const username = signupForm.querySelector("input[name='username']").value;
    const email = signupForm.querySelector("input[name='email']").value;
    const password = signupForm.querySelector("input[name='password']").value;
    const confirmPassword = signupForm.querySelector(
      "input[name='confirmPassword']"
    ).value;

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send request to the API for signup
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle successful signup (e.g., store token, redirect, etc.)
        console.log("User signed up:", result);
        alert("Sign up successful!");
      } else {
        // Handle errors from API response
        console.error(result.errors || result.message);
        alert(result.errors || result.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Handle Signin Form
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const username = signinForm.querySelector("input[name='username']").value;
    const password = signinForm.querySelector("input[name='password']").value;

    // Send request to the API for login
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle successful login (e.g., store token, redirect, etc.)
        console.log("User logged in:", result);
        alert("Login successful!");
      } else {
        // Handle errors from API response
        console.error(result.errors || result.message);
        alert(result.errors || result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Handle Form Toggle
  const login = document.querySelector(".login");
  const create = document.querySelector(".create");
  const container = document.querySelector(".container");

  login.onclick = function () {
    container.classList.add("signinForm");
  };

  create.onclick = function () {
    container.classList.remove("signinForm");
  };
});
