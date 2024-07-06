const Filter = ({value, OnChange}) => 
  <div>
    filter shown with 
    <input 
      value={value}
      onChange={OnChange}
    />
  </div>

export default Filter