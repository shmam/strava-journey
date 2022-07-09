import { useState } from 'react'
import { MapGraphic } from '../assets/MapGraphic'
import { StravaSummaryActivity } from '../strava.types'
import './Leg.scss'

export interface LegProps {
  index: number
  activity: StravaSummaryActivity
}

export const Leg: React.FC<LegProps> = ({index, activity}) => {

  const [expand, setExpand] = useState<boolean>(false)

  return (
    <div className="leg">
      <div className='leg__number'>
        <p>{index + 1}.</p>
      </div>
      <div className='leg__graphic'>
        <MapGraphic
          height={50}
          width={50}
          polylineString={activity.map.summary_polyline}
        />
      </div>
      <div className='leg__detail'>
        <p className='leg__detail--name'>{activity.name}</p>
        <p className='leg__detail--stat'>{(activity.distance * 0.000621371192).toFixed(2)}mi</p>
        <p className='leg__detail--stat'>{(activity.moving_time * 0.0002777777778).toFixed(2)}hrs</p>
      </div>
    </div>
  )
}