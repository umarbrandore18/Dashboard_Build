import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, ArrowLeft, LayoutDashboard, Users2, ShieldCheck } from 'lucide-react';

interface PlaceholderProps {
  moduleName: string;
  category: string;
  plannedBatch?: string;
  scopeSummary?: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({
  moduleName,
  category,
  plannedBatch = 'MVP Batch 2',
  scopeSummary,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {category}
            </span>
            <span className="text-slate-300">•</span>
            <Badge variant="purple" size="sm">
              {plannedBatch} Roadmap
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{moduleName}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise orchestration module scheduled for subsequent deployment phase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<LayoutDashboard className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Roadmap Notice Card */}
      <Card className="border-slate-200">
        <CardContent className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-5 shadow-sm">
            <Clock className="w-7 h-7" />
          </div>

          <Badge variant="purple" size="md" className="mb-3">
            Module Scheduled: {plannedBatch}
          </Badge>

          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {moduleName} Module Under Planned Development
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">
            {scopeSummary ||
              `In accordance with MVP Batch 1 specifications, detailed workflows for ${moduleName} are deliberately omitted to preserve product integrity and prevent mock workflows. Operational navigation is retained to validate end-to-end routing hierarchy.`}
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-left text-xs text-slate-600 space-y-2 mb-6">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Current Batch Scope (Batch 1):</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 text-[11px]">
              <li><strong>Global Dashboard:</strong> Real-time KPIs, multi-range interactive charts, health matrix, and country performance.</li>
              <li><strong>Merchant Management:</strong> Live roster, filtering, sorting, pagination, CSV exports, and profile inspections.</li>
              <li><strong>7-Step Merchant Onboarding:</strong> Multi-country capability setup, duplicate validation, and draft persistence.</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Users2 className="w-4 h-4" />}
              onClick={() => navigate('/merchants')}
            >
              Explore Merchant Management
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
            >
              Open Global Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

