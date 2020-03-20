import React, { useState, useEffect } from "react";
import { withRouter } from "next/router";
import { Row, Col, Spinner } from "reactstrap";
import Link from 'next/link';

import { UserService } from "../../services/User";
import Avatar from "../../components/Avatar";

const Volunteer = ({ router }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);
        UserService.volunteer(router.query.id)
            .then(res => {
                setLoading(false);
                setData(res);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="volunteer-page mt-5">
            {loading && <div className="text-center"><Spinner size="sm" /></div>}
            {!loading && data && (
                <Row>
                    <Col sm="12" md="6" className="mt-4">
                        <div className="initiative">
                            <div className="header">
                                <div className="d-flex align-items-center">
                                    <Avatar size="45" src={data.user.profile.img}/>
                                    <h4 className="ml-3 mb-0">{data.user.profile.name}</h4>
                                </div>
                            </div>
                            <div className="body">
                                <p>{data.user.profile.skills}</p>
                            </div>
                            <div className="footer">
                                <span className="call-time">{data.user.profile.hours} hrs/week</span>
                            </div>
                        </div>
                    </Col>
                    <Col sm="12" md="6" className="mt-4">
                        <div className="initiative">
                            <div className="header">
                                <div className="d-flex align-items-center">
                                    <h4 className="ml-3 mb-0">Initiatives</h4>
                                </div>
                            </div>
                            <div className="body">
                                <ul className="list-group list-group-flush">
                                    {data.initiatives && data.initiatives.map(i => {
                                        return (
                                            <li key={`initiative-${i._id}`} className="list-group-item">
                                                <Link href={`/initiatives/${i._id}`}>
                                                    <a>{i.name}</a>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default withRouter(Volunteer);
