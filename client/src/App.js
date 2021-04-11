import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState(0);
  const [listOfFriends, setListOfFriends] = useState([]);

  const addFriend = () => {
    Axios.post("https://mernstack-deployment.herokuapp.com/addfriend", {
      name: name,
      contact: contact,
    }).then((response) => {
      setListOfFriends([
        ...listOfFriends,
        { _id: response.data._id, name: name, contact: contact },
      ]);
    });
  };

  const updateFriend = (id) => {
    const newContact = prompt("Enter new contact: ");

    Axios.put("https://mernstack-deployment.herokuapp.com/update", {
      newContact: newContact,
      id: id,
    }).then(() => {
      setListOfFriends(
        listOfFriends.map((val) => {
          return val._id == id ? { _id: id, name: val.name, contact: newContact } : val;
        })
      );
    });
  };

  const deleteFriend = (id) => {
    Axios.delete(`https://mernstack-deployment.herokuapp.com/delete/${id}`).then(
      () => {
        setListOfFriends(
          listOfFriends.filter((val) => {
            return val._id != id;
          })
        );
      }
    );
  };

  useEffect(() => {
    Axios.get("https://mernstack-deployment.herokuapp.com/read")
      .then((response) => {
        setListOfFriends(response.data);
      })
      .catch(() => {
        console.log("ERR");
      });
  }, []);

  return (
    <div className="App">
      <div className="inputs">
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Contact..."
          onChange={(event) => {
            setContact(event.target.value);
          }}
        />

        <button onClick={addFriend}>Add Contact</button>
      </div>

      <div className="listOfFriends">
        {listOfFriends.map((val) => {
          return (
            <div className="friendContainer">
              <div className="friend">
                <h3>Name: {val.name}</h3>
                <h3> Contact: {val.contact}</h3>
              </div>
              <button
                onClick={() => {
                  updateFriend(val._id);
                }}
              >
                Update
              </button>
              <button
                id="removeBtn"
                onClick={() => {
                  deleteFriend(val._id);
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
