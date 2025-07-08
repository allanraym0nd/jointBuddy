import { useEffect } from "react"

const RestaurantMarker = ({ map, restaurant, onMarkerClick }) => {
  
  const getMarkerIcon = (rating) => {
    const baseIcon = {
      scaledSize: new window.google.maps.Size(30, 30),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(15, 30)
    }

    let color = 'red'
    if (rating >= 4.5) color = 'green'
    else if (rating >= 4.0) color = 'yellow'
    else if (rating >= 3.0) color = 'orange'

    return {
      ...baseIcon,
      url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    }
  }

  useEffect(() => {
    if (!map || !restaurant) return

    console.log('Creating marker for:', restaurant.name, 'with rating:', restaurant.rating) 
    
    const marker = new window.google.maps.Marker({
      position: restaurant.coordinates,
      map: map,
      title: restaurant.name,
      icon: getMarkerIcon(restaurant.rating), // ← Actually call the function
      restaurantId: restaurant.id
    })

     console.log('Marker created with icon:', getMarkerIcon(restaurant.rating))

    marker.addListener('click', () => { // ← Fix typo
      onMarkerClick(restaurant)
    })

    return () => {
      marker.setMap(null)
    }
  }, [map, restaurant, onMarkerClick])

  return null // React components must return something
}

export default RestaurantMarker;