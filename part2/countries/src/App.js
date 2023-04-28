import axios from "axios";
import { useState, useEffect } from "react";

const Weather = ({ lat, lng }) => {
  const [weather, setWeather] = useState()
  const apikey = process.env.REACT_APP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apikey}`

  useEffect(() => {
    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
    })
  }, [])
  
  if (!weather) {
    return null
  }

  return (
    <>
      <div>temperature {weather.main.temp}</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
      <div>wind {weather.wind.speed}</div>
    </>
  )
}

const Countries = ({ countries, onClick }) => {
  if (countries.length < 10) {
    if (countries.length === 1) {
      return (
        <>
          <h1>{countries[0].name.common}</h1>
          <div>capital {countries[0].capital[0]}</div>
          <div>area {countries[0].area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(countries[0].languages).map(language => <li key={language}>{language}</li>)}
          </ul>
          <img src={countries[0].flags.png} alt={countries[0].flags.alt}/>
          <h3>Weather in {countries[0].capital[0]}</h3>
          <Weather lat={countries[0].capitalInfo.latlng[0]} lng={countries[0].capitalInfo.latlng[1]} />
        </>
      )
    }
    
    return (
      <>
        {countries.map(country => 
          <div key={country.name.common}>
            {country.name.common} <button onClick={() => onClick(country.name.common)}>show</button>
          </div>)}
      </>
    )
  } 

  return (
    <div>Too many matches, specify another filter</div>
  )
}


const App = () => {

  const [countries, setCountries] = useState([])
  const [find, setFind] = useState('')
  const findCountry = find ? countries.filter(country => country.name.common.toLowerCase().includes(find.toLowerCase())) : countries

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
  },[])

  const handleFind = (event) => {
    setFind(event.target.value)
  }

  return (
    <div>
      find countries <input value={find} onChange={handleFind}/>
      <Countries countries={findCountry} onClick={setFind} />
    </div> 
  )
}

export default App;
