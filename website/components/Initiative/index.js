import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

import Avatar from '../Avatar';

const Initiative = ({_id, leader, name, description, github, callTime, callLink, members}) => {

    return (
        <div className="initiative">
            <div className="header d-flex justify-content-between align-items-center">
                <Link href={`/initiatives/${_id}`}><a className="link">{name}</a></Link>
                {github && <a className="github" href={github} target="_blank">View on Github</a>}
            </div>
            <div className="body">
                {description && <p>{description}</p>}
            </div>
            <div className="footer">
                <Row className="align-items-center">
                    <Col md="12" lg="4" className="mb-4">
                        <div className="members">
                            {leader && <Avatar src={leader.profile.img} size="32" />}
                            {members && members.slice(0, 6).map((m, i) => {
                                return (
                                    <Avatar key={`member-${i}`} src={m.user.profile.img} size="32" />
                                )
                            })}
                            {members && members.length > 6 && <div className="add">+{members.length - 6}</div>}
                        </div>
                    </Col>
                    <Col md="12" lg="4" className="mb-4">
                        <span className="call-time">{callTime}</span>
                    </Col>
                    <Col md="12" lg="4" className="mb-4">
                        <Button tag="a" href={callLink} target="_blank" block className="btn-default">Join Standup Call</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )

}

export default Initiative;