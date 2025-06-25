import LoadingSpinner from "../common/LoadingSpinner";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const MapContainer = () => {
  const { map, loading, error, mapCallbackRef } = useGoogleMaps()

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p>Error loading map: {error}</p>
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
    <div className="w-full h-full relative"> 
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <LoadingSpinner size='lg'/>
        </div>
      )}
      <div 
        ref={mapCallbackRef}
        className="w-full h-full"
        style={{minHeight: '400px'}}
      />
    </div>
  )
}

export default MapContainer;