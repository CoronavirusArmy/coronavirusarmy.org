import React, { useState, useEffect } from "react";
import { Row, Col, Spinner } from "reactstrap";

import ListVolunteers from "../components/ListVolunteers";
import CustomPagination from "../components/CustomPagination";
import { UserService } from "../services/User";

const VolunteersList = () => {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const [data, setData] = useState(null);

    const getData = page => {
        if(!data || (data && page !== data.page)) {
            setLoading(true);
            UserService.getAll(page)
                .then(res => {
                    setUsers(res.docs);
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        getData(1);
    }, []);

    return (
        <Row className="leader-board">
            <Col md="9" lg="8" xl="10">
                <h3>Volunteers</h3>
            </Col>
            {!loading && users && users.length > 0 && (
                <React.Fragment>
                    <Col sm="12" className="mt-4">
                        <div className="list">
                            <ListVolunteers users={users} />
                        </div>
                        {data && <div className="float-right mt-3">
                            <CustomPagination callback={getData} {...data} />
                        </div>}
                        <div className="clearfix"></div>
                    </Col>
                </React.Fragment>
            )}
            <Col sm="12" className="mt-4">
                {loading && (
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

export default VolunteersList;
