import { Calendar, Shield, Zap, Users, Mail, Globe } from 'lucide-react';
import { Card, CardContent } from '../components/Card';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans">
      <div className="text-center mb-16">
        <div className="bg-lavender-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-lavender-200 hover:scale-110 transition-transform duration-300">
          <Calendar className="w-10 h-10 text-lavender-600" />
        </div>
        <h1 className="text-4xl font-black text-lavender-950 mb-4 tracking-tight">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-500 to-lavender-600">Auto-Meet</span></h1>
        <p className="text-xl text-lavender-700 max-w-2xl mx-auto leading-relaxed">
          Auto-Meet is a beautiful, AI-driven meeting management platform designed to streamline your scheduling and follow-up process smoothly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="border border-lavender-100 shadow-[0_20px_35px_-12px_rgba(155,89,182,0.15)] bg-white hover:-translate-y-2 transition-all duration-500">
          <CardContent className="p-10">
            <div className="bg-lavender-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-lavender-100">
              <Zap className="w-8 h-8 text-lavender-500" />
            </div>
            <h3 className="text-2xl font-bold text-lavender-950 mb-4">Our Mission</h3>
            <p className="text-lavender-700 leading-relaxed text-lg">
              We believe that meetings should be productive, not a chore. Our mission is to automate the administrative overhead of scheduling and summarizing meetings, allowing teams to focus on what truly matters: collaboration and innovation.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-lavender-100 shadow-[0_20px_35px_-12px_rgba(155,89,182,0.15)] bg-white hover:-translate-y-2 transition-all duration-500">
          <CardContent className="p-10">
            <div className="bg-lavender-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-lavender-200">
              <Shield className="w-8 h-8 text-lavender-600" />
            </div>
            <h3 className="text-2xl font-bold text-lavender-950 mb-4">Privacy & Security</h3>
            <p className="text-lavender-700 leading-relaxed text-lg">
              Your data security is our top priority. Auto-Meet uses industry-standard OAuth 2.0 for secure Google integration and stores your meeting data strictly in your connected DB, ensuring unparalleled privacy and peace of mind.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-lavender-500 to-lavender-700 rounded-[3rem] p-12 md:p-16 text-white mb-16 shadow-[0_25px_40px_-12px_rgba(155,89,182,0.4)] relative overflow-hidden">
        {/* Soft abstract decorators */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lavender-300 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <h2 className="text-4xl font-black mb-12 text-center relative z-10">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          <div className="flex gap-5 hover:bg-white/10 p-4 rounded-2xl transition-colors">
            <div className="bg-white/20 p-4 rounded-2xl h-fit backdrop-blur-sm border border-white/10">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">Smart Scheduling</h4>
              <p className="text-lavender-100 text-base leading-relaxed">Instant Google Meet link generation and perfect automatic calendar syncing.</p>
            </div>
          </div>
          <div className="flex gap-5 hover:bg-white/10 p-4 rounded-2xl transition-colors">
            <div className="bg-white/20 p-4 rounded-2xl h-fit backdrop-blur-sm border border-white/10">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">Auto Invitations</h4>
              <p className="text-lavender-100 text-base leading-relaxed">Automatically send completely formatted invites to all requested attendees.</p>
            </div>
          </div>
          <div className="flex gap-5 hover:bg-white/10 p-4 rounded-2xl transition-colors">
            <div className="bg-white/20 p-4 rounded-2xl h-fit backdrop-blur-sm border border-white/10">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-2">AI Summaries</h4>
              <p className="text-lavender-100 text-base leading-relaxed">Leverage the fastest Groq AI tech to pull beautiful summaries instantly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-lavender-200 pt-16">
        <h2 className="text-2xl font-black text-lavender-950 mb-6">Designed with ❤️ for Productivity</h2>
        <div className="flex justify-center gap-8 text-lavender-600 font-medium">
          <a href="#" className="hover:text-lavender-800 hover:scale-105 transition-all flex items-center gap-2">
            <Globe className="w-5 h-5" /> Visit Site
          </a>
          <a href="#" className="hover:text-lavender-800 hover:scale-105 transition-all flex items-center gap-2">
            <Mail className="w-5 h-5" /> Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
