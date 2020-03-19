import React from "react";
import { Table } from "reactstrap";

import Avatar from "../Avatar";

const ListVolunteers = ({ users }) => {
    return (
        <Table responsive={true}>
            <tbody>
                {users.map(user => {
                    return (
                        <tr key={`user-${user._id}`}>
                            <td style={{width: '50px'}}>
                                <Avatar src={user.profile.img} size="32" />
                            </td>
                            <td style={{width: '200px'}}>{user.profile.name}</td>
                            <td >{user.profile.skills}</td>
                            <td style={{width: '150px'}} className="text-right">{user.profile.hours} hrs/week</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default ListVolunteers;
