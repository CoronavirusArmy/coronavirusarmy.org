import React, { useState } from 'react';
import Router from 'next/router';
import Link from "next/link";
import { connect } from 'react-redux';
import { Row, Col, FormGroup, Label, Input, Button, FormText, Alert, Spinner, Form } from 'reactstrap';

import { hasError } from "../helpers/utils";
import { AuthService } from "../services/Auth";
import { updateCookieUser, updateCookieToken } from "../helpers/Services";
import authConstants from "../constants/Authentication";

const SignUp = ({dispatch}) => {

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNameChange = e => setName(e.target.value);
    const handleEmailChange = e => setEmail(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);
    const handleConfirmPasswordChange = e => setConfirmPassword(e.target.value);

    const submit = e => {
        e.preventDefault();
        if(!processing) {
            setMessage(null);
            setProcessing(true);
            setErrors(null);
            AuthService.signup(name, email, password, confirmPassword)
                .then(res => {
                    return AuthService.login(email, password)
                })
                .then(res => {
                    updateCookieUser(res.user);
                    updateCookieToken({authToken: res.token, refreshToken: res.refreshToken});
                    dispatch({ type: authConstants.LOGIN_SUCCESS, user: res.user, token: res.token });
                    Router.push("/account");
                })
                .catch(err => {
                    const error = err.message ? err.message : err;
                    if(typeof error === "string")
                        setMessage(error);
                    else
                        setErrors(error);
                    setProcessing(false);
                })
        }
    }

    return (
        <Row className="mt-5">
            <Col sm="12" lg="3"></Col>
            <Col sm="12" lg="6">
                {message && <Alert color="success">{message}</Alert>}
                <Form onSubmit={submit}>
                    <FormGroup>
                        <Label>Name</Label>
                        <Input invalid={hasError(errors, 'name') !== false} type="text" value={name} onChange={handleNameChange} name="name" bsSize="lg" />
                        {hasError(errors, 'name') && <FormText color="danger">{hasError(errors, 'name')}</FormText>}
                    </FormGroup>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input invalid={hasError(errors, 'email') !== false} type="email" value={email} onChange={handleEmailChange} name="email" bsSize="lg" />
                        {hasError(errors, 'email') && <FormText color="danger">{hasError(errors, 'email')}</FormText>}
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <Label>Password</Label>
                        <Input invalid={hasError(errors, 'password') !== false} type="password" value={password} onChange={handlePasswordChange} name="password" bsSize="lg"/>
                        {hasError(errors, 'password') && <FormText color="danger">{hasError(errors, 'password')}</FormText>}
                    </FormGroup>
                    <FormGroup className="mb-4">
                        <Label>Confirm Password</Label>
                        <Input invalid={hasError(errors, 'confirmPassword') !== false} type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} name="confirmPassword" bsSize="lg"/>
                        {hasError(errors, 'confirmPassword') && <FormText color="danger">{hasError(errors, 'confirmPassword')}</FormText>}
                    </FormGroup>
                    <FormGroup className="mb-4 d-flex align-items-center justify-content-between">
                        <div>Already have an account? <Link href="/login"><a>Log In</a></Link></div>
                        <Button type="submit" disabled={processing} onClick={submit} className="btn-default">{processing && <Spinner size="sm"/>} Sign Up</Button>
                    </FormGroup>
                </Form>
            </Col>
            <Col sm="12" lg="3"></Col>
        </Row>
    )

}

export default connect()(SignUp);