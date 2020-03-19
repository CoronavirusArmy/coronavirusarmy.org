import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'reactstrap';

import Initiative from '../../components/Initiative';
import { InitiativeService } from "../../services/Initiative"

const Initiatives = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);
        InitiativeService.get()
            .then(res => {
                setLoading(false);
                setData(res);
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    return (
        <Row className="leader-board">
            <Col sm="12" className="mb-4">
                <h3>Initiatives</h3>
            </Col>

            {loading && <Col sm="12" className="mb-4 text-center">
                <Spinner size="sm" />
            </Col>}

            {data && data.map(d => {
                return (
                    <Col sm="12" key={`data-${d._id}`} className="mb-4">
                        <Initiative {...d} />
                    </Col>
                )
            })}
        </Row>
    )

}

export default Initiatives;