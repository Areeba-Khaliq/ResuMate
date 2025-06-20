/**
 * Experience Form Component
 * Handles work experience entries with AI enhancement capabilities
 * 
 * Features:
 * - Add/edit/remove work experiences
 * - Date validation and formatting
 * - AI-powered description enhancement
 * - Dynamic form fields
 */

'use client'

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Trash2, Sparkles, Calendar } from 'lucide-react';
import { Experience } from '@/types/resume';
import { enhanceExperience } from '@/lib/grok-api';

// Validation schema for experience entries
const experienceSchema = z.object({
  experience: z.array(z.object({
    id: z.string(),
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.array(z.string().min(1, 'Description cannot be empty')),
    location: z.string().min(1, 'Location is required')
  })).min(1, 'At least one work experience is required')
});

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ExperienceForm({ data, onUpdate, onNext, onPrevious }: ExperienceFormProps) {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  
  const form = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experience: data.length > 0 ? data : [{
        id: crypto.randomUUID(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: [''],
        location: ''
      }]
    },
    mode: 'onChange'
  });

  const { control, handleSubmit, register, formState: { errors }, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  const watchedExperience = watch('experience');
  
  // Update parent component when data changes
  React.useEffect(() => {
    onUpdate(watchedExperience);
  }, [watchedExperience, onUpdate]);

  /**
   * Add new experience entry
   */
  const addExperience = () => {
    append({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
      location: ''
    });
  };

  /**
   * Add new description bullet point to an experience
   */
  const addDescription = (expIndex: number) => {
    const currentDescriptions = watchedExperience[expIndex].description;
    setValue(`experience.${expIndex}.description`, [...currentDescriptions, '']);
  };

  /**
   * Remove description bullet point
   */
  const removeDescription = (expIndex: number, descIndex: number) => {
    const currentDescriptions = watchedExperience[expIndex].description;
    if (currentDescriptions.length > 1) {
      const newDescriptions = currentDescriptions.filter((_, i) => i !== descIndex);
      setValue(`experience.${expIndex}.description`, newDescriptions);
    }
  };

  /**
   * Handle AI enhancement of job descriptions
   */
  const handleEnhanceExperience = async (expIndex: number) => {
    const experience = watchedExperience[expIndex];
    
    if (!experience.position || !experience.company || experience.description.every(desc => !desc.trim())) {
      alert('Please fill in the position, company, and at least one description before enhancing.');
      return;
    }

    setEnhancingIndex(expIndex);
    try {
      const enhancement = await enhanceExperience(
        experience.position,
        experience.company,
        experience.description.filter(desc => desc.trim())
      );
      
      // Split enhanced content into bullet points
      const enhancedDescriptions = enhancement.enhanced_content
        .split('\n')
        .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
        .filter(line => line.length > 0);
      
      setValue(`experience.${expIndex}.description`, enhancedDescriptions);
      
      // Show suggestions
      if (enhancement.suggestions.length > 0) {
        console.log('AI Suggestions:', enhancement.suggestions);
      }
      
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance descriptions. Please try again.');
    } finally {
      setEnhancingIndex(null);
    }
  };

  const onSubmit = (formData: { experience: Experience[] }) => {
    onUpdate(formData.experience);
    onNext();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Work Experience
        </CardTitle>
        <CardDescription>
          Add your work experience, starting with your most recent position.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, expIndex) => (
            <Card key={field.id} className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline" className="mb-2">
                  Experience #{expIndex + 1}
                </Badge>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(expIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Company and Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      {...register(`experience.${expIndex}.company`)}
                      placeholder="Google"
                      className={errors.experience?.[expIndex]?.company ? 'border-red-500' : ''}
                    />
                    {errors.experience?.[expIndex]?.company && (
                      <p className="text-sm text-red-500">
                        {errors.experience[expIndex]?.company?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      {...register(`experience.${expIndex}.position`)}
                      placeholder="Software Engineer"
                      className={errors.experience?.[expIndex]?.position ? 'border-red-500' : ''}
                    />
                    {errors.experience?.[expIndex]?.position && (
                      <p className="text-sm text-red-500">
                        {errors.experience[expIndex]?.position?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input
                    {...register(`experience.${expIndex}.location`)}
                    placeholder="San Francisco, CA"
                    className={errors.experience?.[expIndex]?.location ? 'border-red-500' : ''}
                  />
                  {errors.experience?.[expIndex]?.location && (
                    <p className="text-sm text-red-500">
                      {errors.experience[expIndex]?.location?.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Date *
                    </Label>
                    <Input
                      type="month"
                      {...register(`experience.${expIndex}.startDate`)}
                      className={errors.experience?.[expIndex]?.startDate ? 'border-red-500' : ''}
                    />
                    {errors.experience?.[expIndex]?.startDate && (
                      <p className="text-sm text-red-500">
                        {errors.experience[expIndex]?.startDate?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      {...register(`experience.${expIndex}.endDate`)}
                      disabled={watchedExperience[expIndex]?.current}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${expIndex}`}
                      {...register(`experience.${expIndex}.current`)}
                    />
                    <Label htmlFor={`current-${expIndex}`} className="text-sm">
                      Currently working here
                    </Label>
                  </div>
                </div>

                {/* Job Descriptions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Job Description *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEnhanceExperience(expIndex)}
                      disabled={enhancingIndex === expIndex}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {enhancingIndex === expIndex ? 'Enhancing...' : 'AI Enhance'}
                    </Button>
                  </div>
                  
                  {watchedExperience[expIndex]?.description.map((_, descIndex) => (
                    <div key={descIndex} className="flex items-start gap-2">
                      <div className="flex-1">
                        <Textarea
                          {...register(`experience.${expIndex}.description.${descIndex}`)}
                          placeholder="• Describe your responsibilities and achievements..."
                          rows={2}
                        />
                      </div>
                      {watchedExperience[expIndex]?.description.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDescription(expIndex, descIndex)}
                          className="text-red-500 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addDescription(expIndex)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Bullet Point
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Experience
          </Button>

          <Separator />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button type="submit">
              Continue to Education
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}