const PersonForm = ({onSubmit, valueName, onNameChange, valueNumber, onNumberChange}) => 
  <form onSubmit={onSubmit}>
    <div>
      name:
      <input
        value={valueName}
        onChange={onNameChange}
      />
    </div>
    <div>
      number:
      <input
        value={valueNumber}
        onChange={onNumberChange}
      />
    </div>
    <button type='submit'>add</button>
  </form>

  export default PersonForm
