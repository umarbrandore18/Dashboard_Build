import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  ArrowDownToLine,
  ArrowUpFromLine,
  Landmark,
  Receipt,
  CreditCard,
  Network,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ElementType;
  isImplemented: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();

  const navigationSections: { section: string; items: NavItem[] }[] = [
    {
      section: 'Core Operations',
      items: [
        {
          name: 'Dashboard',
          to: '/dashboard',
          icon: LayoutDashboard,
          isImplemented: true,
        },
        {
          name: 'Merchants',
          to: '/merchants',
          icon: Users2,
          isImplemented: true,
        },
      ],
    },
    {
      section: 'Money Movement',
      items: [
        {
          name: 'Pay-ins',
          to: '/payins',
          icon: ArrowDownToLine,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Payouts',
          to: '/payouts',
          icon: ArrowUpFromLine,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Settlements',
          to: '/settlements',
          icon: Landmark,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Transactions',
          to: '/transactions',
          icon: Receipt,
          isImplemented: false,
          badge: 'Batch 2',
        },
      ],
    },
    {
      section: 'Platform & Routing',
      items: [
        {
          name: 'Payment Methods',
          to: '/payment-methods',
          icon: CreditCard,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Hosts & Routing',
          to: '/hosts-routing',
          icon: Network,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Reports',
          to: '/reports',
          icon: FileBarChart2,
          isImplemented: false,
          badge: 'Batch 2',
        },
        {
          name: 'Settings',
          to: '/settings',
          icon: Settings,
          isImplemented: false,
          badge: 'Batch 2',
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A1120] text-slate-300 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 font-bold text-lg">
            M
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">Mobi</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                  Global Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Payments Orchestration</p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Product Principle Banner */}
      {!collapsed && (
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 leading-tight">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Unified Gateway</span>
          </div>
          Integrate once. Operate globally.
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none">
        {navigationSections.map((sec) => (
          <div key={sec.section}>
            {!collapsed && (
              <h4 className="px-2 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                {sec.section}
              </h4>
            )}
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isExactActive =
                  location.pathname === item.to ||
                  (item.to === '/merchants' && location.pathname.startsWith('/merchants'));

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => mobileOpen && onMobileClose()}
                    className={cn(
                      'group flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative',
                      isExactActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850 hover:bg-slate-800/60',
                      collapsed && 'justify-center px-0'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isExactActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {!item.isImplemented && item.badge && (
                          <span
                            className={cn(
                              'text-[10px] px-1.5 py-0.2 rounded font-medium border',
                              isExactActive
                                ? 'bg-blue-700/80 text-blue-100 border-blue-500'
                                : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070c17] shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gateway Live (v1.0.4)</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              Demo Env
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Gateway Live">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block transition-all duration-200 shrink-0 z-30 sticky top-0 h-screen',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

