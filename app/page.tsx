/**
 * Main Application Page
 * Entry point for the Resume Builder application
 * 
 * This component renders the main ResumeBuilder interface
 * with all its features and functionality
 */

import { ResumeBuilder } from '@/components/ResumeBuilder';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ResumeBuilder />
    </main>
  );
}