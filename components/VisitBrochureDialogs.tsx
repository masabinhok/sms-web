"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Users, Download, FileText } from 'lucide-react'
import { scheduleVisit, getBrochureDownloadUrl } from '@/lib/brochure-api'
import { useMessage } from '@/store/messageStore'

interface ScheduleVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleVisitDialog({ open, onOpenChange }: ScheduleVisitDialogProps) {
  const { addMessage } = useMessage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    numberOfVisitors: '1',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await scheduleVisit({
        ...formData,
        numberOfVisitors: parseInt(formData.numberOfVisitors)
      })

      addMessage('Visit scheduled successfully! We will contact you shortly to confirm.', 'success')
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        numberOfVisitors: '1',
        message: ''
      })
    } catch (error) {
      addMessage('Failed to schedule visit. Please try again or contact us directly.', 'error')
      console.error('Schedule visit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-bg-premium border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl text-fg-premium flex items-center gap-3">
            <Calendar className="h-6 w-6 text-accent-primary" />
            Schedule a Campus Visit
          </DialogTitle>
          <DialogDescription className="text-fg-premium-muted text-base">
            Fill out the form below to schedule your visit. We&apos;ll contact you to confirm the details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-fg-premium text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-fg-premium text-sm font-medium">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-fg-premium text-sm font-medium">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfVisitors" className="text-fg-premium text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Visitors
              </Label>
              <Input
                id="numberOfVisitors"
                name="numberOfVisitors"
                type="number"
                min="1"
                value={formData.numberOfVisitors}
                onChange={handleChange}
                className="bg-black/20 border border-white/20 text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-fg-premium text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date *
              </Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                required
                value={formData.preferredDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="bg-black/20 border border-white/20 text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime" className="text-fg-premium text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time *
              </Label>
              <Input
                id="preferredTime"
                name="preferredTime"
                type="time"
                required
                value={formData.preferredTime}
                onChange={handleChange}
                className="bg-black/20 border border-white/20 text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-fg-premium text-sm font-medium">Additional Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any specific areas you'd like to see or questions you have..."
              rows={4}
              className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 resize-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/20 text-fg-premium hover:bg-white/5 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent-primary hover:bg-accent-primary/90 h-11"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
            </Button>
          </div>

          <p className="text-xs text-center text-fg-premium-muted pt-2">
            Note: Template feature. Real deployment will save to database and send confirmation emails.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface BrochureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrochureDialog({ open, onOpenChange }: BrochureDialogProps) {
  const { addMessage } = useMessage()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDownloading(true)

    try {
      // Track the download request
      // In real implementation, this would call the API
      const downloadUrl = getBrochureDownloadUrl()
      
      // Simulate download
      addMessage('Thank you! Your brochure download will begin shortly. Check your email for additional information.', 'success')
      
      // For template: Show message about PDF
      window.open(downloadUrl, '_blank')
      
      onOpenChange(false)
      setEmail('')
      setName('')
    } catch (error) {
      addMessage('Failed to download brochure. Please try again.', 'error')
      console.error('Brochure download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-bg-premium border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl text-fg-premium flex items-center gap-3">
            <FileText className="h-6 w-6 text-accent-primary" />
            Download School Brochure
          </DialogTitle>
          <DialogDescription className="text-fg-premium-muted text-base">
            Get comprehensive information about our programs, facilities, and admission process.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleDownload} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brochure-name" className="text-fg-premium text-sm font-medium">Name</Label>
            <Input
              id="brochure-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brochure-email" className="text-fg-premium text-sm font-medium">Email Address *</Label>
            <Input
              id="brochure-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="bg-black/20 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary h-11"
            />
            <p className="text-xs text-fg-premium-muted mt-2">
              We&apos;ll send you additional resources and information.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-accent-primary mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-fg-premium font-medium mb-2">What&apos;s Included:</p>
                <ul className="text-xs text-fg-premium-muted space-y-1.5">
                  <li>• Academic programs and curriculum details</li>
                  <li>• Campus facilities and infrastructure</li>
                  <li>• Admission requirements and process</li>
                  <li>• Fee structure and scholarships</li>
                  <li>• Extracurricular activities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/20 text-fg-premium hover:bg-white/5 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isDownloading}
              className="flex-1 bg-accent-primary hover:bg-accent-primary/90 h-11"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
          </div>

          <p className="text-xs text-center text-fg-premium-muted pt-2">
            Note: Template feature. Real deployment requires creating a professional PDF brochure.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
