import React, { Fragment, useState } from "react"
import PropTypes from 'prop-types'
import serverApiUrl from "./consts"
import parseJwt from "../jwt"
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Register from './Register'

async function loginUser(credentials) {
    return fetch(`${serverApiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

const Login = ({ setToken, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openModal, setOpenModal] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password
        });
        setToken(token);
        const user = parseJwt(token.token);
        setUserName(user.name);
    }

    return (
        <Fragment>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>

                        &nbsp; Chat Rooms
                    </a>
                    <form className="flex max-w-md flex-col gap-4" action="#" onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="email1"
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
                            Ingresar
                        </Button>
                        <a href="#" onClick={() => setOpenModal('default')}>Register</a>
                        <Modal show={openModal === 'default'} onClose={() => setOpenModal(undefined)}>
                            <Modal.Header>Register User</Modal.Header>
                            <Modal.Body>
                                <Register setToken={setToken} setUserName={setUserName} />
                            </Modal.Body>

                        </Modal>
                    </form>
                </div>
            </section>
        </Fragment >
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Login