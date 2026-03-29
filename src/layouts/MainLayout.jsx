import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingAssistant from '../components/FloatingAssistant';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';

function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={pp-shell }>
      <Navbar theme={theme} toggleTheme={toggleTheme} locale={locale} setLocale={setLocale} t={t} />
      <div className='layout-grid'>
        <aside className='sidebar'>
          <NavLink to='/' className='sidebar-link'>
            {t('dashboard')}
          </NavLink>
          <NavLink to='/notes' className='sidebar-link'>
            {t('notes')}
          </NavLink>
          <NavLink to='/analytics' className='sidebar-link'>
            {t('analytics')}
          </NavLink>
        </aside>
        <main className='content-area'>
          <Outlet />
        </main>
      </div>
      <FloatingAssistant t={t} />
    </div>
  );
}

export default MainLayout;
