import React, { useState } from 'react';
import Router from 'next/router';
import Link from "next/link";
import { connect } from "react-redux";
import { Row, Col, FormGroup, Label, Input, Button, FormText, Spinner, Alert, Form } from 'reactstrap';

import { hasError } from "../helpers/utils";
import { updateCookieUser, updateCookieToken } from "../helpers/Services";
import { AuthService } from "../services/Auth";
import authConstants from "../constants/Authentication";

const Login = ({dispatch}) => {

    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleEmailChange = e => setEmail(e.target.value);
    const handlePasswordChange = e => setPassword(e.target.value);
    
    const submit = e => {
        e.preventDefault();
        if(!processing) {
            setMessage(null);
            setProcessing(true);
            setErrors(null);
            AuthService.login(email, password)
                .then(res => {
                    updateCookieUser(res.user);
                    updateCookieToken({authToken: res.token, refreshToken: res.refreshToken});
                    setMessage(null);
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
                {message && <Alert color="danger">{message}</Alert>}
                <Form onSubmit={submit}>
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
                    <FormGroup className="mb-4 d-flex align-items-center justify-content-between">
                        <div>Don't have account yet? <Link href="/sign-up"><a>Sign Up</a></Link></div>
                        <Button type="submit" disabled={processing} onClick={submit} className="btn-default">{processing && <Spinner size="sm"/>} Log In</Button>
                    </FormGroup>
                </Form>
            </Col>
            <Col sm="12" lg="3"></Col>
        </Row>
    )

}

export default connect()(Login);