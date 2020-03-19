import React, { useState, useEffect } from "react";

const Avatar = ({ src, size, style }) => {
    const [img, setImg] = useState(src);

    useEffect(() => {
        if(src)
            setImg(src);
    }, [src])

    return (
        <div
            className="avatar"
            style={{
                ...style,
                width: `${size}px`,
                height: `${size}px`
            }}
        >
            <img src={img ? img : "/img/no-image.png"} style={{ width: `${size}px`, height: `${size}px` }} />
        </div>
    );
};

export default Avatar;
