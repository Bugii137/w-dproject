import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import { fetchWeatherData } from './services/weatherApi'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
  }, [])

  const handleSearch = async (city) => {
    if (!city.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const data = await fetchWeatherData(city)
      setWeatherData(data)
      
      // Update recent searches
      const updatedSearches = [
        city,
        ...recentSearches.filter(item => item !== city).slice(0, 4)
      ]
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    } catch (err) {
      setError(err.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Dashboard</h1>
          <p className="text-gray-600">Get current weather conditions for any city</p>
        </header>
        
        <SearchBar 
          onSearch={handleSearch} 
          recentSearches={recentSearches}
          loading={loading}
        />
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {weatherData && !loading && <WeatherCard data={weatherData} />}
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  )
}

export default App