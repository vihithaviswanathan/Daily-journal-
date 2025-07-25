import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { Image, X } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length <= maxImages) {
      onImagesChange([...images, ...imageFiles]);
    } else {
      alert(`You can only upload up to ${maxImages} images`);
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Attach Images ({images.length}/{maxImages})
      </label>
      
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Upload ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Image className="h-6 w-6 text-gray-400" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};