import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik"
import validator from "validator"

import { AuthState, signInUser } from "../../../../../store/authStore"
import { RootState } from "../../../../../store/store"
import { Spinner } from "../../../Spinner/Spinner"
import styles from "./login.css"

interface LoginProps {
  onSignUp: () => void
}

interface FormValues {
  email: string
  password: string
}

interface OtherProps {
  message: string
}

export const Login = ({ onSignUp }: LoginProps) => {
  const { email, status, error } = useSelector<RootState, AuthState>(
    (state) => state.user
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const LoginForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { touched, errors, isSubmitting, message } = props

    return (
      <Form className={styles.authForm}>
        <h2 className={styles.loginTitle}>{message}</h2>
        <label htmlFor="email-input" className={styles.inputLabelEmail}>
          <span className={styles.inputTitle}>{"Email"}</span>
          {touched.email && errors.email && (
            <div className={styles.inputError}>{errors.email}</div>
          )}
          <Field
            type="email"
            name="email"
            className={styles.input}
            placeholder="Enter your email"
          />
        </label>

        <label htmlFor="password-input" className={styles.inputLabelPass}>
          <span className={styles.inputTitle}>{"Password"}</span>
          {touched.password && errors.password && (
            <div className={styles.inputError}>{errors.password}</div>
          )}
          <Field
            type="password"
            name="password"
            className={styles.input}
            placeholder="Enter your password"
          />
        </label>

        {error && (
          <div className={styles.returnError}>
            {"Login failed! Please, check you password and email and try again"}
          </div>
        )}

        <button
          type="submit"
          className={styles.loginBtn}
          disabled={isSubmitting}
        >
          {"Login"}
        </button>
      </Form>
    )
  }

  interface MyFormProps {
    initialEmail?: string
    message: string
  }

  const MyForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => {
      return {
        email: props.initialEmail || email,
        password: "",
      }
    },

    validate: (values: FormValues) => {
      const errors: FormikErrors<FormValues> = {}

      if (!values.email) {
        errors.email = "Please enter email"
      } else if (!validator.isEmail(values.email)) {
        errors.email = "Please enter a valid email address"
      }

      if (!values.password) {
        errors.password = "Please enter password"
      } else if (
        values.password.length < 6 ||
        values.password === values.password.toLowerCase() ||
        values.password === values.password.toUpperCase()
      ) {
        errors.password = "Please enter a valid password"
      }

      return errors
    },

    handleSubmit: (values: FormValues) => {
      dispatch(signInUser({ email: values.email, password: values.password }))
        .then(() => {
          navigate("/search")

          return
        })
        .catch((error_: string | undefined) => {
          console.error(error_ ?? "Unknown error")
        })
    },
  })(LoginForm)

  return (
    <div className={styles.auth}>
      <MyForm message="Login" />
      <div className={styles.signUpWrapper}>
        <span>{"Don’t have an account?"}</span>
        <button className={styles.signUpBtn} onClick={onSignUp}>
          {"Sign up"}
        </button>
      </div>

      {status === "loading" && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
    </div>
  )
}
