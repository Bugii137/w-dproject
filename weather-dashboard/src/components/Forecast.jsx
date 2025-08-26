const Forecast = ({ data, isCelsius }) => {
  // Group forecast by day
  const dailyForecast = {};
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyForecast[date]) {
      dailyForecast[date] = {
        date: date,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        count: 1
      };
    } else {
      dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, item.main.temp_min);
      dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, item.main.temp_max);
      dailyForecast[date].count += 1;
    }
  });

  // Remove today from forecast and get next 5 days
  const today = new Date().toDateString();
  const forecastDays = Object.values(dailyForecast)
    .filter(day => day.date !== today)
    .slice(0, 5);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {forecastDays.map((day, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md text-center">
            <h3 className="font-semibold text-gray-700">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </h3>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
              alt={day.description} 
              className="mx-auto my-2"
            />
            <p className="text-gray-600 capitalize text-sm">{day.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold text-gray-800">
                {Math.round(day.maxTemp)}°{isCelsius ? 'C' : 'F'}
              </span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-600">
                {Math.round(day.minTemp)}°{isCelsius ? 'C' : 'F'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;