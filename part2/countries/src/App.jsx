import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({countries, handleShowCountry}) => {
  if (countries.length === 0) {
    return (
      <div>
        <p>zero matches</p>
      </div>
    )
  } else if (countries.length === 1) {
    const country = countries[0]
    const languages = Object.values(country.languages)
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
      </div>
    )
  } else if (countries.length < 10 ) {
    return (
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
    )
  }
  
  return (
    <p>Too many matches, specify another matches</p>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')

  const countriesFiltered = countries.filter(c => c.name.common.toUpperCase().includes(countrySearch.toUpperCase()))

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
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
      <Country 
        countries={countriesFiltered}
        handleShowCountry={handleShowCountry}
      />
    </div>
  )
}

export default App