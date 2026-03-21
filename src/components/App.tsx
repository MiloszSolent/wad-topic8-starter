import { json } from "express";
import { useEffect, useState } from "react";

export default function App() {
    var [usernameState, setUsername] = useState<String | null>(null);

    useEffect(()=> {
        fetch('/login', {method: 'GET'})
            .then(response => response.json())
            .then(json => setUsername(json.username));
    }, []);

    return <div>
        <h1>Welcome to the HitTastic! App!</h1>
        <input id="username"></input>
        <input id="password"></input>
        <button onClick={async()=> login()}>Login</button>
        <p>Logged in as: {usernameState} <button onClick={async()=> logout()}>Logout</button></p>
    </div>;

    async function login() {
        const user = (document.getElementById("username") as HTMLInputElement).value;
        const pass = (document.getElementById("password") as HTMLInputElement).value;

        const login = await fetch("http://localhost:3000/login", {method: 'POST', headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                "username": user,
                "password": pass
            })}
        )

        if (login.status == 200) {
            const loginJson = await login.json();
            setUsername(loginJson.username);
        }
        else {
            alert("User incorrect");
        }
    }

    async function logout() {
        const res = await (await fetch('/logout', {method: 'POST', headers: {'Content-Type' : 'application/json'}})).json();

        if (res.loggedout == true) {
            setUsername(null);
        }
    }
}