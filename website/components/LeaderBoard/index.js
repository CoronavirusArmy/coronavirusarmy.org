import React from "react";
import { Row, Col, Button, Table } from "reactstrap";

import Avatar from "../Avatar";

const LeaderBoard = () => {

    const users = [
        {src: null, name: 'name 1', job: 'position 1', hours: 0},
        {src: null, name: 'name 2', job: 'position 2', hours: 0},
        {src: null, name: 'name 3', job: 'position 3', hours: 0},
        {src: null, name: 'name 4', job: 'position 4', hours: 0},
    ]

    return (
        <Row className="leader-board">
            <Col md="9" lg="8" xl="10">
                <h3>Volunteer Leaderboard</h3>
            </Col>
            <Col md="3" lg="4" xl="2" className="text-right">
                {/* <Button className="px-3 btn-white">View All</Button> */}
            </Col>

            {/* <Col sm="12" className="mt-4">
                <div className="list">
                    <Table>
                        <tbody>
                            {users.map((user, i) => {
                                return (
                                    <tr key={`user-${i}`}>
                                        <td>
                                            <Avatar src={user.src} size="32"/>
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.job}</td>
                                        <td>{user.hours} hour Volunteered</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
            </Col> */}

            <Col sm="12" className="mt-4">
                <div className="empty">
                    <p>We're just getting started so the Leaderboard is empty.</p>
                    <div>
                        <Button tag="a" href="/application" className="btn-default">Enlist in the Coronavirus Army</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )

}

export default LeaderBoard;