import mailIcon from '../../assets/icon/mail-fill.svg';
import notifIcon from '../../assets/icon/notif.svg';
import { Link, useLocation } from 'react-router-dom';
import { navbarTitle } from '../../utils/dataObject';
import './Navbar.css'
import { useStatus } from '../../store/useStatus';

export const Navbar = () => {
  // Global State
  const isActive = useStatus((state) => state.isActive);
  const handleStatus = useStatus((state) => state.handleStatus);
  
  
  // Buat render title dan content secara dinamis berdasarkan rute
  const location = useLocation();
  const currentRoute = location.pathname.split('/')[1];
  const currentNavItem = navbarTitle.find((item) => item.route === currentRoute);
  return (

    <header className='navbar p-0'>
      <nav className='navbar-content'>
        <div >
          <h5 className='fw-semibold m-0 text-secondary'>
            {
              currentNavItem
                ? currentNavItem.title
                : null
            }
          </h5>
        </div>

        <div className='d-flex flex-row-reverse  flex-md-column pe-md-0'>
          <div className='d-flex align-items-center gap-4'>
            <div className="form-switch form-check-reverse gap-3">
              <label 
                className="form-check-label fw-semibold d-none d-md-inline-block" 
                htmlFor="isActiveSwitchCheck">
                {isActive ? 'Aktif' : 'Tidak Melayani'}
              </label>
              <input
                className="form-check-input"
                value={isActive}
                checked={isActive}
                onChange={handleStatus}
                type="checkbox"
                role="switch"
                id="isActiveSwitchCheck"
                style={{ transform: 'scale(1.8)'}}
              />
            </div>
            <Link to={'/feedback'}>
              <img src={notifIcon} className='icon-size' alt='Notification' />
            </Link>
            <img src={mailIcon} className='icon-size' alt='Search' />
          </div>
        </div>

      </nav>
    </header>
  )
}


