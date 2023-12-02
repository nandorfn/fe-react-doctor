import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ProfileSkeleton } from '../ui/Skeleton/ProfileSkeleton';
import ImageWithFallback from '../Error/ImageWithFallback';

import logoutIcon from '../../assets/icon/logout.svg';
import brandLogo from '../../assets/icon/brandLogo.png'
import { menus } from '../../utils/dataObject';
import doctorMale from '../../assets/icon/9432602.jpg'
import doctorFemale from '../../assets/icon/maleDoc.jpg'
import './Sidebar.css'
import { useGetQuery } from '../../hooks/useGetQuery';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Transparent } from '../ui/Container';
import { CustomModal } from '../ui/Modal/Modal';

const ProfileDoctor = () => {
  const {
    data,
    isPending,
    isError,
    refetch
  } = useGetQuery('profile', '/doctors/profile');
  
  if (isError) {
    return (
      <div className='d-flex flex-column gap-2 my-5 justify-content-center'>
        <p>Gagal memuat data</p>
        <Button
          className={'btn-primary text-white'}
          onClick={() => refetch()}>
          {'Coba Lagi!'}
        </Button>
      </div>
    );
  }


  if (isPending) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <figure className='figure d-flex'>
        <ImageWithFallback
          src={data?.results?.profile_picture}
          fallback={data?.results?.gender === 'male' ? doctorMale : doctorFemale}
          className='avatar object-fit-cover'
          alt="Profile Picture"
          width={100}
          height={100}
        />
        <div className='text-center'>
          <h5 className='mt-2 fs-2 fw-semibold'>{data?.results?.fullname}</h5>
          <p className='text-capitalize'>{data?.results?.specialist}</p>
        </div>
      </figure>
      <div className='d-inline-flex gap-2'>
        <p className='border-end border-secondary border-1 pe-2'>Jam Operasional</p>
        <p>09:00 - 17:00</p>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [modal, setModal] = useState(false)
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('token');
    navigate(0)
  }
  
  return (
    <>
      <aside className='sidebar'>
        <img
          src={brandLogo}
          width={'161'}
          alt="Healthify" />
        <ProfileDoctor />
        <ul className='list-group gap-2 mt-4'>
          {menus?.map((item, index) => {
            return (
              <li key={index} className={`list-unstyled`}>
                <NavLink to={item.link} className='text-decoration-none'>
                  {({ isActive }) => (
                    <div className={`${isActive && 'btn-primary text-white'} d-flex navBtn btn`}>
                      <img
                        src={
                          isActive
                            ? item.icon2
                            : item.icon
                        }
                        width={'24'}
                        alt={item.label}
                      />
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
        {modal &&
          <Transparent
            className='min-vw-100 position-fixed end-0'
          >
            <CustomModal
              title={'Ingin Keluar?'}
              content={'Apabila anda keluar maka anda tidak dapat menerima pasien.'}
              confirmAction={handleLogout}
              cancelAction={() => setModal(false)}
            />
          </Transparent>
        }
        
        {/* Button Logout  */}
        <Button onClick={() => setModal(true)} className='btnWrapper'>
          <div className='logout-btn d-flex'>
            <p>Logout</p>
            <img src={logoutIcon} alt='Logout' />
          </div>
        </Button>
      </aside>
    </>
  )
}
