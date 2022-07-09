import React, { useContext, useRef, useState } from "react"
import { useEffect } from "react"
import { LoginContext, LoginContextType } from "../App"
import { StravaSummaryActivity } from "../strava.types"
import "./Journey.scss"
import mapboxgl, { LngLatBounds } from "mapbox-gl"
import polyline from "@mapbox/polyline"
import { calculateLineBounds, coordsToGeoJson, resolveCityFromCoord } from "../services/mapbox.service"
import { TrophyIcon } from "../assets/Trophy"
import { Leg } from "./Leg"

export interface JourneyProps {
  selectedActivities: Map<number, StravaSummaryActivity>
}

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || ''

const Journey: React.FC<JourneyProps> = ({selectedActivities}) => {

  const loginContext: LoginContextType = useContext<LoginContextType>(LoginContext)
  const mapContainer = useRef<any>();
  const map = useRef<any>();

  const [chronologicalActivities, setChronologicalActivities] = useState<StravaSummaryActivity[]>([])
  const [startDate, setStartDate] = useState<string>()
  const [endDate, setEndDate] = useState<string>()
  const [startCity, setStartCity] = useState<string>()
  const [endCity, setEndCity] = useState<string>()
  const [distance, setDistance] = useState<number>()
  const [elevation, setElevation] = useState<number>()
  const [time, setTime] = useState<number>()
  const [pace, setPace] = useState<number>()
  const [achievements, setAchievements] = useState<number>()

  const sortActivities = (activityMap: Map<number, StravaSummaryActivity>): StravaSummaryActivity[]  => {

    return Array.from(activityMap.values())
      .sort(
        (a: StravaSummaryActivity, b: StravaSummaryActivity) =>
          (new Date(a.start_date)).getTime() - (new Date(b.start_date)).getTime()
      )
  }

  const initalizeMapContainer = () => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/shmam/cl58yncyh006h14qq4datmsig/draft',
      center: [-73.96744, 40.77285],
      zoom: 9,
    });

    const initalGeoJsonData = polyline.toGeoJSON('')
    map.current.on('load', () => {
      map.current.addSource('trace', { type: 'geojson', data:  initalGeoJsonData});

      map.current.addLayer({
        'id': 'trace',
        'type': 'line',
        'source': 'trace',
        'paint': {
          'line-color': '#FC5200',
          'line-opacity': 1,
          'line-width': 4
        }
      })
    })
  }

  const formatDate = (dateString: string | undefined): string => {
    if (dateString !== undefined) {
      const d = new Date(dateString)
      return `${d.getMonth() + 1}/${d.getDate()}`
    }
    return ''
  }

  useEffect(() => {
    const sortedActivities: StravaSummaryActivity[] = sortActivities(selectedActivities)
    setChronologicalActivities(sortedActivities)
    const numberActivities = sortedActivities.length

    let combinedPoints: [number, number][] = []
    let tempDistance = 0;
    let tempElevation = 0;
    let tempTime = 0
    let paceValues: number[] = []
    let tempAchievements = 0
    sortedActivities.forEach((act: StravaSummaryActivity) => {
      combinedPoints = combinedPoints.concat(polyline.decode(act.map.summary_polyline))
      tempDistance += act.distance * 0.000621371192
      tempElevation += act.total_elevation_gain * 3.28084
      tempTime += act.moving_time * 0.0002777777778
      paceValues.push(tempDistance / tempTime)
      tempAchievements += act.achievement_count
    })


    if (numberActivities > 0) {
      setStartDate(sortedActivities[0].start_date)
      setEndDate(sortedActivities[numberActivities - 1].start_date)

      resolveCityFromCoord(sortedActivities[0].start_latlng).then(
        res => setStartCity(res.data.features[0].text))
      resolveCityFromCoord(sortedActivities[numberActivities - 1].end_latlng).then(
        res => setEndCity(res.data.features[0].text))

      setDistance(tempDistance)
      setElevation(tempElevation)
      setTime(tempTime)
      setPace(paceValues.reduce((a,b) => a + b) / paceValues.length)
      setAchievements(tempAchievements)
    }

    const gjdata: GeoJSON.LineString = coordsToGeoJson(combinedPoints)

    if (!map.current) initalizeMapContainer()

    if (map.current && sortedActivities.length > 0) {
      map.current.getSource('trace')?.setData(gjdata);
      const bounds: LngLatBounds = calculateLineBounds(gjdata)
      map.current.fitBounds(bounds, {
        padding: 20,
      });

    } else if (map.current && sortedActivities.length === 0 ) {
      map.current.getSource('trace')?.setData(gjdata);
    }
  }, [selectedActivities]);

  const user = loginContext.user
  return (
    <div className="journey">
      {selectedActivities.size > 0 &&
        <>
          <div className="journey__athlete_info">
            <img src={user?.profile || ''} alt="profile pic"></img>
            <div style={{'display': 'flex', 'flexDirection': 'column'}}>
              <p className="journey__athlete_info--name">{(user?.firstname + ' ' + user?.lastname) || ''}</p>
              <div style={{'display': 'flex', 'flexDirection': 'row', 'gap': '.5rem', 'color': '#6d6d78'}}>
                <p className="journey__athlete_info--dates"> {formatDate(startDate)} → {formatDate(endDate)}</p>
                <p>·</p>
                <p className="journey__athlete_info--locations"> {startCity} → {endCity} </p>
              </div>
            </div>
          </div>
          <p className="journey__name">My Journey</p>
          <div className="journey__stats">
            <div className="journey__stats--item">
              <p className="journey__stats--label">Distance</p>
              <p className="journey__stats--value">{distance?.toFixed(1)}mi</p>
            </div>
            <div className="journey__stats--item">
              <p className="journey__stats--label">Elev. Gain</p>
              <p className="journey__stats--value">{elevation?.toFixed(0)}ft</p>
            </div>
            <div className="journey__stats--item">
              <p className="journey__stats--label">Time</p>
              <p className="journey__stats--value">{time?.toFixed(1)}hr</p>
            </div>
            <div className="journey__stats--item">
              <p className="journey__stats--label">Avg. Pace</p>
              <p className="journey__stats--value">{pace?.toFixed(1)}mi</p>
            </div>
            <div className="journey__stats--item" style={{'flexGrow': 1, 'textAlign': 'right'}}>
              <p className="journey__stats--label">Achievements</p>
              <p className="journey__stats--value"><TrophyIcon/> {achievements}</p>
            </div>
          </div>
        </>
      }
      <div ref={mapContainer} id="map-container" className="map-container"/>
      {selectedActivities.size > 0 &&
        <>
          <p className="journey__leg--title">Journey Legs</p>
          {chronologicalActivities.map(
            (eachActivity: StravaSummaryActivity, index: number) =>
              <Leg
                key={index}
                index={index}
                activity={eachActivity}
              />
          )}
        </>

      }
    </div>
  )
}



export default Journey