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
  </form>

  export default PersonForm
