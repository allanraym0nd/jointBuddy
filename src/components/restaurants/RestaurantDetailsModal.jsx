// RestaurantDetailModal.jsx
import { useState, useEffect } from 'react'
import { X, Star, MapPin, Phone, Clock, DollarSign, Navigation, ChevronLeft } from 'lucide-react'

const RestaurantDetailModal = ({ restaurant, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }, [isOpen])

  const handleClose = () => {
    onClose()
  }

  if (!isOpen && !isAnimating) return null
  if (!restaurant) return null

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
    <>
      {/* Backdrop - subtle overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-20' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Side Panel - SMALLER SIZE */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-80 lg:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="font-medium">Back</span>
          </button>
          
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-full pb-20">
          {/* Header Image - SMALLER */}
          <div className="relative h-40 bg-gray-200 overflow-hidden">
            <img 
              src={restaurant.photoUrl} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Photo'
              }}
            />
            
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

          {/* Content - TIGHTER SPACING */}
          <div className="p-4">
            {/* Restaurant Name & Basic Info */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h1>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              
              {/* Rating & Price */}
              <div className="flex items-center justify-between mb-3">
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

            {/* Quick Info Cards - SMALLER */}
            <div className="space-y-3 mb-4">
              {/* Address */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Address</h4>
                  <p className="text-gray-600 text-xs">{restaurant.address}</p>
                  <p className="text-xs text-gray-500 mt-1">{restaurant.distance} miles away</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Phone</h4>
                  <p className="text-gray-600 text-xs">{restaurant.phone}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Hours</h4>
                  <p className="text-gray-600 text-xs">
                    {restaurant.isOpen ? 'Open until 10:00 PM' : 'Opens at 8:00 AM'}
                  </p>
                </div>
              </div>

              {/* Distance */}
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Distance</h4>
                  <p className="text-gray-600 text-xs">{restaurant.distance} miles</p>
                  <p className="text-xs text-gray-500 mt-1">~{Math.round(restaurant.distance * 5)} min drive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={handleDirections}
              className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </button>
            
            <button
              onClick={handleCall}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RestaurantDetailModal