/**
 * Main Resume Builder Component
 * Orchestrates the entire resume building process
 * 
 * Features:
 * - Multi-step form navigation
 * - Real-time resume preview
 * - Data persistence
 * - Template selection
 * - PDF generation
 */

'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  FolderOpen,
  Palette
} from 'lucide-react';

import { PersonalInfoForm } from '@/components/forms/PersonalInfoForm';
import { ExperienceForm } from '@/components/forms/ExperienceForm';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { generateResumePDF, previewResumePDF } from '@/lib/pdf-generator';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project } from '@/types/resume';

// Initial data structure
const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'modern'
};

// Step configuration
const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Code },
  { id: 'projects', title: 'Projects', icon: FolderOpen },
  { id: 'template', title: 'Template', icon: Palette },
  { id: 'preview', title: 'Preview', icon: Eye }
];

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever resumeData changes
  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
  }, [resumeData]);

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Update personal information
   */
  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    setResumeData(prev => ({ ...prev, personalInfo }));
  };

  /**
   * Update work experience
   */
  const updateExperience = (experience: Experience[]) => {
    setResumeData(prev => ({ ...prev, experience }));
  };

  /**
   * Update education (placeholder for now)
   */
  const updateEducation = (education: Education[]) => {
    setResumeData(prev => ({ ...prev, education }));
  };

  /**
   * Update skills (placeholder for now)  
   */
  const updateSkills = (skills: Skill[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  /**
   * Update projects (placeholder for now)
   */
  const updateProjects = (projects: Project[]) => {
    setResumeData(prev => ({ ...prev, projects }));
  };

  /**
   * Generate and download PDF
   */
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateResumePDF('resume-preview', {
        filename: `${resumeData.personalInfo.firstName}_${resumeData.personalInfo.lastName}_Resume.pdf`,
        format: 'a4',
        quality: 1
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /**
   * Preview PDF
   */
  const handlePreviewPDF = async () => {
    try {
      await previewResumePDF('resume-preview');
    } catch (error) {
      console.error('PDF preview failed:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  /**
   * Calculate completion percentage
   */
  const calculateProgress = () => {
    const totalFields = 7; // Approximate number of required sections
    let completedFields = 0;
    
    if (resumeData.personalInfo.firstName && resumeData.personalInfo.email) completedFields++;
    if (resumeData.experience.length > 0) completedFields++;
    if (resumeData.education.length > 0) completedFields++;
    if (resumeData.skills.length > 0) completedFields++;
    if (resumeData.projects.length > 0) completedFields++;
    if (resumeData.template) completedFields++;
    if (currentStep >= steps.length - 1) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  /**
   * Render current step content
   */
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onUpdate={updatePersonalInfo}
            onNext={nextStep}
          />
        );
        
      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onUpdate={updateExperience}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
        
      case 'education':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Education Section</h3>
                <p className="text-gray-600 mb-4">Coming soon! For now, you can skip this step.</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={previousStep}>Previous</Button>
                  <Button onClick={nextStep}>Skip for Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'skills':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <Code className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Skills Section</h3>
                <p className="text-gray-600 mb-4">Coming soon! For now, you can skip this step.</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={previousStep}>Previous</Button>
                  <Button onClick={nextStep}>Skip for Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'projects':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Projects Section</h3>
                <p className="text-gray-600 mb-4">Coming soon! For now, you can skip this step.</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={previousStep}>Previous</Button>
                  <Button onClick={nextStep}>Skip for Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'template':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="text-center">
                <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Template Selection</h3>
                <p className="text-gray-600 mb-4">Currently using Modern template. More templates coming soon!</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={previousStep}>Previous</Button>
                  <Button onClick={nextStep}>Continue to Preview</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'preview':
        return (
          <div className="w-full">
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handlePreviewPDF}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview PDF
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </Button>
              <Button variant="outline" onClick={previousStep}>
                Edit Resume
              </Button>
            </div>
            
            <div id="resume-preview" className="max-w-4xl mx-auto">
              <ModernTemplate data={resumeData} />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Resume Builder</h1>
          <p className="text-xl text-gray-600">Create your professional resume in minutes</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Badge variant="outline">{calculateProgress()}% Complete</Badge>
            </div>
            <Progress value={(currentStep + 1) / steps.length * 100} className="mb-4" />
            
            {/* Step Navigation */}
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : isCompleted 
                        ? 'text-green-600' 
                        : 'text-gray-400'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1">
            {renderStepContent()}
          </div>
          
          {/* Preview Section - Hidden on small screens and preview step */}
          {currentStep < steps.length - 1 && (
            <div className="hidden lg:block lg:w-96">
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-semibold">Live Preview</h3>
                  </div>
                  <div className="transform scale-[0.3] origin-top-left w-[300%] h-96 overflow-hidden">
                    <div id="mini-preview">
                      <ModernTemplate data={resumeData} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}