const WeatherCard = ({ data, isCelsius }) => {
  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, temp_min, temp_max, pressure },
    weather,
    wind: { speed },
    dt,
    visibility
  } = data;

  const currentWeather = weather[0];
  const date = new Date(dt * 1000);
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {name}, {country}
            </h2>
            <p className="text-gray-600">
              {date.toLocaleDateString()} | {date.toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <img 
                src={iconUrl} 
                alt={currentWeather.description} 
                className="w-16 h-16"
              />
              <span className="text-4xl font-bold text-gray-800">
                {Math.round(temp)}°{isCelsius ? 'C' : 'F'}
              </span>
            </div>
            <p className="text-gray-600 capitalize">{currentWeather.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Feels Like</h3>
            <p className="text-xl font-bold text-gray-800">
              {Math.round(feels_like)}°{isCelsius ? 'C' : 'F'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Humidity</h3>
            <p className="text-xl font-bold text-gray-800">{humidity}%</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Wind Speed</h3>
            <p className="text-xl font-bold text-gray-800">
              {isCelsius ? Math.round(speed * 3.6) : Math.round(speed)} {isCelsius ? 'km/h' : 'mph'}
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Min/Max Temp</h3>
            <p className="text-xl font-bold text-gray-800">
              {Math.round(temp_min)}°{isCelsius ? 'C' : 'F'} / {Math.round(temp_max)}°{isCelsius ? 'C' : 'F'}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Pressure</h3>
            <p className="text-xl font-bold text-gray-800">{pressure} hPa</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-gray-600 font-semibold">Visibility</h3>
            <p className="text-xl font-bold text-gray-800">
              {isCelsius ? (visibility / 1000).toFixed(1) : (visibility / 1609).toFixed(1)} {isCelsius ? 'km' : 'miles'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;