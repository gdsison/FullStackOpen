import axios from "axios";
import { useState, useEffect } from "react";

const Countries = ({ countries }) => {
  if (countries.length < 10) {
    if (countries.length === 1) {
      return (
        <>
          <h1>{countries[0].name.common}</h1>
          <div>capital {countries[0].capital[0]}</div>
          <div>area {countries[0].area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(countries[0].languages).map(language => <li>{language}</li>)}
          </ul>
          <img src={countries[0].flags.png} alt={countries[0].flags.alt}/>
        </>
      )
    }
    
    return (
      <>
        {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
      </>
    )
  } 

  return (
    <div>over 10 countries</div>
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
      <Countries countries={findCountry} />
    </div> 
  )
}

export default App;
