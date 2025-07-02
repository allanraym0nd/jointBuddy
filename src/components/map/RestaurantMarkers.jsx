import RestaurantMarker from "./RestaurantMarker";  // ← Fixed import

const RestaurantMarkers = ({restaurants, map, onRestaurantClick}) => {
    return (
        <>
         {restaurants.map((restaurant) => (  
            <RestaurantMarker 
                onMarkerClick={onRestaurantClick}
                restaurant={restaurant}
                key={restaurant.id}
                map={map}
            />
         ))}
         </>
    )
}

export default RestaurantMarkers;