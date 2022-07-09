import React, { useState } from 'react';
import './App.scss';
import ActivityList from './components/ActivityList';
import Login from './components/Login';
import { StravaAthlete } from './strava.types';

export const LoginContext = React.createContext<LoginContextType>({
  loggedIn: false,
  token: '',
  user: undefined
})

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<StravaAthlete>()

  return (
    <div className="App">
      <p>imagine....</p>
      <h1><span>STRAVA</span> Journey</h1>
      <p>(noun): an act of traveling from one place to another.</p>
      <LoginContext.Provider value={{loggedIn, token, user}}>
        {loggedIn &&
          <ActivityList />
        }
        <Login
          setLoggedIn={setLoggedIn}
          setToken={setToken}
          setUser={setUser}
        />
      </LoginContext.Provider>

      <p>made with ❤️ and curiocity by <a href='https://samcrochet.dev'>Sam Crochet</a></p>
      <p className='disclaimer'>DISCLAIMER: This is not in any way affiliated with Strava Inc.</p>
    </div>
  );
}

export interface LoginContextType {
  loggedIn: boolean;
  token: string;
  user: StravaAthlete | undefined;
}

export default App;
