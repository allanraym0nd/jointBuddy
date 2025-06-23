// src/hooks/useGoogleMaps.js
import { useState, useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export const useGoogleMaps = (options = {}) => {
  const [map, setMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)

  const defaultOptions = {
    center: { lat: 47.6062, lng: -122.3321 },
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    ...options
  }

  const mapCallbackRef = (element) => {
    if (element) {
      console.log('📍 Map container element received')
      setMapContainer(element)
    }
  }

  useEffect(() => {
    if (!mapContainer) return

    const initializeMap = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          throw new Error('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.')
        }

        console.log('🔄 Loading Google Maps...')

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        })

        const google = await loader.load()
        const mapInstance = new google.maps.Map(mapContainer, defaultOptions)

        google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
          setMap(mapInstance)
          setLoading(false)
          console.log('🗺️ Google Maps loaded successfully!')
        })

      } catch (err) {
        console.error('Failed to load Google Maps:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (map) {
        console.log('🧹 Cleaning up Google Maps')
        google.maps.event.clearInstanceListeners(map)
      }
    }
  }, [mapContainer])

  return { map, loading, error, mapCallbackRef }
}