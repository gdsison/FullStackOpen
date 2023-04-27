import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>

const Phonebook = ({ name, number, addPerson, handleNameChange, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>name: <input value={name} onChange={handleNameChange}/></div>
    <div>number: <input value={number} onChange={handleNumberChange}/></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({person}) => person.map(person => <div key={person.name}>{person.name} {person.number}</div>)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const filteredPerson = newFilter ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())) : persons

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      axios
        .post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }
    setNewName('')
    setNewNumber('')
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} 
        handleFilterChange={handleFilterChange}
      />
      <h3>add a new</h3>
      <Phonebook addPerson={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons person={filteredPerson} />
    </div>
  )
}

export default App