// RestaurantDetailModal.jsx
import { useState } from 'react'
import { X, Star, MapPin, Phone, Clock, DollarSign, Navigation } from 'lucide-react'

const RestaurantDetailModal = ({ restaurant, isOpen, onClose }) => {
  if (!isOpen || !restaurant) return null

  const handleDirections = () => {
    const { lat, lng } = restaurant.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:${restaurant.phone}`, '_self')
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }
    return stars
  }

  const renderPriceLevel = (level) => {
    const dollars = []
    for (let i = 0; i < 4; i++) {
      dollars.push(
        <DollarSign 
          key={i} 
          className={`w-4 h-4 ${i < level ? 'text-green-500' : 'text-gray-300'}`}
        />
      )
    }
    return dollars
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-64 bg-gray-200 rounded-t-xl overflow-hidden">
          <img 
            src={restaurant.photoUrl} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Photo'
            }}
          />
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Restaurant Name & Basic Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
            <p className="text-lg text-gray-600 mb-3">{restaurant.cuisine}</p>
            
            {/* Rating & Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(restaurant.rating)}
                </div>
                <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                {renderPriceLevel(restaurant.priceLevel)}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Address</h4>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="text-sm text-gray-500">{restaurant.distance} miles away</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Phone</h4>
                <p className="text-gray-600">{restaurant.phone}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Hours</h4>
                <p className="text-gray-600">
                  {restaurant.isOpen ? 'Open until 10:00 PM' : 'Opens at 8:00 AM'}
                </p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-start space-x-3">
              <Navigation className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Distance</h4>
                <p className="text-gray-600">{restaurant.distance} miles</p>
                <p className="text-sm text-gray-500">~{Math.round(restaurant.distance * 5)} min drive</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleDirections}
              className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Navigation className="w-5 h-5" />
              <span>Get Directions</span>
            </button>
            
            <button
              onClick={handleCall}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Restaurant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailModal