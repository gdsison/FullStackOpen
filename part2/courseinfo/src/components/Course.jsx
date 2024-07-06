const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <b>Total of {sum} exercises</b>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part 
        key={part.id}
        part={part}
      />
    )}
  </>

const Course = ({ course }) => {
  const sum = course.parts.reduce((total, part) => total + part.exercises, 0)
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total sum={sum}/>
    </div>
  )
}

export default Course