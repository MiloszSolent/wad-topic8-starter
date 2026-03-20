import { useEffect, useState } from "react";

export default function App() {
    var [username, setUsername] = useState<String | null>(null);

    return <div>
        <h1>Welcome to the HitTastic! App!</h1>
        <input id="username"></input>
        <input id="password"></input>
        <button onClick={async()=> login()}>Login</button>
        <p>Logged in as: {username}</p>
    </div>;

    async function login() {
        const user = (document.getElementById("username") as HTMLInputElement).value;
        const pass = (document.getElementById("password") as HTMLInputElement).value;

        const login = await fetch("http://localhost:3000/login", {method: 'POST',
            headers: {'Content-Type': 'application-json'},
            body: JSON.stringify({username: user, password: pass})}
        )


        if (login.status == 200) {
            const loginJson = await login.json();
            setUsername(loginJson.username);
        }
        else {
            alert("User incorrect");
        }
    }
}