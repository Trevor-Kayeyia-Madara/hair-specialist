import { useState, useEffect } from "react";
import { getSpecialists, searchSpecialists } from "../lib/api";

const SearchSpecialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [query, setQuery] = useState({ specialty: "", location: "" });

  useEffect(() => {
    getSpecialists().then(({ data }) => setSpecialists(data));
  }, []);

  const handleSearch = async () => {
    const { data } = await searchSpecialists(query);
    setSpecialists(data);
  };

  return (
    <div>
      <input type="text" placeholder="Specialty" onChange={(e) => setQuery({ ...query, specialty: e.target.value })} />
      <input type="text" placeholder="Location" onChange={(e) => setQuery({ ...query, location: e.target.value })} />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {specialists.map((s) => (
          <li key={s.id}>{s.name} - {s.specialty} ({s.location})</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSpecialists;
