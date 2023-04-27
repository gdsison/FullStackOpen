import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>

const Phonebook = ({ name, number, addPerson, handleNameChange, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>name: <input value={name} onChange={handleNameChange}/></div>
    <div>number: <input value={number} onChange={handleNumberChange}/></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({person, deletePerson}) => (
  person.map(person => 
    <div key={person.name}>
      {person.name} {person.number} <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
    </div>)
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const filteredPerson = newFilter ? persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())) : persons

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
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
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id , name) => {
    if(window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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
      <Persons person={filteredPerson} deletePerson={deletePerson} />
    </div>
  )
}

export default App