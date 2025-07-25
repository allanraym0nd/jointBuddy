import LoadingSpinner from "../common/LoadingSpinner";
import { MapPin } from 'lucide-react'
import { useEffect, useState } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { useLocation } from "../../hooks/useLocation";
import { useRestaurants } from "../../hooks/useRestaurants";
import { LocationButton } from "./LocationButton";
import RestaurantMarkers from "./RestaurantMarkers";
import RestaurantSidebar from "../sidebar/RestaurantSidebar";
import SearchBar from "../common/SearchBar";
import RestaurantDetailsModal from "../restaurants/RestaurantDetailsModal";
import FilterBar from "../filters/FilterBar";

const MapContainer = () => { 


const [selectedRestaurantId, setSelectedRestaurantId] = useState(null)
 const [searchQuery, setSearchQuery] = useState('')
 const [selectedRestaurant, setSelectedRestaurant] = useState(null)
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [filters,setFilters] =useState ({
        cuisine:'all',
        priceLevel: 'all',
        rating:0,
        maxDistance:5
 })


 const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation()
 const { map, loading: mapLoading, error: mapError, mapCallbackRef } = useGoogleMaps(location)
 
 const {
   restaurants,
   loading: restaurantsLoading,
   error: restaurantsError
 } = useRestaurants(location)



  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = !searchQuery || searchQuery === '' || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    
        const matchesCuisine = filters.cuisine === 'all' || restaurant.cuisine === filters.cuisine
        const matchesRating = restaurant.rating >= filters.rating
        const matchesPrice = filters.priceLevel === 'all' || restaurant.priceLevel <= filters.priceLevel
        const matchesDistance = restaurant.distance <= filters.maxDistance
  
    return matchesSearch && matchesCuisine && matchesRating && matchesPrice && matchesDistance
  })

 // center the map where the user is
useEffect(() => {
  if (map && location) {
    map.panTo(location);

    const timeout = setTimeout(() => {
      map.setZoom(16);
    }, 500);
    return () => clearTimeout(timeout);
  }
}, [map, location]);

 const onRestaurantClick = (restaurant) => {
   console.log('Clicked Restaurant!', restaurant.name)
   setSelectedRestaurantId(restaurant.id)
   setSelectedRestaurant(restaurant)
   setIsModalOpen(true)
 
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
       <div className="text-orange-500 text-center">
         <p>Error loading map: {mapError}</p>
         <button
           onClick={() => window.location.reload()}
           className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
         >
           Retry
         </button>
       </div>
     </div>
   )
 }

 return (
   <div className="flex flex-col h-screen">
     {/* Header - Fixed height */}
     <header className="bg-white px-6 py-4 shadow-lg flex items-center justify-between flex-shrink-0">
       <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
         🍔jointBuddy
       </div>
       
       <SearchBar 
         searchQuery={searchQuery}
         setSearchQuery={setSearchQuery}
       />
       
       <div className="flex items-center gap-4">
         <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
           <MapPin className="w-4 h-4" />
           Set Location
         </button>
       </div>
     </header>

     {/* Main Content - Takes remaining height */}
     <div className={`flex flex-1 transition-all duration-300 overflow-hidden ${
       isModalOpen ? 'lg:mr-[28rem]' : ''
     }`}>
       
       {/* Map section - Fixed height */}
       <div className="flex-1 relative h-full">
         {/* Filter Bar */}
         <FilterBar 
           selectedCuisine={filters.cuisine}
           onCuisineChange={(cuisine) => setFilters(prev => ({ ...prev, cuisine }))} 
         />

         {(mapLoading || locationLoading) && (
           <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
             <LoadingSpinner size='lg' />
           </div>
         )}

         {/* Map Container - FIXED HEIGHT */}
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

         {restaurantsError && (
           <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-10">
             ❌ {restaurantsError}
           </div>
         )}

         {restaurants.length > 0 && (
           <div className="absolute top-4 left-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg z-10 animate-slide-in">
             <div className="flex items-center gap-2">
               <span>🍽️</span>
               <span>Found {restaurants.length} restaurants nearby</span>
             </div>
           </div>
         )}
       </div>

       {/* Sidebar - Fixed height with scroll */}
       <div className={`w-full md:w-96 h-full overflow-y-auto transition-all duration-300 ${
         isModalOpen ? 'md:opacity-75' : 'md:opacity-100'
       }`}>
         <RestaurantSidebar
           restaurants={filteredRestaurants}
           onRestaurantClick={onRestaurantClick}
           selectedRestaurantId={selectedRestaurantId}
           map={map}
         />
       </div>
     </div>

     {/* Restaurant Details Modal */}
     <RestaurantDetailsModal  
       isOpen={isModalOpen}
       restaurant={selectedRestaurant}
       onClose={() => { 
         setIsModalOpen(false) 
         setSelectedRestaurant(null)
         setSelectedRestaurantId(null)
       }}
       map={map}
     />
   </div>
 )
}

export default MapContainer;