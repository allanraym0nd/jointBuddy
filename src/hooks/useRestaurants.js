import { useState, useEffect,useCallback } from 'react'

const GOOGLE_PLACES_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'


export const useRestaurants = (userLocation, searchQuery = '', filters={}) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [hasMoreResults, setHasMoreResults] = useState(false)

  // create a cache using JavaScript Map to store API responses
  const [cache,setCache] = useState(new Map())


  const handleAPIresponses = async (response) => {
      if(!response.ok){
        throw new Error (`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if(data.status === 'REQUEST_DENIED'){
        throw new Error ('API Key invalid or Places API not enabled')
      }
      if(data.status === 'OVER_QUERY_LIMIT'){
        throw new Error ('API quota exceeded. Please try again later')
      }
      if(data.status !== 'OK' && data.status !=='ZERO_RESULTS'){
        throw new Error (`Google Places API Error: ${data.status}`)
      }
      return data
  }

 // calculates distance between two points
   const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959 
    // converts the differences in latitude and longitude from degrees to radians.
    const dLat = (lat2 - lat1) * Math.PI / 180 
    const dLng = (lng2 - lng1) * Math.PI / 180
    // intermediate value
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2) 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
    const distance = R * c // gives us distance btn the 2 cordinates
    return Math.round(distance * 10) / 10 // Round to 1 decimal
  }
 
   const handleRestaurantPhotoUrl = (photoReference) => {
    if(!photoReference) return `https://picsum.photos/400/300?random=${Math.random()}`

    return `${PLACES_BASE_URL}/photo?photoreference=${photoReference}&maxwidth=${maxWidth}&key=${GOOGLE_PLACES_API_KEY}`
   }

   const transformRestaurantData = (place, userLat, userLng) => { 
    const cuisine = getCuisineFromTypes(place.cuisine)
      const distance = (
         userLat,
         userLng,
         place.geometry.location.lat,
         place.geomeetry.location.lng)

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

    const getCuisineFromTypes = (types) => {
      const cuisineMap = { 

            'chinese_restaurant': 'Chinese',
            'italian_restaurant': 'Italian',
            'japanese_restaurant': 'Japanese',

      }

     for (const type of types) {
        if(cuisineMap[type]) {
          return cuisineMap[type]
        }
      }

      return 'Restaurant'

    }

    const loadRestaurants = useCallback(async (location, query = '')=> {
      if(!location) return

      const cacheKey = `${location.lat},${location.lng}-${query}`

      // checking if cache has anything
      if(cache.has(cacheKey)){
        const cachedData = cache.get(cacheKey)
        const now  = Date.now()
      }

      if(now - cachedData.timestamp < 5 * 60 * 100) {
        setRestaurants(cachedData.restaurants)
        setNextPageToken(cachedData.nextPageToken)
        setHasMoreResults(!!cachedData.nextPageToken)

        return 
      }

      setLoading(true)
      setError(null)

      let url 
      const params = new URLSearchParams({key:GOOGLE_PLACES_API_KEY})

      if(query.trim()){

        url = `${PLACES_BASE_URL}/textsearch/json`
        params.append('query', `${query} restaurant`)
        params.append('location',`${location.lat},${location.lng}`)
        params.append('radius', '5000')

      } else {
          params.append('location', `${location.lat},${location.lng}`)
          params.append('radius', filters.radius || '2000')
          params.append('type', 'restaurant')
      }

      const response = await fetch(`${url}?${params}`)
      const data = await handleAPIresponses(response)


    })



  

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

  // Function to generate random coordinates near user location
  const generateNearbyCoordinates = (centerLat, centerLng, radiusInMiles = 1) => {
    // Convert miles to degrees (rough approximation)
    const radiusInDegrees = radiusInMiles / 69 // 1 degree ≈ 69 miles
    
    // Generate random angle and distance
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * radiusInDegrees
    
    // Calculate new coordinates
    const lat = centerLat + (distance * Math.cos(angle))
    const lng = centerLng + (distance * Math.sin(angle))
    
    return { lat, lng }
  }


  
  const generateMockRestaurants = (userLat, userLng) => {
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
        isOpen: Math.random() > 0.2, // 80% chance of being open
        photoUrl: `https://picsum.photos/400/300?random=${index + 1}` // Random food photos
      }
    })
  }

  // Simulate API call
  useEffect(() => {
    if (!userLocation) {
      setRestaurants([])
      return
    }

    setLoading(true)
    setError(null)

    setTimeout(() => {
      try {
        const mockRestaurants = generateMockRestaurants(
          userLocation.lat, 
          userLocation.lng
        )
        
        const sortedRestaurants = mockRestaurants.sort((a, b) => a.distance - b.distance)
        
        setRestaurants(sortedRestaurants)
        setLoading(false)
        console.log('🍽️ Generated mock restaurants:', sortedRestaurants.length)
      } catch (err) {
        setError('Failed to load restaurants')
        setLoading(false)
      }
    }, 1000) // 1 second delay 

  }, [userLocation])

  return {
    restaurants,
    loading,
    error
  }
}