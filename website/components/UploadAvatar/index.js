import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import Slider from 'rc-slider';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { getBase64 } from '../../helpers/utils';

const UploadAvatar = ({ src, callback }) => {
    const cropSize = {width: 150, height: 150};
    const defaultImg = "/img/no-image.png";
    const fileInput = useRef(null);
    const [imgDisplay, setImgDisplay] = useState(src ? src : defaultImg);
    const [img, setImg] = useState(src ? src : defaultImg);
    const [modal, setModal] = useState(false);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const toggle = () => setModal(!modal);

    const onCropChange = _crop => {
        setCrop(_crop);
    };

    const onCropComplete = (_croppedArea, _croppedAreaPixels) => {
        setCroppedArea(_croppedAreaPixels);
    };

    const onZoomChange = _zoom => {
        setZoom(_zoom)
    };

    const onFileChange = async e => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
            const imageDataUrl = await getBase64(e.target.files[0]);
            setImg(imageDataUrl);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            toggle();
        }
    };

    const onCrop = () => {
        setImg(src);
        setImageFile(src);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        toggle();
    }
    
    const urltoFile = (url, filename, mimeType='image/png') => {
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
        );
    }

    const doCrop = () => {
        getCroppedImg(imageFile, croppedArea);
    }

    const upload = () => {
        if (typeof callback === "function") fileInput.current.click();
    };

    const getCroppedImg = async (_image, _crop) => {
        if(_image) {
            const canvas = document.createElement('canvas');
            canvas.width = _crop.width;
            canvas.height = _crop.height;
            const ctx = canvas.getContext('2d');

            let myImageUrl = null
            if(typeof _image === 'object')
                myImageUrl = URL.createObjectURL(_image);
            else
                myImageUrl = URL.createObjectURL(await urltoFile(_image, `${(new Date()).getTime()}.png`));
            
            const myImage = new Image();
            myImage.src = myImageUrl;   

            myImage.onload = function(){
                ctx.drawImage(
                    myImage,
                    _crop.x,
                    _crop.y,
                    _crop.width,
                    _crop.height,
                    0,
                    0,
                    _crop.width,
                    _crop.height
                );
                setImgDisplay(canvas.toDataURL());
                setImg(canvas.toDataURL());
                if (typeof callback === "function") callback(canvas.toDataURL());
                toggle();
            }

        }     
        
    }

    useEffect(() => {
        setImgDisplay(src ? src : defaultImg);
        setImg(src ? src : defaultImg);
    }, [src])

    return (
        <div className="upload-avatar">
            <input onChange={onFileChange} style={{ width: "0px", height: "0px" }} ref={fileInput} type="file" />
            <div className="avatar-div">
                <img className="avatar" src={imgDisplay}/>
                <div className="actions">
                    {imgDisplay !== defaultImg && <span className="action-item" onClick={onCrop}>Crop</span>}
                    <span className="action-item" onClick={upload}>Update</span>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle} keyboard={false} backdrop={false}>
                <ModalHeader toggle={toggle}>Resize Image</ModalHeader>
                <ModalBody className="p-0">
                    <div className="crop-container">
                        <Cropper
                            aspect={1}
                            cropSize={cropSize}
                            showGrid={false}
                            image={img}
                            crop={crop}
                            zoom={zoom}
                            onCropChange={onCropChange}
                            onCropComplete={onCropComplete}
                            onZoomChange={onZoomChange}
                        />
                    </div>
                    <div className="controls">
                        <Slider value={zoom} onChange={onZoomChange} step={0.1} defaultValue={1} min={0.5} max={3} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-default btn-rect" onClick={doCrop}>Ok</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default UploadAvatar;