import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {ArrowDown, LocationOutline} from '../../public/assets/images/svg';
import {MainContext} from '../../context/MainContext';
import SearchFilter from '../search-filter';
import UserAvatar from './avatar';
import {setOpenModal} from '../../redux/slices/mainState';
import {Button} from 'reactstrap';
import {parseCookies, setCookie} from 'nookies';
import {setLanguage} from '../../utils/setLanguage';
import {getAddress} from '../../utils/getAddress';
import {AuthContext} from '../../context/AuthContext';
import {useRouter} from 'next/router';
import CustomSelect from '../../components/form/form-item/customSelect';
import informationService from '../../services/informationService';
import {clearViewedList} from '../../redux/slices/viewed-product';

const DefaultAddress = dynamic(() =>
  import('../address-modal/default-address'),
);

const Header = () => {
  const {t: tl} = useTranslation();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const router = useRouter();
  const {userLocation} = useContext(AuthContext);
  const {handleAuth, language} = useContext(MainContext);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [openModal, setModal] = useState(null);
  const [isConfirm, setIsConfirm] = useState(true);
  const [defaultLanguage, setDefaultLanguage] = useState(cookies?.language_id);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const user = useSelector(state => state.user.data, shallowEqual);
  const settings = useSelector(state => state.settings.data, shallowEqual);
  const isEmpty = Object.keys(user ? user : {}).length === 0;

  useEffect(() => {
    getAddress({setDefaultAddress, userLocation, user});
  }, [userLocation]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop < lastScrollTop && scrollTop > 50) {
        // يظهر الـ header عند التمرير للأعلى فقط
        setScrolled(true);
      } else {
        // يخفي الـ header عند التمرير للأسفل
        setScrolled(false);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  const handleOk = e => {
    e.stopPropagation();
    setCookie(null, 'set_location', 'true');
    setIsConfirm(true);
    router.push('/');
  };

  const handleAnother = e => {
    e.stopPropagation();
    setModal(prev => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfirm(cookies.set_location);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const languageList = () => {
    const array = [];
    language.forEach(element => {
      array.push({
        value: element.id,
        label: element.title,
        img: element.img,
        ...element,
      });
    });
    return array;
  };

  const handleLanguae = e => {
    const body = document.getElementsByTagName('body');
    const {locale} = e;
    setDefaultLanguage(e.id);
    setLanguage(e);
    if (e.backward) {
      body[0].setAttribute('dir', 'rtl');
      setCookie(null, 'dir', 'rtl');
    } else {
      body[0].setAttribute('dir', 'ltr');
      setCookie(null, 'dir', 'ltr');
    }
    informationService
      .translations({lang: locale})
      .then(({data}) => {
        i18n.addResourceBundle(locale, 'translation', data.data);
        i18n.changeLanguage(locale);
      })
      .finally(() => {
        router.reload();
      });
    dispatch(clearViewedList());
  };

  return (
    <div className={`container header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header">
        <Link href="/">
          <a className="logo">{settings?.title || 'Company logo'}</a>
        </Link>
        <div className="header-content">
          <div className="address" onClick={e => handleAnother(e)}>
            <div className="suffix location">
              <LocationOutline />
            </div>
            <span>{defaultAddress?.address || 'Default address'}</span>
            <div className="suffix arrow">
              <ArrowDown />
            </div>
            {!isConfirm && (
              <div className="confirm-address">
                <div className="label">Order to the address</div>
                <div className="name">
                  {defaultAddress?.address || 'Default address'}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Button onClick={e => handleAnother(e)}>Another</Button>
                  </div>
                  <div className="col-md-6" onClick={e => handleOk(e)}>
                    <Button color="success" className="submit">
                      Yes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <SearchFilter />
          <UserAvatar />
          {isEmpty && (
            <div className="btn login_btn" onClick={() => handleAuth('login')}>
              {tl('login')}
            </div>
          )}
          <div className="address">
            <CustomSelect
              options={languageList()}
              onChange={handleLanguae}
              value={defaultLanguage}
              placeholder="Language"
            />
          </div>
        </div>
      </div>
      <DefaultAddress
        openModal={openModal}
        setOpenModal={setModal}
        setIsConfirm={setIsConfirm}
      />
    </div>
  );
};

export default Header;
