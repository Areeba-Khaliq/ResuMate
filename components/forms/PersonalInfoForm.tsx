/**
 * Personal Information Form Component
 * Handles collection of basic personal details like name, contact info, and summary
 * 
 * Features:
 * - Real-time validation using Zod schema
 * - Auto-save functionality
 * - Professional summary with AI enhancement
 */

'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { PersonalInfo } from '@/types/resume';
import { enhanceSummary } from '@/lib/grok-api';

// Validation schema for personal information
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'Too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  summary: z.string().min(50, 'Summary should be at least 50 characters').max(500, 'Summary too long')
});

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
    mode: 'onChange' // Validates on every change for real-time feedback
  });

  const { handleSubmit, register, formState: { errors, isValid }, watch, setValue } = form;

  // Watch all form values for real-time updates
  const watchedValues = watch();
  
  // Update parent component whenever form data changes
  React.useEffect(() => {
    onUpdate(watchedValues);
  }, [watchedValues, onUpdate]);

  /**
   * Handle AI enhancement of professional summary
   * Uses Grok API to improve the user's summary
   */
  const handleEnhanceSummary = async () => {
    if (!watchedValues.summary || watchedValues.summary.length < 20) {
      alert('Please write a basic summary first (at least 20 characters)');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancement = await enhanceSummary(
        { firstName: watchedValues.firstName, lastName: watchedValues.lastName },
        [], // We'll pass experience data later when available
        watchedValues.summary
      );
      
      setValue('summary', enhancement.enhanced_content);
      
      // Show suggestions to user
      if (enhancement.suggestions.length > 0) {
        const suggestionText = enhancement.suggestions.join('\n• ');
        alert(`AI Suggestions:\n• ${suggestionText}`);
      }
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance summary. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const onSubmit = (formData: PersonalInfo) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Tell us about yourself. This information will appear at the top of your resume.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="John"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Doe"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john.doe@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone *
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location *
            </Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="New York, NY"
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Optional Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Optional Links</h4>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://yourwebsite.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/johndoe"
                  className={errors.linkedin ? 'border-red-500' : ''}
                />
                {errors.linkedin && (
                  <p className="text-sm text-red-500">{errors.linkedin.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Label>
                <Input
                  id="github"
                  {...register('github')}
                  placeholder="https://github.com/johndoe"
                  className={errors.github ? 'border-red-500' : ''}
                />
                {errors.github && (
                  <p className="text-sm text-red-500">{errors.github.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Professional Summary *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEnhanceSummary}
                disabled={isEnhancing || !watchedValues.summary}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
              </Button>
            </div>
            <Textarea
              id="summary"
              {...register('summary')}
              placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
              rows={4}
              className={errors.summary ? 'border-red-500' : ''}
            />
            {errors.summary && (
              <p className="text-sm text-red-500">{errors.summary.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {watchedValues.summary?.length || 0}/500 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={!isValid}
          >
            Continue to Experience
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}