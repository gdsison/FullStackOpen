import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const Notification = ({info}) => {
  console.log(info)
  if (!info.message) return null

  const style = {
    color: info.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={style}>
      {info.message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [info, setInfo] = useState({message: null})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

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

  const handlePersonForm = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    const person = persons.find(person => person.name === personObject.name)
  
    if (person) {
      if (window.confirm(`${person.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            alert(`Phone number of ${returnedPerson.name} updated (${returnedPerson.number})`)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          alert(`Added ${returnedPerson.name}`)
        })
    }
    
    setNewName('')
    setNewNumber('')
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(deletedPerson => {
          setPersons(persons.filter(p => p.id !== deletedPerson.id))
        })
    } 
  }

  const alert = (message, info = 'info') => {
    setInfo({message, info})
    setTimeout(() => {
      setInfo({message: null})
    }, 2000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification info={info} />
      <Filter 
        value={filter}
        onChange={handleFilter}
      />

      <h3>add a number</h3>
      <PersonForm
        onSubmit={handlePersonForm}
        valueName={newName}
        onNameChange={handleNewName}
        valueNumber={newNumber}
        onNumberChange={handleNewNumber}
      />

      <h3>Numbers</h3>
      <Persons 
        persons={personsWithFilter}
        onDelete={handleDeletePerson}
      />
    </div>
  )
}

export default App