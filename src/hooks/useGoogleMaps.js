// src/hooks/useGoogleMaps.js
import { useState, useEffect, useCallback } from 'react'
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

  const mapCallbackRef = useCallback((element) => {
    console.log('🔍 mapCallbackRef called with:', element)
    if (element) {
      console.log('📍 Map container element received, setting mapContainer')
      setMapContainer(element)
    } else {
      console.log('❌ Element is null/undefined')
    }
  }, [])

  useEffect(() => {
    console.log('🎯 useEffect triggered, mapContainer:', mapContainer)
    if (!mapContainer) {
      console.log('⚠️ No mapContainer, returning early')
      return
    }

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
        console.log('✅ Google Maps API loaded')
        
        const mapInstance = new google.maps.Map(mapContainer, defaultOptions)
        console.log('🗺️ Map instance created')

        // Wait for map to be ready
        google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
          console.log('🎯 Map is idle and ready')
          setMap(mapInstance)
          setLoading(false)
        })

        // Fallback timeout in case 'idle' event doesn't fire
        setTimeout(() => {
          if (loading) {
            console.log('⏰ Timeout reached, setting map anyway')
            setMap(mapInstance)
            setLoading(false)
          }
        }, 5000)

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
        try {
          window.google?.maps?.event?.clearInstanceListeners(map)
        } catch (e) {
          console.warn('Cleanup warning:', e)
        }
      }
    }
  }, [mapContainer]) // Keep dependency on mapContainer

  return { map, loading, error, mapCallbackRef }
}