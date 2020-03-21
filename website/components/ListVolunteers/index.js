import React from "react";
import { Table } from "reactstrap";
import Link from "next/link";

import Avatar from "../Avatar";
import { formatTime } from "../../helpers/utils";

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
                            <td style={{width: '200px'}}>
                                <Link href={`/volunteer/${user._id}`}>
                                    <a>{user.profile.name}</a>
                                </Link>
                            </td>
                            <td >{user.profile.skills}</td>
                            <td style={{width: '150px'}} className="text-right">{formatTime((user.time ? user.time : 0), false, false)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default ListVolunteers;
