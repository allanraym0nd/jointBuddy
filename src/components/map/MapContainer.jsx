import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect } from "react";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const MapContainer = () => {
  const { map, loading, error, mapCallbackRef } = useGoogleMaps()

  useEffect(() => {
    console.log('🏗️ MapContainer useEffect - component state:', { map, loading, error })
  }, [map, loading, error])

  console.log('🔄 MapContainer render - loading:', loading, 'error:', error, 'map:', map)

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size='lg'/>
        <p className="mt-4 text-gray-600">Loading Google Maps...</p>
        <div 
          ref={(el) => {
            console.log('🧪 Test ref callback called with:', el)
            if (el) mapCallbackRef(el)
          }}
          className="w-full h-full"
          style={{minHeight: '400px', background: 'lightblue', opacity: 0.1}}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative"> 
      <div 
        ref={mapCallbackRef}
        className="w-full h-full"
        style={{minHeight: '401px'}}
      />
    </div>
  )
}

export default MapContainer;