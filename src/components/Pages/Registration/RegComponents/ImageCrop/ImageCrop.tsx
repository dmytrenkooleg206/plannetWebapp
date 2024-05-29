import { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import styles from './ImageCrop.module.scss';

type ImageCropProps = {
  photoRef: any;
  isLoading: boolean;
};
export default function ImageCrop({ photoRef, isLoading }: ImageCropProps) {
  const uploadRef: any = useRef(null);

  const [zoom, setZoom] = useState<number>(0);
  const [image, setImage] = useState<any>(null);

  const handleUploadFile = (e: any) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleOnUpload = (e: any) => {
    if (isLoading) return;
    if (uploadRef) uploadRef.current.click();
  };

  const handleOnZoomChange = (val: string) => {
    if (isLoading) return;
    setZoom(parseInt(val, 10));
  };

  const handleZoomCtrlClick = (type: boolean) => {
    if (isLoading) return;
    if (type) setZoom(Math.min(100, zoom + 5));
    else setZoom(Math.max(0, zoom - 5));
  };

  return (
    <div className={styles.image_crop}>
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={handleUploadFile}
        style={{ display: 'none' }}
      />
      <div className={styles.avatar}>
        {image ? (
          <AvatarEditor
            ref={photoRef}
            image={image}
            width={300}
            height={300}
            borderRadius={0}
            border={0}
            scale={zoom / 20 + 1}
          />
        ) : (
          <img
            className={styles.placeholder}
            src="/assets/images/planneritem/profile_placeholder.png"
            alt="avatar"
          />
        )}
        <div
          role="presentation"
          onClick={handleOnUpload}
          className={styles.button_select}
        >
          <img
            src="/assets/images/registration/select_photo.svg"
            alt="select_photo"
          />
        </div>
      </div>
      {image && (
        <div className={styles.container_slider}>
          <div
            className={styles.slider_button}
            onClick={() => handleZoomCtrlClick(false)}
            role="presentation"
          >
            <img src="/assets/images/registration/line.svg" alt="minus" />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={zoom}
            className={styles.slider}
            onChange={(e: any) => handleOnZoomChange(e.target.value)}
          />
          <div
            className={styles.slider_button}
            onClick={() => handleZoomCtrlClick(true)}
            role="presentation"
          >
            <img src="/assets/images/registration/plus.svg" alt="plus" />
          </div>
        </div>
      )}
    </div>
  );
}
