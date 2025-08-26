const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const fetchWeatherData = async (city) => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  )
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.')
    } else if (response.status === 401) {
      throw new Error('API key is invalid. Please contact support.')
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.')
    }
  }
  
  return await response.json()
}