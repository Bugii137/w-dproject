import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import Forecast from './components/Forecast'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import { fetchWeatherData, fetchForecastData } from './services/weatherApi'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [isCelsius, setIsCelsius] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // Load recent searches and preferences from localStorage
    const savedSearches = localStorage.getItem('recentSearches')
    const tempUnit = localStorage.getItem('temperatureUnit')
    
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }
    
    if (tempUnit) {
      setIsCelsius(tempUnit === 'celsius')
    }

    // Get user's location if permitted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation permission denied or unavailable')
        }
      )
    }
  }, [])

  useEffect(() => {
    // Fetch weather for user's location if available
    if (userLocation && !weatherData) {
      handleGeolocationWeather(userLocation.lat, userLocation.lon)
    }
  }, [userLocation])

  const handleSearch = async (city) => {
    if (!city.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        fetchWeatherData(city, isCelsius),
        fetchForecastData(city, isCelsius)
      ])
      
      setWeatherData(currentWeather)
      setForecastData(forecast)
      
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
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleGeolocationWeather = async (lat, lon) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=${isCelsius ? 'metric' : 'imperial'}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather for your location')
      }
      
      const data = await response.json()
      setWeatherData(data)
      
      // Also fetch forecast
      const forecastResponse = await fetchForecastData(data.name, isCelsius)
      setForecastData(forecastResponse)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (weatherData) {
      handleSearch(weatherData.name)
    }
  }

  const toggleTemperatureUnit = () => {
    const newIsCelsius = !isCelsius
    setIsCelsius(newIsCelsius)
    localStorage.setItem('temperatureUnit', newIsCelsius ? 'celsius' : 'fahrenheit')
    
    // Refresh data with new units
    if (weatherData) {
      handleSearch(weatherData.name)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Dashboard</h1>
          <p className="text-gray-600">Get current weather conditions for any city</p>
        </header>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={toggleTemperatureUnit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
            >
              Switch to {isCelsius ? '°F' : '°C'}
            </button>
          </div>
          
          {weatherData && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          )}
        </div>
        
        <SearchBar 
          onSearch={handleSearch} 
          recentSearches={recentSearches}
          loading={loading}
        />
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}
        
        {weatherData && !loading && (
          <>
            <WeatherCard data={weatherData} isCelsius={isCelsius} />
            {forecastData && <Forecast data={forecastData} isCelsius={isCelsius} />}
          </>
        )}
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by OpenWeatherMap</p>
          {userLocation && <p className="mt-1">Using your current location</p>}
        </footer>
      </div>
    </div>
  )
}

export default App