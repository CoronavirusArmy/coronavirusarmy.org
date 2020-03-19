import React, { useState, useEffect } from "react";
import { Row, Col, Spinner, Table } from "reactstrap";

import Avatar from "../components/Avatar";
import CustomPagination from "../components/CustomPagination";
import { UserService } from "../services/User";

const AllVolunteersList = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const [data, setData] = useState(null);

    const getData = page => {
        if (!data || (data && page !== data.page)) {
            setLoading(true);
            UserService.get(page)
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
                            <Table responsive={true}>
                                <tbody>
                                    {users.map(user => {
                                        return (
                                            <tr key={`user-${user._id}`}>
                                                <td>
                                                    <div>
                                                        <div className="float-left mr-3">
                                                            <Avatar src={user.profile.img} size="32" />
                                                        </div>
                                                        <div className="float-left mt-1">{user.profile.name}</div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <div className="mt-2">
                                                        <a href={`mailto:${user.email}`} className="helper-text">{user.email}</a>
                                                        <br />
                                                        {user.phone && <a href={`tel:${user.phone}`} className="helper-text">{user.phone}</a>}
                                                    </div>
                                                </td>
                                                <td>{user.redditUsername}</td>
                                                <td style={{width: '300px'}}>{user.profile.skills}</td>
                                                <td className="text-right">{user.profile.hours} hrs/week</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                        {data && (
                            <div className="float-right mt-3">
                                <CustomPagination callback={getData} {...data} />
                            </div>
                        )}
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

export default AllVolunteersList;
