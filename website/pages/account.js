import React, { useEffect, useState } from "react";
import { Row, Col, Button, FormGroup, Label, Input, Spinner, FormText, Alert, Form } from "reactstrap";
import { connect } from "react-redux";

import { UserService } from "../services/User";
import authConstants from "../constants/Authentication";
import AuthProtected from "../components/AuthProtected";
import UploadAvatar from "../components/UploadAvatar";

const Account = ({ user, dispatch }) => {
    const [errors, setErrors] = useState(null);
    const [message, setMessage] = useState(null);

    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [img, setImg] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [skills, setSkills] = useState("");
    const [hours, setHours] = useState("");
    const [redditUsername, setRedditUsername] = useState("");
    const [githubUsername, setGithubUsername] = useState("");
    const [zipcode, setZipcode] = useState("");

    const handleNameChange = e => setName(e.target.value);
    const handlePhoneChange = e => setPhone(e.target.value);
    const handleSkillsChange = e => setSkills(e.target.value);
    const handleHoursChange = e => setHours(e.target.value);
    const handleRedditUsernameChange = e => setRedditUsername(e.target.value);
    const handleGithubUsernameChange = e => setGithubUsername(e.target.value);
    const handleZipcodeChange = e => setZipcode(e.target.value);

    const hasError = field => {
        if (!errors) return false;
        else {
            const error = errors.find(e => e.field === field);
            if (error) return error.description;
            else return false;
        }
    };

    const submit = e => {
        e.preventDefault();
        if (!processing) {
            setMessage(null);
            setProcessing(true);
            setErrors(null);
            UserService.updateInfo(img, name, phone, skills, hours, redditUsername, githubUsername, zipcode)
                .then(res => {
                    getData(true);
                    setMessage(res.message);
                    setProcessing(false);
                })
                .catch(err => {
                    const error = err.message ? err.message : err;
                    if (typeof error === "string") setMessage(error);
                    else setErrors(error);
                    setProcessing(false);
                });
        }
    };

    const getData = (update) => {
        setLoaded(true);
        if(!update) {
            setLoading(true);
            setError(null);
        }
        UserService.getInfo()
            .then(res => {
                setLoading(false);
                setName(res.name);
                setImg(res.img);
                setPhone(res.phone);
                setSkills(res.skills);
                setHours(res.hours);
                setRedditUsername(res.redditUsername);
                setGithubUsername(res.githubUsername);
                setZipcode(res.zipcode);
                if(update) {
                    dispatch({ type: authConstants.UPDATE_USER, data: { field: "profile.name", value: res.name } });
                    dispatch({ type: authConstants.UPDATE_USER, data: { field: "profile.img", value: res.img } });
                }
            })
            .catch(err => {
                setLoading(false);
                setError("Error loading additional information, please reload page.");
            });
    };

    useEffect(() => {
        if (user && !loaded) {
            getData(false);
        }
    }, [user]);

    return (
        <AuthProtected>
            <Row className="mt-4">
                <Col sm="12" className="mb-4">
                    {loading && !error && (
                        <div className="mt-5 text-center">
                            <Spinner size="sm" />
                        </div>
                    )}
                    {!loading && error && <Alert color="danger">{error}</Alert>}
                    {message && <Alert color="success">{message}</Alert>}
                </Col>

                <Col sm="12">
                    {!loading && !error && (
                        <Form onSubmit={submit} className="row">
                            <Col sm="12" md="2" className="mb-4 center">
                                <UploadAvatar width="120px" height="120px" src={img} callback={setImg} />
                            </Col>
                            <Col sm="12" md="5" className="mb-4">
                                {user && (
                                    <React.Fragment>
                                        <FormGroup>
                                            <Label>Name</Label>
                                            <Input invalid={hasError("name") !== false} value={name} onChange={handleNameChange} bsSize="lg" />
                                            {hasError("name") && <FormText color="danger">{hasError("name")}</FormText>}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Email</Label>
                                            <Input value={user.email} disabled bsSize="lg" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Phone</Label>
                                            <Input type="text" value={phone} onChange={handlePhoneChange} name="phone" bsSize="lg" />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Skills</Label>
                                            <Input type="text" value={skills} onChange={handleSkillsChange} name="skills" bsSize="lg" />
                                        </FormGroup>
                                    </React.Fragment>
                                )}
                            </Col>
                            <Col sm="12" md="5" className="mb-4">
                                <FormGroup>
                                    <Label>How many hours per week can you volunteer?</Label>
                                    <Input type="number" value={hours} onChange={handleHoursChange} name="hours" bsSize="lg" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Reddit username</Label>
                                    <Input type="text" value={redditUsername} onChange={handleRedditUsernameChange} name="redditUsername" bsSize="lg" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Github username</Label>
                                    <Input type="text" value={githubUsername} onChange={handleGithubUsernameChange} name="githubUsername" bsSize="lg" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Zip Code</Label>
                                    <Input type="text" value={zipcode} onChange={handleZipcodeChange} name="zipcode" bsSize="lg" />
                                </FormGroup>
                                <FormGroup className="text-right">
                                    <Row>
                                        <Col>
                                            <Button type="submit" disabled={processing} onClick={submit} className="btn-default">
                                                {processing && <Spinner size="sm" />} Update
                                            </Button>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>
                        </Form>
                    )}
                </Col>
            </Row>
        </AuthProtected>
    );
};

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
};

export default connect(mapStateToProps)(Account);
