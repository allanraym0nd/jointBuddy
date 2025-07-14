import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase' // your Supabase config

export const useRestaurants = (userLocation, searchQuery = '', filters = {}) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMoreResults, setHasMoreResults] = useState(false)

  // Cache to avoid repeated API calls
  const [cache, setCache] = useState(new Map())

  // Your existing distance calculation function (keeping it the same)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959 
    const dLat = (lat2 - lat1) * Math.PI / 180 
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2) 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    const distance = R * c
    return Math.round(distance * 10) / 10
  }

  // Transform Edge Function data to match your existing format
  const transformRestaurantData = (place, userLat, userLng) => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      place.location.lat, 
      place.location.lng
    )

    return {
      id: place.id,
      name: place.name,
      cuisine: place.cuisine,
      rating: place.rating || 0,
      priceLevel: place.priceLevel || 1,
      coordinates: {
        lat: place.location.lat,
        lng: place.location.lng
      },
      distance: distance,
      address: place.address,
      phone: place.phone || 'Not available',
      isOpen: true, // Edge function doesn't return opening hours yet
      photoUrl: place.image || `https://picsum.photos/400/300?random=${Math.random()}`,
      website: null,
      reviews: [],
      openingHours: null
    }
  }

  // Main function to load restaurants using Supabase Edge Function
  const loadRestaurants = useCallback(async (location, query = '') => {
    if (!location) return

    // Create cache key
    const cacheKey = `${location.lat},${location.lng}-${query}`
    
    // Check cache first (for 5 minutes)
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey)
      const now = Date.now()
      
      if (now - cachedData.timestamp < 5 * 60 * 1000) {
        setRestaurants(cachedData.restaurants)
        setHasMoreResults(false) // Edge function doesn't support pagination yet
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      // Call your Supabase Edge Function instead of Google directly
      const { data, error: functionError } = await supabase.functions.invoke('get-restaurants', {
        body: {
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          radius: filters.radius || '2000',
          query: query // for future text search implementation
        }
      })

      if (functionError) {
        throw new Error(functionError.message || 'Failed to fetch restaurants')
      }

      if (data && data.restaurants && data.restaurants.length > 0) {
        const transformedRestaurants = data.restaurants.map(place => 
          transformRestaurantData(place, location.lat, location.lng)
        )

        // Sort by distance (like your original code)
        const sortedRestaurants = transformedRestaurants.sort((a, b) => a.distance - b.distance)

        setRestaurants(sortedRestaurants)
        setHasMoreResults(false) // No pagination from Edge Function yet

        // Cache the results
        setCache(prev => new Map(prev.set(cacheKey, {
          restaurants: sortedRestaurants,
          timestamp: Date.now()
        })))

        console.log('🍽️ Loaded real restaurants from Edge Function:', sortedRestaurants.length)
      } else {
        setRestaurants([])
        setHasMoreResults(false)
        console.log('🍽️ No restaurants found from Edge Function')
      }

    } catch (err) {
      console.error('Error loading restaurants from Edge Function:', err)
      setError(err.message || 'Failed to load restaurants')
      
      // Fallback to mock data on error
      console.log('🍽️ Falling back to mock data...')
      const mockRestaurants = generateMockRestaurants(location.lat, location.lng)
      setRestaurants(mockRestaurants)
    } finally {
      setLoading(false)
    }
  }, [cache, filters])

  // Your existing mock data generation (keeping as fallback)
  const generateMockRestaurants = (userLat, userLng) => {
    const restaurantTypes = [
      { name: "Pizza Palace", cuisine: "Italian", rating: 4.2, priceLevel: 2 },
      { name: "Burger Barn", cuisine: "American", rating: 4.0, priceLevel: 2 },
      { name: "Sushi Spot", cuisine: "Japanese", rating: 4.5, priceLevel: 3 },
      { name: "Taco Time", cuisine: "Mexican", rating: 3.8, priceLevel: 1 },
      { name: "Coffee Corner", cuisine: "Cafe", rating: 4.3, priceLevel: 2 },
      { name: "Thai Garden", cuisine: "Thai", rating: 4.4, priceLevel: 2 },
      { name: "Steakhouse Supreme", cuisine: "Steakhouse", rating: 4.6, priceLevel: 4 },
      { name: "Vegan Vibes", cuisine: "Vegetarian", rating: 4.1, priceLevel: 2 },
      { name: "Deli Delight", cuisine: "Deli", rating: 3.9, priceLevel: 1 },
      { name: "Pasta Paradise", cuisine: "Italian", rating: 4.0, priceLevel: 2 }
    ]

    const generateNearbyCoordinates = (centerLat, centerLng, radiusInMiles = 1) => {
      const radiusInDegrees = radiusInMiles / 69 
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * radiusInDegrees
      const lat = centerLat + (distance * Math.cos(angle))
      const lng = centerLng + (distance * Math.sin(angle))
      return { lat, lng }
    }

    return restaurantTypes.map((template, index) => {
      const coordinates = generateNearbyCoordinates(userLat, userLng)
      const distance = calculateDistance(userLat, userLng, coordinates.lat, coordinates.lng)
      
      return {
        id: `restaurant_${index + 1}`,
        name: template.name,
        cuisine: template.cuisine,
        rating: template.rating,
        priceLevel: template.priceLevel,
        coordinates: coordinates,
        distance: distance,
        address: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        phone: `(206) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        isOpen: Math.random() > 0.2,
        photoUrl: `https://picsum.photos/400/300?random=${index + 1}`
      }
    })
  }

  // Load restaurants when location or search changes
  useEffect(() => {
    if (!userLocation) {
      setRestaurants([])
      return
    }

    // Add slight delay to match your original UX
    const timeoutId = setTimeout(() => {
      loadRestaurants(userLocation, searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [userLocation, searchQuery, loadRestaurants])

  return {
    restaurants,
    loading,
    error,
    hasMoreResults,
    reload: () => loadRestaurants(userLocation, searchQuery)
  }
}