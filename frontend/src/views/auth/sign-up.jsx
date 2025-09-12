import React, { useState } from "react";
import { Carousel, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { register } from '../../services/api';

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    gmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData.username, formData.gmail, formData.password);
      navigate('/auth/sign-in'); // Redirect to sign-in after successful registration
    } catch (err) {
      setError(err.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
        <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
          <Row>
            <Col md={6} className="text-center z-2">
              <div className="sign-in-detail text-white">
                <Link to="/" className="sign-in-logo mb-2">
                  <img src={generatePath("/assets/images/logo-white.png")} className="img-fluid" alt="Logo" />
                </Link>
                <Carousel id="carouselExampleCaptions" interval={2000} controls={false}>
                  <Carousel.Item>
                    <img src={generatePath("/assets/images/login/1.png")} className="d-block w-100" alt="Medical Analysis" />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-1 text-white">Advanced X-Ray Analysis</h4>
                      <p className="pb-5">Join our platform for AI-powered radiology analysis and diagnostics.</p>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={generatePath("/assets/images/login/2.png")} className="d-block w-100" alt="Report Management" />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-1 text-white">Efficient Report Management</h4>
                      <p className="pb-5">Access our comprehensive medical report management system.</p>
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img src={generatePath("/assets/images/login/3.png")} className="d-block w-100" alt="Healthcare Innovation" />
                    <div className="carousel-caption-container">
                      <h4 className="mb-1 mt-1 text-white">Healthcare Innovation</h4>
                      <p className="pb-5">Be part of the future of healthcare technology.</p>
                    </div>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Col>
            <Col md={6} className="position-relative z-2">
              <div className="sign-in-from d-flex flex-column justify-content-center">
                <h1 className="mb-0">Sign Up</h1>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <Form.Group className="form-group">
                    <label htmlFor="username">Username</label>
                    <Form.Control 
                      type="text" 
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <label htmlFor="gmail">Gmail address</label>
                    <Form.Control 
                      type="email" 
                      id="gmail"
                      name="gmail"
                      placeholder="Enter Gmail"
                      value={formData.gmail}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <label htmlFor="password">Password</label>
                    <Form.Control 
                      type="password" 
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <label className="d-inline-block form-group mb-0 d-flex">
                      <input
                        type="checkbox"
                        id="customCheck1"
                        className="custom-control-input"
                        required
                      />
                      <label className="custom-control-label me-1" htmlFor="customCheck1"></label> I accept <Link className="ms-1" to="/extra-pages/terms-of-use"> Terms and Conditions</Link>
                    </label>
                    <button type="submit" className="btn btn-primary-subtle float-end" disabled={loading}>
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                  </div>
                  <div className="sign-info d-flex justify-content-between flex-column flex-lg-row align-items-center">
                    <span className="dark-color d-inline-block line-height-2">
                      Already Have Account ? <Link to="/auth/sign-in">Sign In</Link>
                    </span>
                    <ul className="auth-social-media d-flex list-unstyled">
                      <li><a href="#facebook"><i className="ri-facebook-box-line"></i></a></li>
                      <li><a href="#twitter"><i className="ri-twitter-line"></i></a></li>
                      <li><a href="#instagram"><i className="ri-instagram-line"></i></a></li>
                    </ul>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default SignUp;