import React from 'react';
import { Link, useNavigate } from 'react-router-dom'

// Import From React Bootstrap
import { Col, Container, Dropdown, Nav, Navbar, Row } from 'react-bootstrap'

// Import selectors & action from setting store
import * as SettingSelector from '../../../store/setting/selectors'

// Redux Selector / Action
import { useSelector } from 'react-redux';

// Import Language Context
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { useAuth } from '../../../context/AuthContext';

// Import Image
import flag01 from "/assets/images/small/flag-01.png"
import flag02 from "/assets/images/small/flag-02.png"
import flag03 from "/assets/images/small/flag-03.png"
import flag04 from "/assets/images/small/flag-04.png"
import flag05 from "/assets/images/small/flag-05.png"
import flag06 from "/assets/images/small/flag-06.png"

import user01 from "/assets/images/user/01.jpg"
import user02 from "/assets/images/user/02.jpg"
import user03 from "/assets/images/user/03.jpg"
import user04 from "/assets/images/user/04.jpg"

import user001 from "/assets/images/user/001.png"

const Header = () => {

   const navigate = useNavigate();
   const { logout } = useAuth();
   const { currentLanguage, changeLanguage, t, languages } = useLanguage();
   const pageLayout = useSelector(SettingSelector.page_layout)
   const { pageTitle } = useSelector(state => state.setting)

   const [open, setOpen] = React.useState(false)
   const [isScrolled, setIsScrolled] = React.useState(false);

   React.useEffect(() => {
      const handleScrolld = () => {
         if (window.scrollY >= 75) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }
      };

      window.addEventListener('scroll', handleScrolld);

      // Cleanup event listener on component unmount
      return () => {
         window.removeEventListener('scroll', handleScrolld);
      };
   }, [])

   // Fullscreen Functionality
   const [isFullScreen, setIsFullScreen] = React.useState(false);

   const toggleFullScreen = () => {
      if (!document.fullscreenElement &&
         !document.mozFullScreenElement &&
         !document.webkitFullscreenElement &&
         !document.msFullscreenElement) {
         // Request fullscreen
         if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
         } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
         } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
         } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
         }
         setIsFullScreen(true);
      } else {
         // Exit fullscreen
         if (document.exitFullscreen) {
            document.exitFullscreen();
         } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
         } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
         } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
         }
         setIsFullScreen(false);
      }
   };


   const handleSidebar = () => {
      let aside = document.getElementsByTagName("ASIDE")[0];
      if (aside) {
         if (!aside.classList.contains('sidebar-mini')) {
            aside.classList.toggle("sidebar-mini");
            aside.classList.toggle("sidebar-hover");
         } else {
            aside.classList.remove("sidebar-mini")
            aside.classList.remove("sidebar-hover");
         }

         if (window.innerWidth < 990) {
            if (!aside.classList.contains('sidebar-mini')) {
               aside.classList.remove("sidebar-mini")
               aside.classList.toggle("sidebar-hover");
            }
         }
      }
   }

   const handleLogout = () => {
      logout();
      navigate('/auth/sign-in');
   };

   const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
         href="#"
         ref={ref}
         onClick={(e) => {
            e.preventDefault();
            onClick(e);
         }}
         className="nav-link py-0 d-flex align-items-center"
      >
         {children}
      </a>
   ));

   return (
      <>
         <Navbar expand="xl" className={`nav iq-navbar ${isScrolled ? 'fixed-top' : ''}`}>
            <Container fluid className="navbar-inner">
               <Row className="flex-grow-1">
                  <Col lg={4} md={6} className="align-items-center d-flex">
                     <div className="d-flex align-items-center">
                        <h2 className="mb-0" style={{ 
                           fontWeight: "600", 
                           background: "linear-gradient(135deg, #3a57e8 0%, #2b76ff 100%)",
                           WebkitBackgroundClip: "text",
                           WebkitTextFillColor: "transparent",
                           letterSpacing: "0.5px",
                           fontSize: "28px"
                        }}>
                           Medi<span style={{ fontWeight: "700" }}>Xscan</span>
                        </h2>
                        <span className="ms-2 badge bg-primary-subtle text-primary" style={{ fontSize: "10px", padding: "4px 8px", borderRadius: "4px" }}>
                           Medical AI
                        </span>
                     </div>
                  </Col>
                  <Col lg={8} md={6}
                     className="d-flex justify-content-end align-items-center">
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-flex align-items-center"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <img src={
                              currentLanguage === 'en' ? flag01 :
                              currentLanguage === 'fr' ? flag02 :
                              currentLanguage === 'es' ? flag03 :
                              currentLanguage === 'it' ? flag04 :
                              currentLanguage === 'de' ? flag05 :
                              currentLanguage === 'ja' ? flag06 : flag01
                            }
                               alt="img-flag" className="img-fluid me-1"
                               style={{ height: "20px", width: "20px" }} /> 
                           <span>{
                              currentLanguage === 'en' ? 'English' :
                              currentLanguage === 'fr' ? 'French' :
                              currentLanguage === 'es' ? 'Spanish' :
                              currentLanguage === 'it' ? 'Italian' :
                              currentLanguage === 'de' ? 'German' :
                              currentLanguage === 'ja' ? 'Japanese' : 'English'
                            }</span> <i className="ri-arrow-down-s-line ms-1"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="div" drop={'end'} className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">

                              <div className="p-0 card-body">
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('en')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag01}
                                          alt="English" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">English</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('fr')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag02}
                                          alt="French" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">French</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('es')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag03}
                                          alt="Spanish" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Spanish</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('it')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag04}
                                          alt="Italian" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Italian</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('de')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag05}
                                          alt="German" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">German</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('ja')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag06}
                                          alt="Japanese" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Japanese</p>
                                       </div>
                                    </div>
                                 </a>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>
                     <Nav.Item as="li" className="nav-item iq-full-screen d-none d-xl-block"
                        id="fullscreen-item">
                        <a href="#" className="nav-link" id="btnFullscreen" onClick={toggleFullScreen}>
                           <i className={`ri-fullscreen-line normal-screen ${isFullScreen ? 'd-none' : ""}`}></i>
                           <i className={`ri-fullscreen-exit-line full-normal-screen ${isFullScreen ? '' : " d-none"}`}></i>
                        </a>
                     </Nav.Item>
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-none d-xl-block"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <i className="ri-notification-4-line"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="div" drop={'start'} className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">

                              <div
                                 className="py-3 card-header d-flex justify-content-between bg-primary mb-0 rounded-top-3">
                                 <div className="header-title w-100">
                                    <h5
                                       className="mb-0 text-white d-flex justify-content-between">All
                                       Notifications <small
                                          className="badge text-bg-light  pt-1">4</small></h5>
                                 </div>
                              </div>
                              <div className="p-0 card-body">
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user01} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Emma Watson Bni</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">95 MB</p>
                                             <small className="float-end font-size-12">Just
                                                Now</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user02} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New customer is join</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">Just
                                                Now</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user03} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Two customer is left</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">Just
                                                Now</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user04} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New Mail from Fenny</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">Just
                                                Now</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-none d-xl-block"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <i className="ri-mail-open-line"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="div" className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">
                              <div
                                 className="py-3 card-header d-flex justify-content-between bg-primary mb-0 rounded-top-3">
                                 <div className="header-title w-100">
                                    <h5
                                       className="mb-0 text-white d-flex justify-content-between">All
                                       Messages <small
                                          className="badge text-bg-light  pt-1">4</small></h5>
                                 </div>
                              </div>
                              <div className="p-0 card-body">
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user01} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Emma Watson Bni</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">Just
                                                Now</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user02} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New customer is join</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">5 days
                                                ago</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user03} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Two customer is left</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">2 days
                                                ago</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img className="p-1 avatar-40 "
                                          src={user04} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New Mail from Fenny</h6>
                                          <div className="d-flex justify-content-between">
                                             <p className="mb-0">Jond Bini</p>
                                             <small className="float-end font-size-12">3 days
                                                ago</small>
                                          </div>
                                       </div>

                                    </div>
                                 </a>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle as={CustomToggle}>
                           <img src={user001} alt="User-Profile" className="theme-color-default-img img-fluid avatar avatar-50 avatar-rounded" loading="lazy" />
                           <div className="caption ms-3">
                              <h6 className="mb-0 caption-title">Profile</h6>
                           </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end">
                           <Dropdown.Item>
                              <Link className="dropdown-item" to="/extra-pages/account-setting">Profile</Link>
                           </Dropdown.Item>
                           <Dropdown.Item>
                              <Link className="dropdown-item" to="/extra-pages/account-setting">Privacy Setting</Link>
                           </Dropdown.Item>
                           <Dropdown.Item onClick={handleLogout}>
                              <span className="dropdown-item">Sign Out</span>
                           </Dropdown.Item>
                        </Dropdown.Menu>
                     </Dropdown>
                  </Col>
               </Row>

            </Container>

            {/* -- collapse -- */}
            <Navbar.Collapse id="navbarSupportedContent">
               <Row className="flex-grow-1 pt-4 pb-4 px-2">

                  <Col md={12} className="d-flex justify-content-end align-items-center">
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-block d-xl-none"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <img src={
                              currentLanguage === 'en' ? flag01 :
                              currentLanguage === 'fr' ? flag02 :
                              currentLanguage === 'es' ? flag03 :
                              currentLanguage === 'it' ? flag04 :
                              currentLanguage === 'de' ? flag05 :
                              currentLanguage === 'ja' ? flag06 : flag01
                            }
                               alt="img-flag" className="img-fluid me-1"
                               style={{ height: "20px", width: "20px" }} /> 
                           <span>{
                              currentLanguage === 'en' ? 'English' :
                              currentLanguage === 'fr' ? 'French' :
                              currentLanguage === 'es' ? 'Spanish' :
                              currentLanguage === 'it' ? 'Italian' :
                              currentLanguage === 'de' ? 'German' :
                              currentLanguage === 'ja' ? 'Japanese' : 'English'
                            }</span> <i className="ri-arrow-down-s-line ms-1"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="div" className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">
                              <div className="p-0 card-body">
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('en')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag01}
                                          alt="English" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">English</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('fr')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag02}
                                          alt="French" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">French</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('es')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag03}
                                          alt="Spanish" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Spanish</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('it')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag04}
                                          alt="Italian" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Italian</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('de')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag05}
                                          alt="German" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">German</p>
                                       </div>
                                    </div>
                                 </a>
                                 <a href="#" className="iq-sub-card" onClick={() => changeLanguage('ja')}>
                                    <div className="d-flex align-items-center">
                                       <img
                                          src={flag06}
                                          alt="Japanese" 
                                          style={{ height: "24px", width: "24px", borderRadius: "3px" }}
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <p className="mb-0 fw-medium">Japanese</p>
                                       </div>
                                    </div>
                                 </a>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>{" "}
                     <li className="nav-item dropdown">
                     </li>
                     <Nav.Item className="iq-full-screen iq-full-screen2 d-block d-xl-none"
                        id="fullscreen-item">
                        <a href="#" className="nav-link" id="btnFullscreen" onClick={toggleFullScreen}>
                           <i className={`ri-fullscreen-line normal-screen ${isFullScreen ? 'd-none' : ""}`}></i>
                           <i className={`ri-fullscreen-exit-line full-normal-screen ${isFullScreen ? '' : " d-none"}`}></i>
                        </a>
                     </Nav.Item>{" "}
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-block d-xl-none"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <i className="ri-notification-4-line"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">
                              <div
                                 className="py-3 card-header d-flex justify-content-between bg-primary mb-0">
                                 <div className="header-title">
                                    <h5 className="mb-0 text-white">All Notifications</h5>
                                 </div>
                              </div>
                              <div className="p-0 card-body">
                                 <Link as="a" to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user01} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Emma Watson Bni</h6>
                                          <p className="mb-0">95 MB</p>
                                       </div>
                                       <small className="float-end font-size-12">Just
                                          Now</small>
                                    </div>
                                 </Link>
                                 <Link as="a" to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user02} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New customer is join</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">5 days
                                          ago</small>
                                    </div>
                                 </Link>
                                 <Link as="a" to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user03} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Two customer is left</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">2 days
                                          ago</small>
                                    </div>
                                 </Link>
                                 <Link as="a" to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user04} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New Mail from Fenny</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">3 days
                                          ago</small>
                                    </div>
                                 </Link>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>{" "}
                     <Dropdown as="li" className="nav-item">
                        <Dropdown.Toggle
                           as="a" bsPrefix=' ' to="#" className="nav-link d-block d-xl-none"
                           id="notification-drop" data-bs-toggle="dropdown">
                           <i className="ri-mail-open-line"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu as="div" className="p-0 sub-drop dropdown-menu dropdown-menu-end"
                           aria-labelledby="notification-drop">
                           <div className="m-0 -none card">
                              <div
                                 className="py-3 card-header d-flex justify-content-between bg-primary mb-0">
                                 <div className="header-title">
                                    <h5 className="mb-0 text-white">All Notifications</h5>
                                 </div>
                              </div>
                              <div className="p-0 card-body">
                                 <Link to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user01} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Emma Watson Bni</h6>
                                          <p className="mb-0">95 MB</p>
                                       </div>
                                       <small className="float-end font-size-12">Just
                                          Now</small>
                                    </div>
                                 </Link>
                                 <Link to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user02} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New customer is join</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">5 days
                                          ago</small>
                                    </div>
                                 </Link>
                                 <Link to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user03} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">Two customer is left</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">2 days
                                          ago</small>
                                    </div>
                                 </Link>
                                 <Link to="#" className="iq-sub-card">
                                    <div className="d-flex align-items-center">
                                       <img
                                          className="p-1 avatar-40 rounded-pill bg-primary-subtle"
                                          src={user04} alt
                                          loading="lazy" />
                                       <div className="ms-3 flex-grow-1 text-start">
                                          <h6 className="mb-0 ">New Mail from Fenny</h6>
                                          <p className="mb-0">Cyst Bni</p>
                                       </div>
                                       <small className="float-end font-size-12">3 days
                                          ago</small>
                                    </div>
                                 </Link>
                              </div>
                           </div>
                        </Dropdown.Menu>
                     </Dropdown>

                  </Col>
               </Row>
               {/* -- dropdown -- */}
            </Navbar.Collapse>
         </Navbar>
         {/* </Navbar> */}
      </>
   )
}

export default Header