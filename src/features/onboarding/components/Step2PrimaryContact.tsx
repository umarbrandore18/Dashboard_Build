import React from 'react';
import { Input } from '@/components/ui/Input';
import { OnboardingFormData } from '@/types';
import { Mail, Phone, User, Briefcase } from 'lucide-react';

interface Step2Props {
  data: OnboardingFormData;
  onChange: (updates: Partial<OnboardingFormData>) => void;
  errors: Record<string, string>;
}

export const Step2PrimaryContact: React.FC<Step2Props> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900">Primary Operational Contact</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Designate the authorized representative responsible for technical integration, compliance, and settlement communications.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Name */}
        <div>
          <Input
            label="Full Representative Name"
            required
            placeholder="e.g. Jonathan Lee / Sarah Tan"
            value={data.contactName}
            onChange={(e) => onChange({ contactName: e.target.value })}
            error={errors.contactName}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Job Title */}
        <div>
          <Input
            label="Job Title / Role"
            required
            placeholder="e.g. Head of Treasury / Operations Director"
            value={data.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            error={errors.jobTitle}
            leftIcon={<Briefcase className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Work Email */}
        <div>
          <Input
            label="Corporate Work Email"
            type="email"
            required
            placeholder="name@company.com"
            value={data.workEmail}
            onChange={(e) => onChange({ workEmail: e.target.value })}
            error={errors.workEmail}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            helperText="Operational notifications and API key alerts will be sent here."
          />
        </div>

        {/* Phone Number */}
        <div>
          <Input
            label="Direct Contact Phone Number"
            type="tel"
            required
            placeholder="e.g. +60 12-345 6789 or +62 811 234 567"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            error={errors.phone}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            helperText="Include country calling code (+60, +62, +91)."
          />
        </div>
      </div>
    </div>
  );
};

