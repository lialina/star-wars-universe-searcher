import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectPeople } from '../redux/reducers/people/selectors';

function App() {
  const people = useSelector(selectPeople);
  const dispatch = useDispatch();
 
  return (
    <>
      <h1>
        Star Wars People
      </h1>
      {people.loading ? (
        <div>Loading...</div>
        ) : (
        <table border={1} width="100%" cellPadding={2} cellSpacing={0}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth year</th>
              <th>Eye color</th>
              <th>Gender</th>
              <th>Hair color</th>
              <th>Height</th>
            </tr>
            </thead>
            <tbody>
              {people?.data?.results.map(character => {
                return (
                  <tr key={character.name}>
                    <td>{character.name}</td>
                    <td>{character.birth_year}</td>
                    <td>{character.eye_color}</td>
                    <td>{character.gender}</td>
                    <td>{character.hair_color}</td>
                    <td>{character.height}</td>
                  </tr>
                )
              })}
            </tbody>
        </table>
      )}
    </>
  );
}

export default App;
