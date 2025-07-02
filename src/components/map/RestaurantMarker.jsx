import { useEffect } from "react"

 const RestaurantMarker = (map,restaurant, onMarkerClick) => {


useEffect(() => {
    if(!map || !restaurant) return 


        const marker = new window.google.maps.Marker({
            position:restaurant.coordinates,
            map:map,
            title:restaurant.name,
            icon:getMarkerIcon, 
            restaurantId: restaurant.id
        })

        marker.addListener('Click', () => { 
            onMarkerClick(restaurant)
        })

        return () => {
            marker.setMap(null)
        }

}, [])


     const getMarkerIcon = (rating) => {

        const baseIcon = {
            scaledSize: new window.google.maps.Size(30,30),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(15,30)

        }

        let color = 'red'
        if(rating >= 4.5 ) color = 'green'
        else if(rating >= 4.0) color = 'yellow'
        else if(rating >= 3.0) color = 'orange'
        

        return {
            ...baseIcon,
            url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
        }
    }


 
}

export default RestaurantMarker;