import { NextRequest, NextResponse } from 'next/server';
import { AadharValidator } from '@/lib/validation/aadharValidator';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('aadhar') as File;
    const manualAadhar = formData.get('manualAadhar') as string;

    // Handle manual Aadhar entry
    if (manualAadhar) {
      const isValid = AadharValidator.validateAadharNumber(manualAadhar);

      if (!isValid) {
        return NextResponse.json({
          success: false,
          message: 'Invalid Aadhar number. Please check and try again.'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Aadhar verified successfully!',
        aadharNumber: manualAadhar,
        maskedNumber: AadharValidator.maskAadhar(manualAadhar),
        formattedNumber: AadharValidator.formatAadhar(manualAadhar)
      });
    }

    // Handle file upload
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
          message: 'Please upload an Aadhar card image or enter manually'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file type. Please upload a JPEG, PNG, or WEBP image.'
      }, { status: 400 });
    }

    // Validate file size (max 5MB, min 10KB for quality check)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const minSize = 10 * 1024; // 10KB

    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    if (file.size < minSize) {
      return NextResponse.json({
        success: false,
        message: 'File size too small. Image may not be clear enough. Please upload a clearer image.'
      }, { status: 400 });
    }

    console.log('Processing Aadhar image:', file.name, file.type, file.size);

    // Basic image validation passed
    // For demo purposes, return success and prompt for manual entry
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully. Please enter your Aadhar number below for verification.',
      requiresManualEntry: true
    });

  } catch (error) {
    console.error('Aadhar validation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        message: 'An error occurred while processing your Aadhar card. Please try again.'
      },
      { status: 500 }
    );
  }
}
