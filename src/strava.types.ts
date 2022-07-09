export interface StravaSummaryActivity {
  achievement_count: number
  athlete: {
    id: number
    resource_state: number
  }
  athlete_count: number
  average_speed: number
  comment_count: number
  commute: boolean
  display_hide_heartrate_option: boolean
  distance: number
  elapsed_time: number
  elev_high: number
  elev_low: number
  end_latlng: [number, number]
  external_id: string
  flagged: boolean
  from_accepted_tag: boolean
  gear_id: number
  has_heartrate: boolean
  has_kudoed: boolean
  heartrate_opt_out: boolean
  id: number
  kudos_count: number
  location_city: any
  location_country: any
  location_state: any
  manual: boolean
  map: {
    id: string
    resource_state: number
    summary_polyline: string
  }
  max_speed: number
  moving_time: number
  name: string
  photo_count: number
  pr_count: number
  private: boolean
  resource_state: number
  sport_type: string
  start_date: string
  start_date_local: string
  start_latlng: [number, number]
  timezone: string
  total_elevation_gain: number
  total_photo_count: number
  trainer: boolean
  type: string
  upload_id: number
  upload_id_str: string
  utc_offset: number
  visibility: string
  workout_type: number
}

export interface StravaAthlete {
  "id" : number,
  "username" : string,
  "resource_state" : number,
  "firstname" : string,
  "lastname" : string,
  "city" : string,
  "state" : string,
  "country" : string,
  "sex" : string,
  "premium" : boolean,
  "created_at" : string,
  "updated_at" : string,
  "badge_type_id" : number,
  "profile_medium" : string,
  "profile" : string,
  "friend" : any,
  "follower" : any,
  "follower_count" : number,
  "friend_count" : number,
  "mutual_friend_count" : number,
  "athlete_type" : number,
  "date_preference" : string,
  "measurement_preference" : string,
  "clubs" : [],
  "ftp" : any,
  "weight" : number,
  "bikes" : {
    "id" : string,
    "primary" : boolean,
    "name" : string,
    "resource_state" : number,
    "distance" : number
  }[],
  "shoes" : {
    "id" : string,
    "primary" : boolean,
    "name" : string,
    "resource_state" : number,
    "distance" : number
  }[]
}