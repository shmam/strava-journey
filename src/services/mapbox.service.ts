import polyline from "@mapbox/polyline"
import { LngLatBounds } from "mapbox-gl"
import mapboxgl from "mapbox-gl"
import axios from "axios"

export const coordsToGeoJson = (coordinates: [number, number][]): GeoJSON.LineString => {
  const combinedPolyLine: string = polyline.encode(coordinates)
  return polyline.toGeoJSON(combinedPolyLine)
}

export const calculateLineBounds = (geoJsonData: GeoJSON.LineString): LngLatBounds => {
  const bounds = new mapboxgl.LngLatBounds(
    [geoJsonData.coordinates[0][0], geoJsonData.coordinates[0][1],
    geoJsonData.coordinates[0][0], geoJsonData.coordinates[0][1]]
  );

  for (const coord of geoJsonData.coordinates) {
    bounds.extend([coord[0], coord[1]]);
  }
  return bounds
}

export const resolveCityFromCoord = async (coordinates: [number,number]) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[1]},${coordinates[0]}.json`
  const params = {
    'types': 'place',
    'limit': 1,
    'access_token': process.env.REACT_APP_MAPBOX_TOKEN || ''
  }

  return axios.get(url, {params: params})
}