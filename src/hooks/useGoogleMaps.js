// src/hooks/useGoogleMaps.js
import { useState, useEffect, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export const useGoogleMaps = (userLocation, options = {}) => {
  const [map, setMap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapContainer, setMapContainer] = useState(null)

  const mapCenter = userLocation || {lat: 47.6062, lng: -122.3321}

  const defaultOptions = {
    center: mapCenter,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    ...options
  }

  const mapCallbackRef = useCallback((element) => {
    if (element) {
      setMapContainer(element)
    }
  }, [])

  useEffect(() => {
    if (!mapContainer) return

    const initializeMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          throw new Error('Google Maps API key not found')
        }

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
        })

        // Fallback timeout
        setTimeout(() => {
          if (loading) {
            setMap(mapInstance)
            setLoading(false)
          }
        }, 5000)

      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    initializeMap()
  }, [mapContainer, loading, userLocation])

  return { map, loading, error, mapCallbackRef }
}