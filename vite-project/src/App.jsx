import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);

  const filteredUsers = users.filter(function (user) {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });

  async function fetchUsers() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function addUser(event) {
    event.preventDefault();

    const newUser = {
      name: name,
      email: email,
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="app">
      <h1>API Fetching</h1>
      <input
        className="search"
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search users..."
      />
      <button onClick={fetchUsers} disabled={loading}>
        Refresh Users
      </button>

      <form onSubmit={addUser}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
        />

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />

        <button type="submit">Add User</button>
      </form>

      <div className="user-grid">
        {filteredUsers.map(function (user) {
          return (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              city={user.address.city}
              company={user.company.name}
            />
          );
        })}
      </div>

      {!loading && !error && filteredUsers.length === 0 && (
        <p>No users found 😭</p>
      )}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function UserCard({ name, email, city, company }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <p>{city}</p>
      <p>{company}</p>
    </div>
  );
}

export default App;
