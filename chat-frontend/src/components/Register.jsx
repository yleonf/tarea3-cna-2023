import React, { Fragment, useState } from "react"
import PropTypes from 'prop-types'
import serverApiUrl from "./consts"
import parseJwt from "../jwt"
import { Button, Label, TextInput } from 'flowbite-react';


async function registerUser(credentials) {
    return fetch(`${serverApiUrl}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

const Register = ({ setToken, setUserName }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('2000-01-01')

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await registerUser({
            name,
            email,
            password,
            birthday,
        });
        setToken(token);
        const user = parseJwt(token.token);
        setUserName(user.name);
    }

    return (
        <Fragment>
            <form className="flex max-w-md flex-col gap-4" action="#" onSubmit={handleSubmit}>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name"
                            value="Ingresa tu nombre"
                        />
                    </div>
                    <TextInput
                        placeholder="John Doe"
                        required=""
                        value={name} onChange={e => setName(e.target.value)}
                        type="text"
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="email"
                            value="Ingresa tu email"
                        />
                    </div>
                    <TextInput
                        placeholder="nombre@dominio.com"
                        required=""
                        value={email} onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="password"
                            value="Your password"
                        />
                    </div>
                    <TextInput
                        value={password} onChange={e => setPassword(e.target.value)}
                        required=""
                        type="password"
                    />
                </div>

                <Button type="submit">
                    Registrar
                </Button>
            </form>
        </Fragment>
    )
}


export default Register