import React, { useState } from "react"

import styles from "./auth.css"
import { Login } from "./Login/Login"
import { SignUp } from "./SignUp/SignUp"

export const Auth = () => {
  const [haveAccount, setHaveAccount] = useState(true)

  const noAccount = (): void => {
    setHaveAccount(false)
  }

  const login = (): void => {
    setHaveAccount(true)
  }

  return (
    <div className={styles.authWrapper}>
      {haveAccount && <Login onSignUp={noAccount} />}
      {!haveAccount && <SignUp onLogin={login} />}
    </div>
  )
}
