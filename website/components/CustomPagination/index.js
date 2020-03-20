import React, { useState, useEffect } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { range } from "../../helpers/utils";

const CustomPagination = ({ callback, hasNextPage, hasPrevPage, nextPage, prevPage, page, totalPages}) => {
    const [pages, setPages] = useState([]);

    const getPageList = (totalP, p, maxLength) => {
        if (maxLength < 5) throw "maxLength must be at least 5";
    
        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
        if (totalP <= maxLength) {
            return range(1, totalP);
        }
        if (p <= maxLength - sideWidth - 1 - rightWidth) {
            return range(1, maxLength-sideWidth-1)
                .concat([0])
                .concat(range(totalP-sideWidth+1, totalP));
        }
        if (p >= totalP - sideWidth - 1 - rightWidth) {
            return range(1, sideWidth)
                .concat([0])
                .concat(range(totalP - sideWidth - 1 - rightWidth - leftWidth, totalP));
        }
        return range(1, sideWidth)
            .concat([0])
            .concat(range(p - leftWidth, p + rightWidth)) 
            .concat([0])
            .concat(range(totalP-sideWidth+1, totalP));
    }

    useEffect(() => {
        setPages(getPageList(totalPages, page, 10));
    }, [page, totalPages]);
    
    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={!hasPrevPage} onClick={() => callback(1)}>
                <PaginationLink previous />
            </PaginationItem>
            <PaginationItem disabled={!hasPrevPage} onClick={() => hasPrevPage ? callback(prevPage) : {}}>
                <PaginationLink>
                    <span aria-hidden="true">‹</span>
                </PaginationLink>
            </PaginationItem>
            {pages.length > 0 &&
                pages.map((p, i) => {
                    return (
                        <React.Fragment key={`page-${i}`}>
                        <PaginationItem disabled={p === 0} onClick={() => callback(p)} active={page === p}>
                            <PaginationLink>{p > 0 ? p : '...'}</PaginationLink>
                        </PaginationItem>
                        </React.Fragment>
                    );
                })}
            <PaginationItem disabled={!hasNextPage} onClick={() => hasNextPage ? callback(nextPage) : {}}>
                <PaginationLink>
                    <span aria-hidden="true">›</span>
                </PaginationLink>
            </PaginationItem>
            <PaginationItem disabled={!hasNextPage} onClick={() => callback(totalPages)}>
                <PaginationLink next />
            </PaginationItem>
        </Pagination>
    );
};

export default CustomPagination;
