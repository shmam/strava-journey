import { AxiosResponse } from "axios"
import React from "react"
import './Login.scss'
import { useEffect, useContext } from "react"
import { LoginContext, LoginContextType } from "../App"
import { requestAuthCode, AuthCodeResponse, verifyAuthCode, logout, sanitizeURL, tokenExchange, AuthTokenResponse } from "../services/login.service"
import { getUser } from "../services/strava.service"
import { StravaAthlete } from "../strava.types"

export interface LoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  setToken: React.Dispatch<React.SetStateAction<string>>
  setUser: React.Dispatch<React.SetStateAction<StravaAthlete | undefined>>
}

const Login: React.FC<LoginProps> = ({setLoggedIn, setToken, setUser}) => {

  const loginContext: LoginContextType = useContext<LoginContextType>(LoginContext)

  useEffect(() => {
    if(!loginContext.loggedIn) {
      const authCodeResponse: AuthCodeResponse = verifyAuthCode();

      if (authCodeResponse.success) {
        let token = ''
        tokenExchange(authCodeResponse.code)
          .then(
            (res: AxiosResponse<AuthTokenResponse>) => {
              setLoggedIn(true)
              token = res.data.access_token
              setToken(res.data.access_token)
              sanitizeURL()
            }
          ).then(() => {
            getUser(token).then(
              (res: AxiosResponse<StravaAthlete>) => {
                setUser(res.data)
              }
            )
          })
        }
      }
    }, [])

  const handleLogout = () => {
    logout(loginContext.token).then(res => console.log(res))
    setLoggedIn(false)
    setToken('')
    sanitizeURL();
    window.location.reload();
  }

  return(
      <div className="Login">
        {loginContext.loggedIn ?
          <button onClick={() => handleLogout()}>✌️LogOut</button>
          :
          <>
            {/* <p>Login with Strava to continue</p> */}
            <button onClick={requestAuthCode}>Login with Strava to continue</button>
          </>
        }
      </div>
  )
}

export default Login