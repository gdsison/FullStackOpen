import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const personsWithFilter = filter 
    ? persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase())) 
    : persons

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleNewPerson = (event) => {
    event.preventDefault()
    
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
    }
    
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        value={filter}
        OnChange={handleFilter}
      />

      <h3>add a number</h3>
      <PersonForm
        onSubmit={handleNewPerson}
        valueName={newName}
        onNameChange={handleNewName}
        valueNumber={newNumber}
        onNumberChange={handleNewNumber}
      />

      <h3>Numbers</h3>
      <Persons persons={personsWithFilter} />
    </div>
  )
}

export default App