import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  email: yup
    .string()
    .email()
    .required("Please enter your email"),
  terms: yup.boolean().oneOf([true], "please agree to terms of use"),
  password: yup.string().required("must include password")
});

export default function Form() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    terms: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    terms: "",
    password: ""
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [post, setPost] = useState([]);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const validateChange = e => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors
        });
      });
  };
  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data);
        console.log("success", post);

        setFormState({
          name: "",
          email: "",
          terms: "",
          password: ""
        });
      })
      .catch(err => {
        console.log(err.res);
      });
  };

  const inputChange = e => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };
    validateChange(e);
    setFormState(newFormData);
  };

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          id="name"
          type="text"
          name="name"
          value={formState.name}
          onChange={inputChange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>
      <label htmlFor="email">
        Email
        <input
          id="email"
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errors.email.length > 0 ? (
          <p className="error"> {errors.email}</p>
        ) : null}
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          id="password"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errors.password.length > 0 ? (
          <p className="error">{errors.password}</p>
        ) : null}
      </label>

      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        I agree to terms and Conditions
      </label>
      <pre>{JSON.stringify(post, null, 2)}</pre>
      <button name="submit" disabled={buttonDisabled}>
        Submit
      </button>
    </form>
  );
}
