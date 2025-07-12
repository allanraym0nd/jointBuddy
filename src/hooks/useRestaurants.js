import { useState, useEffect,useCallback } from 'react'

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

export const useRestaurants = (userLocation, searchQuery = '', filters = {}) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [hasMoreResults, setHasMoreResults] = useState(false)

  // Cache to avoid repeated API calls
  const [cache, setCache] = useState(new Map())

  // Helper function to handle API responses
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (data.status === 'REQUEST_DENIED') {
      throw new Error('API Key invalid or Places API not enabled')
    }
    
    if (data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('API quota exceeded. Please try again later.')
    }
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API Error: ${data.status}`)
    }
    
    return data
  }

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

  // Get restaurant photo URL
  const getRestaurantPhotoUrl = (photoReference, maxWidth = 400) => {
    if (!photoReference) return `https://picsum.photos/400/300?random=${Math.random()}`
    
    return `${PLACES_BASE_URL}/photo?photoreference=${photoReference}&maxwidth=${maxWidth}&key=${GOOGLE_PLACES_API_KEY}`
  }

  // Transform Google Places data to match your existing format
  const transformRestaurantData = (place, userLat, userLng) => {
    const cuisine = getCuisineFromTypes(place.types)
    const distance = calculateDistance(
      userLat, 
      userLng, 
      place.geometry.location.lat, 
      place.geometry.location.lng
    )

    return {
      id: place.place_id,
      name: place.name,
      cuisine: cuisine,
      rating: place.rating || 0,
      priceLevel: place.price_level || 1,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      distance: distance,
      address: place.formatted_address || place.vicinity,
      phone: place.formatted_phone_number || 'Not available',
      isOpen: place.opening_hours ? place.opening_hours.open_now : true,
      photoUrl: place.photos ? getRestaurantPhotoUrl(place.photos[0].photo_reference) : `https://picsum.photos/400/300?random=${Math.random()}`,
      // Additional real data
      website: place.website || null,
      reviews: place.reviews || [],
      openingHours: place.opening_hours ? place.opening_hours.weekday_text : null
    }
  }

  // Helper function to determine cuisine type from Google Places types
  const getCuisineFromTypes = (types) => {
    const cuisineMap = {
      'chinese_restaurant': 'Chinese',
      'italian_restaurant': 'Italian',
      'japanese_restaurant': 'Japanese',
      'indian_restaurant': 'Indian',
      'mexican_restaurant': 'Mexican',
      'thai_restaurant': 'Thai',
      'french_restaurant': 'French',
      'american_restaurant': 'American',
      'pizza_restaurant': 'Pizza',
      'seafood_restaurant': 'Seafood',
      'steakhouse': 'Steakhouse',
      'fast_food_restaurant': 'Fast Food',
      'cafe': 'Cafe',
      'bakery': 'Bakery'
    }
    
    for (const type of types) {
      if (cuisineMap[type]) {
        return cuisineMap[type]
      }
    }
    
    return 'Restaurant'
  }

  // Main function to load restaurants
  const loadRestaurants = useCallback(async (location, query = '') => {
    if (!location) return

    // Create cache key
    const cacheKey = `${location.lat},${location.lng}-${query}`
    
    // Check cache first (for 5 minutes)
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey)
      const now = Date.now()
      
      // Use cached data if less than 5 minutes old
      if (now - cachedData.timestamp < 5 * 60 * 1000) {
        setRestaurants(cachedData.restaurants)
        setNextPageToken(cachedData.nextPageToken)
        setHasMoreResults(!!cachedData.nextPageToken)
        return
      }
    }

    setLoading(true)
    setError(null)

    try {
      let url
      const params = new URLSearchParams({
        key: GOOGLE_PLACES_API_KEY
      })

      if (query.trim()) {
        // Text search for specific restaurant/cuisine
        url = `${PLACES_BASE_URL}/textsearch/json`
        params.append('query', `${query} restaurant`)
        params.append('location', `${location.lat},${location.lng}`)
        params.append('radius', '5000') // 5km radius
      } else {
        // Nearby search for restaurants
        url = `${PLACES_BASE_URL}/nearbysearch/json`
        params.append('location', `${location.lat},${location.lng}`)
        params.append('radius', filters.radius || '2000') // 2km default
        params.append('type', 'restaurant')
      }

      const response = await fetch(`${url}?${params}`)
      const data = await handleApiResponse(response)

      if (data.results && data.results.length > 0) {
        const transformedRestaurants = data.results.map(place => 
          transformRestaurantData(place, location.lat, location.lng)
        )

        // Sort by distance (like your original code)
        const sortedRestaurants = transformedRestaurants.sort((a, b) => a.distance - b.distance)

        setRestaurants(sortedRestaurants)
        setNextPageToken(data.next_page_token)
        setHasMoreResults(!!data.next_page_token)

        // Cache the results
        setCache(prev => new Map(prev.set(cacheKey, {
          restaurants: sortedRestaurants,
          nextPageToken: data.next_page_token,
          timestamp: Date.now()
        })))

        console.log('🍽️ Loaded real restaurants:', sortedRestaurants.length)
      } else {
        setRestaurants([])
        setNextPageToken(null)
        setHasMoreResults(false)
        console.log('🍽️ No restaurants found')
      }

    } catch (err) {
      console.error('Error loading restaurants:', err)
      setError(err.message || 'Failed to load restaurants')
      
      // Fallback to mock data on error (optional)
      if (process.env.NODE_ENV === 'development') {
        console.log('🍽️ Falling back to mock data...')
        const mockRestaurants = generateMockRestaurants(location.lat, location.lng)
        setRestaurants(mockRestaurants)
      }
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

  // Function to load more results (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMoreResults || loading || !nextPageToken) return

    setLoading(true)
    try {
      // Google requires a short delay before using next_page_token
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const response = await fetch(
        `${PLACES_BASE_URL}/nearbysearch/json?pagetoken=${nextPageToken}&key=${GOOGLE_PLACES_API_KEY}`
      )
      
      const data = await handleApiResponse(response)
      
      if (data.results && data.results.length > 0) {
        const newRestaurants = data.results.map(place => 
          transformRestaurantData(place, userLocation.lat, userLocation.lng)
        )

        setRestaurants(prev => [...prev, ...newRestaurants])
        setNextPageToken(data.next_page_token)
        setHasMoreResults(!!data.next_page_token)
      }
    } catch (err) {
      setError('Failed to load more restaurants')
    } finally {
      setLoading(false)
    }
  }, [hasMoreResults, loading, nextPageToken, userLocation])

  return {
    restaurants,
    loading,
    error,
    hasMoreResults,
    loadMore,
    reload: () => loadRestaurants(userLocation, searchQuery)
  }
}