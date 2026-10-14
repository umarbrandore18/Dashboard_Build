import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OperationalIssue } from '@/types';
import { AlertTriangle, AlertCircle, ArrowRight, Clock, Building2 } from 'lucide-react';
import { formatRelativeTime, getCountryFlag } from '@/utils/formatters';

interface AttentionRequiredProps {
  issues: OperationalIssue[];
}

export const AttentionRequired: React.FC<AttentionRequiredProps> = ({ issues }) => {
  const navigate = useNavigate();

  return (
    <Card className="hoverable border-amber-200/70 bg-gradient-to-b from-amber-50/20 to-white">
      <CardHeader className="flex-row items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Attention Required</CardTitle>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {issues.length} Operational Items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active anomalies requiring operations desk triage or merchant follow-up
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="divide-y divide-slate-100">
          {issues.map((issue) => {
            const isCritical = issue.severity === 'critical';

            return (
              <div
                key={issue.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-0.5 shrink-0">
                    {isCritical ? (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {issue.title}
                      </h4>
                      <Badge
                        variant={isCritical ? 'error' : 'warning'}
                        size="sm"
                      >
                        {isCritical ? 'Critical' : 'Degraded'}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <span>{getCountryFlag(issue.affectedMarket)}</span>
                        <span>{issue.marketName}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        Impact: {issue.impactMetric}
                      </span>

                      {issue.affectedMerchant && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium">{issue.affectedMerchant}</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatRelativeTime(issue.timestamp)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold border-slate-300 hover:border-blue-500 hover:text-blue-600 whitespace-nowrap"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => navigate(issue.actionRoute)}
                  >
                    {issue.nextActionLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

