import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect, useState } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { useLocation } from "../../hooks/useLocation";
import { useRestaurants } from "../../hooks/useRestaurants";
import { LocationButton } from "./LocationButton";
import RestaurantMarkers from "./RestaurantMarkers";
import RestaurantSidebar from "../sidebar/RestaurantSidebar";
import SearchBar from "../common/SearchBar";

const MapContainer = () => {
 const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation()
 const { map, loading: mapLoading, error: mapError, mapCallbackRef } = useGoogleMaps(location)
 
 const {
   restaurants,
   loading: restaurantsLoading,
   error: restaurantsError
 } = useRestaurants(location)

 const [selectedRestaurantId, setSelectedRestaurantId] = useState(null)
 const [searchQuery, setSearchQuery] = useState('')
 const [filters,setFilters] =useState ({
        cuisine:'all',
        priceLevel: 'all',
        rating:0,
        maxDistance:5
 })

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = !searchQuery || searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    
        const matchesCuisine = filters.cuisine === 'all' || restaurant.cuisine === filters.cuisine
        const matchesRating = restaurant.rating >= filters.rating
        const matchesPrice = filters.priceLevel === 'all' || restaurant.priceLevel <= filters.priceLevel
        const matchesDistance = restaurant.distance <= filters.maxDistance
  
    // ... other filter logic
    
    return matchesSearch && matchesCuisine && matchesRating && matchesPrice && matchesDistance
  })

 // center the map where the user is
 useEffect(() => {
   if (map && location) {
     map.panTo(location);
   }
 }, [map, location])

 const onRestaurantClick = (restaurant) => {
   console.log('Clicked Restaurant!', restaurant.name)
   setSelectedRestaurantId(restaurant.id)
 

 setTimeout (() => {

 const cardElement = document.getElementById(`restaurant-card-${restaurant.id}`)
 if(cardElement){
  cardElement.scrollIntoView({
    behavior:'smooth',
    block:'center'
  })
 }

}, 100)

 }

 if (mapError) {
   return (
     <div className="w-full h-full flex items-center justify-center min-h-[400px]">
       <div className="text-red-500 text-center">
         <p>Error loading map: {mapError}</p>
         <button
           onClick={() => window.location.reload()} // refresh button
           className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
         >
           Retry
         </button>
       </div>
     </div>
   )
 }

 return (
   <div className="flex h-screen">
    

     {/* Map section - Right side */}
     <div className="flex-1 relative">
       {(mapLoading || locationLoading) && (
         <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
           <LoadingSpinner size='lg' />
         </div>
       )}

       <div
         ref={mapCallbackRef}
         className="w-full h-full"
         style={{ minHeight: '400px' }}
       />

       <LocationButton
         locationLoading={locationLoading}
         locationError={locationError}
         onLocationRequest={getCurrentLocation}
       />

       {map && restaurants.length > 0 && (
         <RestaurantMarkers
           restaurants={filteredRestaurants}
           map={map}
           onRestaurantClick={onRestaurantClick}
         />
       )}

       {restaurantsLoading && (
         <div className="absolute top-4 left-4 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded z-10">
           🔄 Finding restaurants nearby...
         </div>
       )}

       {/* Restaurant Error */}
       {restaurantsError && (
         <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-10">
           ❌ {restaurantsError}
         </div>
       )}

       {/* Restaurant Count (for debugging) */}
       {restaurants.length > 0 && (
         <div className="absolute top-4 left-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded z-10">
           🍽️ Found {restaurants.length} restaurants nearby
         </div>
       )}

       {restaurants.length > 0 && console.log('🍽️ Restaurant data:', restaurants)}

       {/* {locationError && (
         <div className="absolute top-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded">
           <div className="flex justify-between items-center">
             <span>📍 {locationError}</span>
             <button
               onClick={getCurrentLocation}
               className="text-blue-600 hover:text-blue-800 text-sm"
             >
               Try Again
             </button>
           </div>
         </div>
       )} */}
     </div>

         <RestaurantSidebar
          restaurants={filteredRestaurants}
          onRestaurantClick={onRestaurantClick}
          selectedRestaurantId={selectedRestaurantId}
          map={map}
     />
   </div>
 )
}

export default MapContainer;