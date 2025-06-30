// src/hooks/useRestaurants.js
import { useState, useEffect } from 'react'

export const useRestaurants = (userLocation) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Mock restaurant data template
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

  // Function to calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return Math.round(distance * 10) / 10 // Round to 1 decimal
  }

  // Generate mock restaurants
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

    // Simulate API delay
    setTimeout(() => {
      try {
        const mockRestaurants = generateMockRestaurants(
          userLocation.lat, 
          userLocation.lng
        )
        
        // Sort by distance (closest first)
        const sortedRestaurants = mockRestaurants.sort((a, b) => a.distance - b.distance)
        
        setRestaurants(sortedRestaurants)
        setLoading(false)
        console.log('🍽️ Generated mock restaurants:', sortedRestaurants.length)
      } catch (err) {
        setError('Failed to load restaurants')
        setLoading(false)
      }
    }, 1000) // 1 second delay to simulate API call

  }, [userLocation])

  return {
    restaurants,
    loading,
    error
  }
}