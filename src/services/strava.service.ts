import axios from "axios"

const STRAVA_API_BASE_URL = 'https://www.strava.com/api/v3'

export const getUser = async (token: string) => {
  const url = `${STRAVA_API_BASE_URL}/athlete`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  return axios.get(url, {headers})
}

export const getUserActivities = async (token: string, page: number = 1) => {
  const url = `${STRAVA_API_BASE_URL}/athlete/activities`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const requestParams = {
    page: page,
  }

  return axios.get(url, {headers, params: requestParams})
}

export const getActivityStream = async (token: string, activityId: string) => {
  const url = `${STRAVA_API_BASE_URL}/activities/${activityId}/streams`
  const headers = {
    'Authorization': `Bearer ${token}`
  }

  const requestParams = {
    keys: 'latlng'
  }

  return axios.get(url, {headers, params: requestParams})
}