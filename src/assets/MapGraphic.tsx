import polyline from "@mapbox/polyline"

export interface MapGraphicProps {
  width: number;
  height: number;
  polylineString: string;
}

export const MapGraphic: React.FC<MapGraphicProps> = ({width, height, polylineString}) => {

  const latlngToPoint = (lat: number, lng: number): {x: number, y: number} => {
    return {
      x: (lng + 180) * (256 / 360),
      y: (256 / 2) - (256 * Math.log(Math.tan((Math.PI / 4) + ((lat * Math.PI / 180) / 2))) / (2 * Math.PI))
    }
  }

  let path: string[] = []
  let minX = 256
  let minY = 256
  let maxX = 0
  let maxY = 0

  const coords = polyline.decode(polylineString)
  coords.forEach(
    (coord: [number, number]) => {
      const lat = coord[0]
      const lng = coord[1]
      const point = latlngToPoint(lat,lng)
      minX = Math.min(minX, point.x)
      minY = Math.min(minY, point.y)
      maxX = Math.max(maxX, point.x)
      maxY = Math.max(maxY, point.y)

      path.push([point.x,point.y].join(','))
    }
  )
  const pathStr = 'M' + [...path].join(' ')

  let lineWidth = maxX - minX
  let lineHeight = maxY - minY
  let lineArea = lineWidth * lineHeight

  // this is the conversion function I chose.... it works for me please dont ask me about it and I dont want to touch it ever again
  let strokeWidth =  0.02451631 + (0.0001560057 - 0.02451631)/(1 + (lineArea/0.01913676)**0.7344872)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`${minX} ${minY} ${lineWidth} ${lineHeight}`}
    >
      <path
        style={
          {
            'strokeWidth': strokeWidth,
            'fill': 'none'
          }
        }
        d={pathStr}
        fill="currentColor">
      </path>
    </svg>
  )
}