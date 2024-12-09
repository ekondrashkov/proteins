import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Field, Form, FormikErrors, FormikProps, withFormik } from "formik"
import validator from "validator"

import { AuthState, createUser } from "../../../../../store/authStore"
import { RootState } from "../../../../../store/store"
import { Spinner } from "../../../Spinner/Spinner"
import styles from "./signup.css"

interface SignUpProps {
  onLogin: () => void
}

interface FormValues {
  email: string
  password: string
  repeatPassword: string
}

interface OtherProps {
  message: string
}

export const SignUp = ({ onLogin }: SignUpProps) => {
  const { status, error } = useSelector<RootState, AuthState>(
    (state) => state.user
  )

  const dispatch = useDispatch()

  const SignUpForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { touched, errors, isSubmitting, message } = props

    return (
      <Form className={styles.authForm}>
        <h2 className={styles.loginTitle}>{message}</h2>
        <label className={styles.inputLabelEmail}>
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

        <label className={styles.inputLabelPass}>
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

        <label className={styles.inputLabelRepeatPass}>
          <span className={styles.inputTitle}>{"Repeat password"}</span>
          {touched.repeatPassword && errors.repeatPassword && (
            <div className={styles.inputError}>{errors.repeatPassword}</div>
          )}
          <Field
            type="password"
            name="repeatPassword"
            className={styles.input}
            placeholder="Repeat your password"
          />
        </label>

        {error && (
          <div className={styles.returnError}>
            {"Sign up failed! Please, check your data and try again"}
          </div>
        )}

        <button
          type="submit"
          className={styles.loginBtn}
          disabled={isSubmitting}
        >
          {"Create Account"}
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
        email: props.initialEmail || "",
        password: "",
        repeatPassword: "",
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
        values.password === values.password.toUpperCase() ||
        !/\d/.test(values.password)
      ) {
        errors.password =
          "Must be min 6 symbols with upper, lowercase and number"
      }

      if (!values.repeatPassword) {
        errors.repeatPassword = "Please repeat password"
      } else if (values.repeatPassword !== values.password) {
        errors.repeatPassword = "Passwords don't match"
      }

      return errors
    },

    handleSubmit: (values: FormValues) => {
      dispatch(createUser({ email: values.email, password: values.password }))
        .then(() => {
          onLogin()

          return
        })
        .catch((_error: string | undefined) => {
          console.error(_error ?? "Unknown error")
        })
    },
  })(SignUpForm)

  return (
    <div className={styles.auth}>
      <MyForm message="Sign up" />
      <div className={styles.signUpWrapper}>
        <span>{"Already have an account?"}</span>
        <button className={styles.signUpBtn} onClick={onLogin}>
          {"Login"}
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
