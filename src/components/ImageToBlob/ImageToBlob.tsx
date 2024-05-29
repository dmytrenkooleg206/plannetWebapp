import { useEffect } from 'react';
import Image from 'next/image';

type ImageToBlobProps = {
  src: string;
  onSetBlob: Function;
};
export default function ImageToBlob({ src, onSetBlob }: ImageToBlobProps) {
  const initialize = async () => {
    
    try {
      const canvas: any = document.getElementById('myCanvas');
      const image: any = document.getElementById('myImage');
      const width = image.clientWidth;
      const height = image.clientHeight;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      image.onload = () => {
        context.drawImage(image, 0, 0, width, height, 0, 0, width, height);
        // Convert the canvas image to a blob
        canvas.toBlob(function (blob: any) {
          // Use the blob as needed
          onSetBlob(blob);
        });
      };
    } catch (error) {
      onSetBlob(null);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  return (
    <div className="invisible fixed top-0 left-0">
      <canvas id="myCanvas" className="flex" />
      <Image src={src} width={600} height={400} alt="image" id="myImage" loading="lazy"/>
    </div>
  );
}
