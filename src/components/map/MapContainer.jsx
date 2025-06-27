import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { useLocation } from "../../hooks/useLocation";

const MapContainer = () => {
  const {location, loading: locationLoading , error: locationError,getCurrentLocation} = useLocation()
  const { map, loading:mapLoading, error:mapError, mapCallbackRef } = useGoogleMaps(location)

  // center the map where the user is

  useEffect(()=> {
    if(map && location){
      map.panTo(location);
    }

  },[map, location])

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p>Error loading map: {error}</p>
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
    <div className="w-full h-full relative"> 
      {mapLoading || locationLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <LoadingSpinner size='lg'/>
        </div>
      )}
      <div 
        ref={mapCallbackRef}
        className="w-full h-full"
        style={{minHeight: '400px'}}
      />

      {locationError && (
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
      )}
    </div>
  )
}

export default MapContainer;