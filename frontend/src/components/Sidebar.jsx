/**
 * Sidebar.jsx — Alerts bell + Settings panel
 */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Stethoscope, PawPrint,
  ChevronLeft, ChevronRight, Bell, Settings,
} from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import PetSwitcher    from './PetSwitcher';
import AlertsPanel    from './AlertsPanel';
import SettingsPanel  from './SettingsPanel';
import { usePet }     from '../context/PetContext';
import { useTheme }   from '../context/ThemeContext';
import { getLogsByPet, getRecordsByPet } from '../api/petApi';

const navItems = [
  { to: '/',        Icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/logs',    Icon: ClipboardList,   label: 'Daily Logs'      },
  { to: '/records', Icon: Stethoscope,     label: 'Medical Records' },
  { to: '/pets',    Icon: PawPrint,        label: 'My Pets'         },
];



export default function Sidebar() {
  const { activePet } = usePet();
  const { theme }     = useTheme();
  const [collapsed,    setCollapsed]   = useState(false);
  const [showAlerts,   setShowAlerts]  = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [logs,        setLogs]        = useState([]);
  const [records,     setRecords]     = useState([]);

  /* ── Pre-fetch logs + records for alert count ─────────── */
  useEffect(() => {
    if (!activePet?._id) { setLogs([]); setRecords([]); return; }
    Promise.all([
      getLogsByPet(activePet._id),
      getRecordsByPet(activePet._id),
    ]).then(([l, r]) => {
      setLogs(l.data);
      setRecords(r.data);
    }).catch(() => {});
  }, [activePet?._id]);

  /* ── Alert badge count ────────────────────────────────── */
  const now = new Date();
  let alertCount = 0;
  records.forEach(r => {
    if (r.status !== 'upcoming') return;
    try {
      const days = differenceInDays(parseISO(r.date), now);
      if (days <= 7) alertCount++;
    } catch {}
  });
  const missedMed = logs.slice(0, 7).filter(l => !l.medicationGiven);
  if (missedMed.length >= 3) alertCount++;
  const wh = activePet?.weightHistory || [];
  if (wh.length > 0) {
    try {
      const daysSince = differenceInDays(now, parseISO(wh[wh.length - 1].date));
      if (daysSince >= 30) alertCount++;
    } catch {}
  }

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-20"
        style={{
          width: collapsed ? '72px' : '240px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 mb-1"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-soft"
            style={{ background: 'linear-gradient(135deg,#14b8a6,#2dd4bf)' }}
          >
            <PawPrint size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight" style={{ color: '#e2fdf9' }}>
              Pet<span style={{ color: '#2dd4bf' }}>Passport</span>
            </span>
          )}
        </div>

        {/* Pet Switcher */}
        <PetSwitcher collapsed={collapsed} />

        {/* Nav Links */}
        <nav className="flex-1 px-2 py-2 space-y-1">
          {navItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                 ${isActive ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:bg-white/6 hover:text-white'}`
              }
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-teal-300' : ''}`} />
                  {!collapsed && <span className="text-sm font-medium">{label}</span>}
                  {!collapsed && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#2dd4bf' }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Alerts bell with badge */}
          <button
            onClick={() => setShowAlerts(true)}
            className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/6 hover:text-white transition-all"
            title="Alerts"
          >
            <div className="relative flex-shrink-0">
              <Bell size={20} />
              {alertCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-[9px] font-extrabold text-white flex items-center justify-center px-0.5"
                  style={{ background: '#e11d48' }}
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </div>
            {!collapsed && <span className="text-sm font-medium">Alerts</span>}
            {!collapsed && alertCount > 0 && (
              <span className="ml-auto pill text-[10px]" style={{ background: '#ffe4e6', color: '#e11d48' }}>
                {alertCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/6 hover:text-white transition-all"
            title="Settings"
          >
            <Settings size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white/6 hover:text-white transition-all mt-2"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight size={20} />
              : <><ChevronLeft size={20} /><span className="text-sm font-medium">Collapse</span></>
            }
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2"
        style={{ background: 'var(--bg-sidebar)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {navItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${isActive ? 'text-teal-400' : 'text-slate-400'}`
            }
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={isActive ? 'text-teal-400' : ''} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
        {/* Mobile alerts bell */}
        <button
          onClick={() => setShowAlerts(true)}
          className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-slate-400"
        >
          <div className="relative">
            <Bell size={20} />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: '#e11d48' }}>
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </button>
      </nav>

      {/* ── Alerts Panel Drawer ──────────────────────────────── */}
      {showAlerts && (
        <AlertsPanel
          onClose={() => setShowAlerts(false)}
          logs={logs}
          records={records}
        />
      )}

      {/* ── Settings Panel Drawer ─────────────────────────────── */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
