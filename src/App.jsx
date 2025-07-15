import { useState } from 'react'
import { useAuth } from './hooks/useAuth'  // You'll need to create this hook
import Auth from './pages/Auth'
import MapContainer from './components/map/MapContainer'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <main className="flex-1 flex">
      <div className="flex-1">
        <MapContainer />
      </div>
    </main>
  )
}

export default App