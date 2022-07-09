import React, { useContext, useState } from "react"
import { useEffect } from "react"
import { LoginContext, LoginContextType } from "../App"
import { getUserActivities } from "../services/strava.service"
import { StravaSummaryActivity } from "../strava.types"
import './ActivityList.scss'
import Journey from "./Journey"

const ActivityList: React.FC = () => {

  const loginContext: LoginContextType = useContext<LoginContextType>(LoginContext)
  const [activities, setActivities] = useState<Array<StravaSummaryActivity>>([])
  const [selectedActivities, setSelectedActivities] = useState<Map<number,StravaSummaryActivity>>(new Map())
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if(activities.length === 0) {
      getUserActivities(loginContext.token)
      .then((res) => {
        setActivities(res.data)
      })
    }
  }, [loginContext.token])

  const toggleSelectActivity = (toggledActivity: StravaSummaryActivity) => {
    if(selectedActivities.has(toggledActivity.id)) {
      selectedActivities.delete(toggledActivity.id)
      setSelectedActivities(new Map(selectedActivities))
    } else {
      setSelectedActivities(new Map(selectedActivities.set(toggledActivity.id, toggledActivity)))
    }
  }

  const loadMoreActivities = () => {
    const newPage = page +1
    const currentActivities = activities

    getUserActivities(loginContext.token, newPage)
      .then((res) => {
        setActivities(currentActivities.concat(res.data))
      })
    setPage(newPage)
  }

  return(
    <>
      <div className="ActivityList">
        <div className="ActivityList__toolbar">
          <p className="ActivityList__toolbar--info">select a list of consecutive activities that make up one journey</p>
        </div>
        <div className="ActivityList__scrollview">
          {activities.map((activity: StravaSummaryActivity) => {
            const className = `ActivityList__item${selectedActivities.has(activity.id) ? '--selected' : ''}`

            return (
              <div className={className} key={activity.id} onClick={() => toggleSelectActivity(activity)}>
                <div className="ActivityList__item--data">
                  <div className="ActivityList__item--title">
                    <div>{activity.name}</div>
                  </div>
                  <div className="ActivityList__item--meta">
                    <div>{activity.type}</div>
                    <div>{`${(activity.distance * 0.000621371192).toFixed(2)}mi`}</div>
                    <div>{(new Date(activity.start_date)).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <button className="ActivityList__button" onClick={() => loadMoreActivities()}>load more</button>
      </div>
      <Journey selectedActivities={selectedActivities}/>
    </>
  )
}



export default ActivityList