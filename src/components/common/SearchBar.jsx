import { useState } from "react";
import { X,Search } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for...', searchQuery)
  }

  const handleClearSearch = () =>{
       setSearchQuery('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <div className="flex-1 max-w-lg mx-8">  {/* ✅ Simplified - removed flex-1 and mx-8 */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-red-500 focus:outline-none transition-colors"
            placeholder="search restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
              {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchBar;