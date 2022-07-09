import axios from "axios";

export const requestAuthCode = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID || '';
  const redirect = process.env.REACT_APP_REDIRECT_URI || '';
  const response_type = 'code';
  const loginURI = process.env.REACT_APP_LOGIN_URL || '';
  const scopes = process.env.REACT_APP_LOGIN_SCOPES || '';
  const approval_prompt = 'force';
  const url = `${loginURI}/authorize?client_id=${clientId}&response_type=${response_type}&redirect_uri=${redirect}&approval_prompt=${approval_prompt}&scope=${scopes}`;
  window.location.href = url;
}

export const verifyAuthCode = (): AuthCodeResponse => {
  const url = new URL(window.location.href)
  const searchParams = url.searchParams
  if (searchParams.get('scope') === 'read,activity:read_all,profile:read_all,read_all' && searchParams.get('code') !== '') {
    return {
      success: true,
      code: searchParams.get('code') || '0'
    }
  } else {
    return {
      success: false,
      code: ''
    }
  }
}

export const tokenExchange = async (code: string) => {
  const url = `${process.env.REACT_APP_LOGIN_URL}/token`
  const requestParams = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code'
  }

  return axios.post(url, null, { params: requestParams })
}

export const tokenRefresh = async () => {}

export const sanitizeURL = () => {
  let url = new URL(window.location.href)
  url.searchParams.delete('scope')
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.pushState({}, '', url)
}

export const logout = async (token: string) => {
  const url = `${process.env.REACT_APP_LOGIN_URL || ''}/deauthorize?access_token=${token}`
  return axios.post(url)
}

export interface AuthCodeResponse {
  success: boolean;
  code: string
}

export interface AuthTokenResponse {
  access_token: string
  athlete: any
  expires_at: number
  expires_in: number
  refresh_token: string
  token_type: string
}