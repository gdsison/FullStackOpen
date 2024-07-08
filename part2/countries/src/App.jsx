import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => {
  const [weather, setWeather] = useState()
  const languages = Object.values(country.languages)
  const lat = country.latlng[0]
  const lng = country.latlng[1]
  const apiKey = import.meta.env.VITE_API_KEY
  const WeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`

  useEffect(() => {
    axios
      .get(WeatherApiUrl)
      .then(response => {
        setWeather(response.data)
      })
  },[])

  const temperature = weather?.main?.name
  const icon = weather?.weather[0]?.icon
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  const iconDescription = weather?.weather[0]?.description
  const wind = weather?.wind?.speed
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {languages.map(language => 
          <li key={language}>
            {language}
          </li>
        )}
      </ul>
      <img 
        src={country.flags.png}
        alt={country.flags.alt}
      />
      <h2>Weather in {country.capital}</h2>
      {weather && (
        <>
          <p>temperature {temperature} C</p>
          <img 
            src={iconUrl}
            alt={iconDescription}
          />
          <p>wind {wind} m/s</p>
        </>
      )}
      
    </div>
  )
}

const CountryList = ({countries, handleShowCountry}) => 
  <div>
    {countries.map(c => 
      <p key={c.name.common}>
        {c.name.common} 
        <button onClick={() => handleShowCountry(c.name.common)}>
          show
        </button>
      </p>
    )}
  </div>

const Countries = ({countries, handleShowCountry}) => {
  if (countries.length === 0) {
    return (
      <div><p>zero matches</p></div>
    )
  } else if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    ) 
  } else if (countries.length < 10 ) {
    return (
      <CountryList 
        countries={countries} 
        handleShowCountry={handleShowCountry}  
      />
    )
  }
  
  return (
    <div><p>Too many matches, specify another matches</p></div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')

  const countriesFiltered = countries.filter(c => c.name.common.toUpperCase().includes(countrySearch.toUpperCase()))
  const countriesApiUrl = `https://studies.cs.helsinki.fi/restcountries/api/all`

  useEffect(() => {
    axios
      .get(countriesApiUrl)
      .then(response => {
        setCountries(response.data)
      })
  },[])

  const handleShowCountry = (countryName) => {
    setCountrySearch(countryName)
  } 

  return (
    <div>
      find countries <input value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}/>
      <Countries 
        countries={countriesFiltered}
        handleShowCountry={handleShowCountry}
      />
    </div>
  )
}

export default App