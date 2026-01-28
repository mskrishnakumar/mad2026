'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './button';

interface FileUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  status?: 'idle' | 'uploading' | 'validating' | 'success' | 'error';
  error?: string;
  disabled?: boolean;
}

export function FileUpload({
  label,
  required = false,
  accept = 'image/*',
  onFileSelect,
  status = 'idle',
  error,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    onFileSelect(file);
  };

  const handleRemove = () => {
    setFileName(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileSelect(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'validating':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'validating':
        return 'Validating document...';
      case 'success':
        return 'Document verified';
      case 'error':
        return error || 'Validation failed';
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
          ${status === 'success' ? 'border-green-300 bg-green-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {!fileName ? (
          <div className="space-y-2">
            <Upload className="h-10 w-10 mx-auto text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        ) : (
          <div className="space-y-3">
            {preview ? (
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <FileText className="h-10 w-10 mx-auto text-gray-400" />
            )}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-700 truncate max-w-[200px]">{fileName}</span>
              {getStatusIcon()}
            </div>
            {getStatusText() && (
              <p className={`text-xs ${status === 'error' ? 'text-red-600' : status === 'success' ? 'text-green-600' : 'text-blue-600'}`}>
                {getStatusText()}
              </p>
            )}
          </div>
        )}
      </div>

      {fileName && status !== 'validating' && status !== 'uploading' && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            disabled={disabled}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
