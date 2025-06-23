import LoadingSpinner from "../common/LoadingSpinner";
import { useState, useEffect } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const MapContainer = () => {
 
    const { map, loading, error, mapCallbackRef } = useGoogleMaps()


    if(loading){
        return (
            <LoadingSpinner size='lg'/>
        )
    }

    if(error) {
      return (
      <div className="text-red-500">Error: {error}</div>
      )
    }

    

   return (
    <div className="w-full h-full relative"> 
    <div 
    ref={mapCallbackRef}
    className="w-full h-full"
    style={{minHeight: '400px'}}
    />
    </div>
  )
}

export default MapContainer;
