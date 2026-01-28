'use client';

import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AadharUploadProps {
  onValidationSuccess?: (aadharNumber: string) => void;
}

interface ValidationResult {
  success: boolean;
  message: string;
  aadharNumber?: string;
  maskedNumber?: string;
  formattedNumber?: string;
  requiresManualEntry?: boolean;
}

export function AadharUpload({ onValidationSuccess }: AadharUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [imageValidated, setImageValidated] = useState(false);
  const [manualAadhar, setManualAadhar] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setResult({
        success: false,
        message: 'Please upload a valid image file (JPEG, PNG, or WEBP)'
      });
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setResult({
        success: false,
        message: 'File size must be less than 5MB'
      });
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setImageValidated(false);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImageUpload = async () => {
    if (!file) return;

    setValidating(true);
    setResult(null);

    const formData = new FormData();
    formData.append('aadhar', file);

    try {
      const response = await fetch('/api/validate-aadhar', {
        method: 'POST',
        body: formData,
      });

      const data: ValidationResult = await response.json();

      if (data.success && data.requiresManualEntry) {
        setImageValidated(true);
        setResult({
          success: true,
          message: 'Image looks good! Please enter your 12-digit Aadhar number below.'
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleManualValidation = async () => {
    if (!manualAadhar || manualAadhar.length !== 12) {
      setResult({
        success: false,
        message: 'Please enter a valid 12-digit Aadhar number'
      });
      return;
    }

    setValidating(true);

    const formData = new FormData();
    formData.append('manualAadhar', manualAadhar);

    try {
      const response = await fetch('/api/validate-aadhar', {
        method: 'POST',
        body: formData,
      });

      const data: ValidationResult = await response.json();
      setResult(data);

      if (data.success && data.aadharNumber && onValidationSuccess) {
        onValidationSuccess(data.aadharNumber);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Validation failed. Please try again.'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setImageValidated(false);
    setManualAadhar('');
  };

  const formatAadharInput = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 12 digits
    return digits.substring(0, 12);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Aadhar Card <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500">
          Upload a clear image of your Aadhar card and enter the number for verification
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700 mb-1">
              Click to upload Aadhar Card
            </span>
            <span className="text-xs text-gray-500">
              JPEG, PNG or WEBP (Max 5MB)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          {preview && (
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Aadhar preview"
                className="w-full h-48 object-contain bg-gray-50"
              />
              {!imageValidated && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={handleReset}
                    className="bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
                    type="button"
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* File info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {imageValidated && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>

          {/* Image validation button */}
          {!imageValidated && !validating && (
            <button
              onClick={handleImageUpload}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
              type="button"
            >
              Verify Image & Continue
            </button>
          )}

          {/* Manual entry field */}
          {imageValidated && !result?.aadharNumber && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Enter Aadhar Number
                </label>
                <Input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={manualAadhar}
                  onChange={(e) => setManualAadhar(formatAadharInput(e.target.value))}
                  maxLength={12}
                  className="font-mono text-center text-lg tracking-widest"
                />
                <p className="text-xs text-gray-500 text-center">
                  {manualAadhar.length}/12 digits
                </p>
              </div>

              <button
                onClick={handleManualValidation}
                disabled={manualAadhar.length !== 12 || validating}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                type="button"
              >
                Verify Aadhar Number
              </button>
            </div>
          )}
        </div>
      )}

      {/* Validation progress */}
      {validating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                {imageValidated ? 'Verifying Aadhar number...' : 'Checking image quality...'}
              </p>
              <p className="text-xs text-blue-700">
                Please wait
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg border ${
            result.success && result.aadharNumber
              ? 'bg-green-50 border-green-200'
              : result.success
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.success && result.aadharNumber ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : result.success ? (
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  result.success && result.aadharNumber
                    ? 'text-green-900'
                    : result.success
                    ? 'text-blue-900'
                    : 'text-red-900'
                }`}
              >
                {result.message}
              </p>
              {result.maskedNumber && (
                <div className="mt-3 space-y-2">
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs text-gray-600 mb-1">Verified Aadhar Number</p>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {result.maskedNumber}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded text-xs text-green-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      The Aadhar number you entered matches the document uploaded.
                    </p>
                  </div>
                </div>
              )}
              {result.success && result.aadharNumber && (
                <div className="mt-3">
                  <button
                    onClick={handleReset}
                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                    type="button"
                  >
                    Upload a different card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
