// components/common/FilterBar.jsx
import React from 'react'

const FilterBar = ({ selectedCuisine, onCuisineChange }) => {
  const cuisineCategories = [
    { id: 'all', label: 'All', emoji: '' },
    { id: 'italian', label: 'Italian', emoji: '🍕' },
    { id: 'burgers', label: 'Burgers', emoji: '🍔' },
    { id: 'asian', label: 'Asian', emoji: '🍜' },
    { id: 'healthy', label: 'Healthy', emoji: '🥗' },
    { id: 'mexican', label: 'Mexican', emoji: '🌮' },
    { id: 'bbq', label: 'BBQ', emoji: '🍗' },
    { id: 'cafes', label: 'Cafes', emoji: '☕' },
    { id: 'indian', label: 'Indian', emoji: '🍛' },
    { id: 'chinese', label: 'Chinese', emoji: '🥡' },
    { id: 'japanese', label: 'Japanese', emoji: '🍱' },
    { id: 'thai', label: 'Thai', emoji: '🍲' },
    { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
    { id: 'seafood', label: 'Seafood', emoji: '🦐' },
    { id: 'desserts', label: 'Desserts', emoji: '🍰' }
  ]

  return (
    <div className="absolute top-5 left-5 right-5 bg-white p-4 rounded-xl shadow-lg z-20">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {cuisineCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onCuisineChange(category.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 whitespace-nowrap flex-shrink-0 ${
              selectedCuisine === category.id
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-red-500 hover:bg-red-50'
            }`}
          >
            {category.emoji && <span>{category.emoji}</span>}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar