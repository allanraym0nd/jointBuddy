
import { RestaurantMarker } from "./RestaurantMarker";

const RestaurantMarkers = ({restaurants, map, onRestaurantClick}) => {

    return (
        <>
     {restaurants.map((restaurant)=> {
        <RestaurantMarker 
        onMarkerClick = {onRestaurantClick}
        restaurant = {restaurant}
        key = {restaurant.id}
        map={map}
        />
     })}
     </>
    )
}