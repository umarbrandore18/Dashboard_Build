import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
  isFuturePhase?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-slate-200 overflow-x-auto scrollbar-none', className)}>
      <nav className="flex space-x-6 min-w-max px-1" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'group inline-flex items-center py-3 px-1 border-b-2 font-medium text-xs transition-colors duration-150 relative select-none',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab.label}</span>
              {tab.isFuturePhase && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-100 rounded border border-slate-200/60">
                  Batch 2
                </span>
              )}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-2 py-0.5 px-1.5 rounded-full text-[10px] font-semibold',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

