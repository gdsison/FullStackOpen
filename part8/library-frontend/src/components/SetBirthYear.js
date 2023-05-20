import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTHYEAR } from '../queries'
import Select from 'react-select'

const SetBirthYear = ({ authors }) => {
  const [name, setName] = useState(null)
  const [born, setBorn ] = useState('')

  const [ setBirthYear ] = useMutation(EDIT_BIRTHYEAR)

  const options = authors.map(author => ({value: author.name, label: author.name}))

  const submit = () => setBirthYear({variables: { name, setBornTo: Number(born)}})

  return (
    <div>
      <h3>Set birthyear</h3> 
      <form onSubmit={submit}>
        <div>
            <Select
              defaultValue={name}
              options={options}
              onChange={target => setName(target.value)}
            />
            {/* 
            <select value={name} onChange={({ target }) => setName(target.value)}>
                {options.map(option => <option key={option.value} value={option.value} label={option.label} />)}
            </select>
            */}
        </div>
        <div>
            born:
            <input 
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
        </div>
        <button>update author</button>
      </form> 
    </div>
  )
}

export default SetBirthYear