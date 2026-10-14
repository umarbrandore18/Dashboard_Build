import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Merchant } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle2, Building2, ArrowRight, Users2, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface Step7SubmitSuccessProps {
  merchant: Merchant;
}

export const Step7SubmitSuccess: React.FC<Step7SubmitSuccessProps> = ({ merchant }) => {
  const navigate = useNavigate();

  return (
    <div className="py-6 max-w-xl mx-auto">
      <Card className="border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white text-center shadow-lg">
        <CardContent className="p-8 sm:p-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <Badge status={merchant.status} size="md" className="mb-3">
            {merchant.status}
          </Badge>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Merchant submitted for review
          </h2>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
            The merchant application has been submitted. You can review its status from Merchant Management.
          </p>

          {/* Dossier Confirmation Card */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Assigned Merchant ID:</span>
              <span className="font-mono font-bold text-slate-900">{merchant.id}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Legal Entity Name:</span>
              <span className="font-semibold text-slate-900">{merchant.name}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Registration Number:</span>
              <span className="font-mono text-slate-800">{merchant.registrationNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Operating Corridors:</span>
              <span className="font-semibold text-blue-700">
                {merchant.operatingCountries.map((c) => c.countryCode).join(', ')}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-amber-900 text-[11px] text-left mb-6 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Compliance Protocol:</strong> In accordance with payment gateway regulations, the merchant is placed in <em>Under Review</em> status pending KYC/KYB approval. Live processing will be enabled upon risk desk clearance.
            </span>
          </div>

          {/* Primary & Secondary Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Users2 className="w-4 h-4 text-slate-500" />}
              onClick={() => navigate('/merchants')}
              className="w-full sm:w-auto text-xs"
            >
              Back to merchants
            </Button>

            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate(`/merchants/${merchant.id}`)}
              className="w-full sm:w-auto text-xs"
            >
              View merchant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

