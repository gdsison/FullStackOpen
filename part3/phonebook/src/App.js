import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import Phonebook from './components/Phonebook'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErorrMessage] = useState()
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

    const personObject = {
      name: newName,
      number: newNumber
    }

    const findPerson = persons.find(person => person.name === newName)

    if (findPerson) {
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`))
      {
        personService
          .update(findPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== findPerson.id ? person : returnedPerson))
          })
          .catch(error => {
            setErorrMessage(error.response.data.error)
            setTimeout(() => {
              setErorrMessage()
            }, 2000)
            console.log(error.response.data.error)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErorrMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setErorrMessage()
          }, 2000)
        })
        .catch(error => {
          setErorrMessage(error.response.data.error)
          setTimeout(() => {
            setErorrMessage()
          }, 2000)
          console.log(error.response.data.error)
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
        .catch(error => {
          setErorrMessage(`Information of ${name} has already been removed from the server`)
          setTimeout(() => {
            setErorrMessage()
          }, 3000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
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