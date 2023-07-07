import {useState,useEffect } from 'react'
import './App.css';
import Axios from 'axios'


function App() {
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  useEffect(()=>{
    Axios.get('http://localhost:3001/showpasswords').then((response)=>{
      setPasswordList(response.data)
    })
  },[])

  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      website: website,
    }).then(()=>{
      setPasswordList([...passwordList, {website:website,password:password}])
    })
  };

const decryptPassword=(encryption)=>{
  Axios.post("http://localhost:3001/decryptPassword",{password:encryption.password,iv:encryption.iv}).then((response)=>{
    setPasswordList(passwordList.map((val)=>{
      return val.id == encryption.id ? {id:val.id,password:val.password,website:response.data,iv:val.iv} : val
    }))
  })
}

  return (
    <div className="App">
      <div className="addpass">
        <input type="text" placeholder="Ex. password123" onChange={(event) => {
            setPassword(event.target.value);
          }}/>
        <input type="text" placeholder="Ex. Facebook" onChange={(event) => {
            setWebsite(event.target.value);
          }}/>
        <button onClick={addPassword}> Add Password</button>
      </div>

      <div className='password'>
        {passwordList.map((val,key)=>{
          return(
            <div className='mypassword' onClick={()=>{
              {decryptPassword({password:val.password,iv:val.iv,id:val.id})}
            }}
            key={key}>
              <h3>{val.website}</h3>
            </div>
            ) 
          })}
        </div>
      </div>
    );
}
export default App;
