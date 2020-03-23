import React, { useEffect, useState } from "react";
import { Row, Col, Button, Spinner, Alert } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";

import Avatar from "../../components/Avatar";
import { InitiativeService } from "../../services/Initiative";

const Members = ({ initiativeId, users, showRemove = false, user, isLeader, callback }) => {
    const remove = userId => {
        InitiativeService.removeMember(initiativeId, userId)
            .then(res => {
                if(typeof callback === 'function')
                    callback();
                toast.success(res.message);
            })
            .catch(err => {
                toast.error(err.message);
            });
    };

    return (
        <React.Fragment>
            {users &&
                users.map((u, i) => {
                    return (
                        <div className="member" key={`member-${i}`}>
                            {showRemove && (isLeader || user._id === u._id) && (
                                <span onClick={() => remove(u._id)} className="remove text-danger">
                                    ×
                                </span>
                            )}
                            <Link href={`/volunteer/${u._id}`}>
                                <a className="d-flex align-items-center">
                                    <Avatar src={u.profile.img} size="32" />
                                    <div className="name">{u.profile.name}</div>
                                </a>
                            </Link>
                        </div>
                    );
                })}
        </React.Fragment>
    );
};

const InitiativeDetails = ({ router, user, loggedIn }) => {
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);
    const [isLeader, setLeader] = useState(false);

    const join = () => {
        if (!processing) {
            setProcessing(true);
            InitiativeService.join(router.query.id)
                .then(res => {
                    getData(true);
                    setProcessing(false);
                    toast.success(res.message);
                })
                .catch(err => {
                    setProcessing(false);
                });
        }
    };

    const getData = update => {
        setError(false);
        if (!update) setLoading(true);
        InitiativeService.details(router.query.id)
            .then(res => {
                console.log(res)
                setLoading(false);
                setData(res);
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
            });
    };

    const isMember = () => {
        return data.members.find(m => m.user._id === user._id);
    };

    useEffect(() => {
        getData(false);
    }, []);

    useEffect(() => {
        if (user && data) {
            setLeader(user._id === data.leader._id);
        }
    }, [user, data]);

    return (
        <div className="initiative-details mt-5">
            {loading && (
                <div className="text-center">
                    <Spinner size="sm" />
                </div>
            )}
            {!loading && error && <Alert color="danger">{error}</Alert> }
            {!loading && !error && data && (
                <React.Fragment>
                    <div className="header d-flex justify-content-between align-items-center">
                        <h3>{data.name}</h3>
                        {data.github && (
                            <a className="github" href={data.github} target="_blank">
                                View on Github
                            </a>
                        )}
                    </div>
                    <div className="body">{data.description && <p>{data.description}</p>}</div>
                    <div className="footer">
                        <Row className="align-items-center">
                            <Col md="12" lg="8" className="mb-4">
                                <span className="call-time">{data.callTime}</span>
                            </Col>
                            <Col md="12" lg="4" className="mb-4">
                                <Button tag="a" href={data.callLink} target="_blank" block className="btn-default">
                                    Join Standup Call
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    <Row className="members">
                        <Col md="12" lg="8" className="mb-4">
                            {data.leader && (
                                <div className="group">
                                    <div className="caption">Leader: </div>
                                    <div className="list">
                                        <Members users={[data.leader]} />
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            )}
                            {data.members && (
                                <div className="group">
                                    <div className="caption">Members: </div>
                                    <div className="list">
                                        <Members initiativeId={data._id} users={data.members.map(m => m.user)} showRemove={true} user={user} isLeader={isLeader} callback={() => getData(true)} />
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                            )}
                        </Col>
                        <Col md="12" lg="4" className="mb-4">
                            {loggedIn && user && !isMember() && (
                                <Button disabled={processing} onClick={join} block className="btn-default">
                                    {processing && <Spinner size="sm" />} Join this Project
                                </Button>
                            )}
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    const { user, loggedIn } = state.authentication;
    return { user, loggedIn };
};

export default withRouter(connect(mapStateToProps)(InitiativeDetails));
