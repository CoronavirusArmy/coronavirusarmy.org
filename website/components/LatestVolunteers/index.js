import React, { useState, useEffect } from "react";
import { Row, Col, Button, Spinner } from "reactstrap";

import { UserService } from "../../services/User";
import ListVolunteers from "../ListVolunteers";

const LatestVolunteers = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        setLoading(true);
        UserService.getLatest()
            .then(res => {
                setUsers(res);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            })
    }, []);

    return (
        <Row className="leader-board">
            <Col md="9" lg="8" xl="10">
                <h3>Volunteers</h3>
            </Col>
            {!loading && users && users.length > 0 && (
                <React.Fragment>
                    <Col md="3" lg="4" xl="2" className="text-right">
                        <Button tag="a" href="/volunteers" className="px-3 btn-white">View All</Button>
                    </Col>

                    <Col sm="12" className="mt-4">
                        <div className="list">
                            <ListVolunteers users={users} />
                        </div>
                    </Col>
                </React.Fragment>
            )}
            <Col sm="12" className="mt-4">
                {loading && !users && (
                    <div className="text-center">
                        <Spinner size="sm" />
                    </div>
                )}
                {!loading && (!users || (users && users.length === 0)) && (
                    <div className="empty">
                        <p>We're just getting started so the volunteers list is empty.</p>
                    </div>
                )}
            </Col>
        </Row>
    );
};

export default LatestVolunteers;
