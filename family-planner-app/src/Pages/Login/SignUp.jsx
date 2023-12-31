import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Config/supabaseClient";
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import PropTypes from "prop-types";

const SignUp = (props) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstname,
            last_name: formData.lastname,
          },
        },
      });

      if (error) {
        setFetchError(error.message);
      }

      if (data.session !== null && data.user !== null) {
        navigate("/");
      }
    } catch {
      setFetchError("Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen flex flex-col justify-center items-center">
      <div className="w-80 h-60">
        <img
          src="/android-chrome-384x384.png"
          alt="Family Planner App"
          className="w-full"
        />
      </div>
      <div className="w-80 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mt-0 text-center">Sign Up</h2>
        {fetchError && <Alert severity="error">{fetchError}</Alert>}
        <form
          className="flex flex-col items-center border-solid border-2 border-black rounded-xl p-3"
          onSubmit={handleSubmit}
        >
          <TextField
            variant="outlined"
            size="small"
            label="First Name"
            type="text"
            name="firstname"
            autoComplete="on"
            onChange={handleChange}
            sx={{ paddingBottom: "7px" }}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Last Name"
            type="text"
            name="lastname"
            autoComplete="on"
            onChange={handleChange}
            sx={{ paddingBottom: "7px" }}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Email"
            type="email"
            name="email"
            autoComplete="on"
            onChange={handleChange}
            sx={{ paddingBottom: "7px" }}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Password"
            type="password"
            name="password"
            autoComplete="off"
            onChange={handleChange}
            sx={{ paddingBottom: "7px" }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ width: "100px" }}
          >
            Sign Up
          </Button>
        </form>
      </div>
      <Button
        variant="text"
        type="button"
        size="small"
        onClick={() => props.onFormSwitch("login")}
      >
        Already have an account? Login here.
      </Button>
    </div>
  );
};

SignUp.propTypes = {
  onFormSwitch: PropTypes.func,
};

export default SignUp;
