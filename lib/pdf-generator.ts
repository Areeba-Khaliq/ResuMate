/**
 * PDF Generation utilities
 * Converts resume HTML to downloadable PDF using jsPDF and html2canvas
 * 
 * This approach:
 * 1. Takes a screenshot of the resume preview
 * 2. Converts it to a PDF document
 * 3. Handles different page sizes and layouts
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  quality?: number;
  margin?: number;
}

/**
 * Generate PDF from HTML element
 * This function captures the resume preview and converts it to PDF
 */
export async function generateResumePDF(
  elementId: string,
  options: PDFOptions = {}
): Promise<void> {
  try {
    const {
      filename = 'resume.pdf',
      format = 'a4',
      quality = 1,
      margin = 10
    } = options;

    // Get the resume element to convert
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Show loading state
    const loadingToast = document.createElement('div');
    loadingToast.textContent = 'Generating PDF...';
    document.body.appendChild(loadingToast);

    // Configure html2canvas for high-quality capture
    const canvas = await html2canvas(element, {
      scale: quality * 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    // Remove loading toast
    document.body.removeChild(loadingToast);

    // Calculate PDF dimensions
    const imgWidth = format === 'a4' ? 210 : 216; // A4 vs Letter width in mm
    const pageHeight = format === 'a4' ? 297 : 279; // A4 vs Letter height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = margin;

    // Create PDF document
    const pdf = new jsPDF('portrait', 'mm', format);
    const imgData = canvas.toDataURL('image/png');

    // Add first page
    pdf.addImage(
      imgData, 
      'PNG', 
      margin, 
      position, 
      imgWidth - (margin * 2), 
      imgHeight - (margin * 2)
    );
    
    heightLeft -= (pageHeight - margin * 2);

    // Add additional pages if content is longer
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, 
        position, 
        imgWidth - (margin * 2), 
        imgHeight - (margin * 2)
      );
      heightLeft -= (pageHeight - margin * 2);
    }

    // Download the PDF
    pdf.save(filename);
    
    // Show success message
    console.log('PDF generated successfully');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Preview PDF before download
 * Opens PDF in new window/tab for preview
 */
export async function previewResumePDF(
  elementId: string,
  options: PDFOptions = {}
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210; // A4 width
    const pageHeight = 297; // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Open in new window instead of downloading
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw new Error('Failed to preview PDF');
  }
}

/**
 * Get optimal PDF settings based on content
 * Analyzes resume content to suggest best PDF options
 */
export function getOptimalPDFSettings(contentLength: number): PDFOptions {
  return {
    format: 'a4',
    quality: contentLength > 1000 ? 0.8 : 1, // Lower quality for longer resumes
    margin: 15,
    filename: `resume-${new Date().toISOString().split('T')[0]}.pdf`
  };
}