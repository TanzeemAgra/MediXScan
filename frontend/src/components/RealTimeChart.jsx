// Real-Time Chart Component with Dynamic Updates
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { DashboardHelpers } from '../config/dashboardConfig';

const RealTimeChart = ({ 
  widget, 
  theme, 
  realTimeData,
  className = '',
  delay = 0 
}) => {
  // Safety check for widget
  if (!widget || !theme) {
    console.warn('RealTimeChart: Missing required props', { widget, theme });
    return (
      <div className={className}>
        <div className="alert alert-warning" role="alert">
          Chart configuration error. Please check the widget configuration.
        </div>
      </div>
    );
  }

  const [isVisible, setIsVisible] = useState(false);
  const [chartData, setChartData] = useState(widget.series || []);
  const [isLoading, setIsLoading] = useState(false);
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    // Setup real-time updates
    if (widget.refreshInterval && isVisible) {
      updateIntervalRef.current = setInterval(() => {
        updateChartData();
      }, widget.refreshInterval);
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isVisible, widget.refreshInterval]);

  const updateChartData = () => {
    setIsLoading(true);
    
    // Simulate real-time data update
    setTimeout(() => {
      if (widget.type === 'area_spline') {
        const newData = widget.series.map(series => ({
          ...series,
          data: series.data.map(value => 
            value + (Math.random() - 0.5) * 10
          )
        }));
        setChartData(newData);
      } else if (widget.type === 'radial_bar') {
        const newSeries = widget.series.map(value => 
          Math.max(0, Math.min(100, value + (Math.random() - 0.5) * 20))
        );
        setChartData(newSeries);
      }
      setIsLoading(false);
    }, 500);
  };

  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        type: widget.type === 'area_spline' ? 'area' : 'radialBar',
        height: widget.height || 350,
        background: 'transparent',
        toolbar: { 
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        sparkline: widget.type === 'area_spline' ? { enabled: false } : { enabled: false }
      },
      colors: widget.colors || [theme.primaryColor || '#667eea'],
      stroke: {
        curve: 'smooth',
        width: widget.type === 'area_spline' ? 3 : 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      grid: {
        show: widget.type === 'area_spline',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        strokeDashArray: 5
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      dataLabels: {
        enabled: widget.type === 'radial_bar',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold'
        }
      }
    };

    if (widget.type === 'area_spline') {
      return {
        ...baseOptions,
        xaxis: {
          categories: widget.categories || [],
          labels: {
            show: true,
            style: {
              colors: theme.textSecondary || '#666',
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: theme.textSecondary || '#666',
              fontSize: '12px'
            }
          }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            colors: theme.textSecondary || '#666'
          }
        },
        dataLabels: { 
          enabled: false 
        }
      };
    } else if (widget.type === 'radial_bar') {
      return {
        ...baseOptions,
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent'
            },
            track: {
              background: 'rgba(0, 0, 0, 0.1)',
              strokeWidth: '67%'
            },
            dataLabels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: theme.textSecondary || '#666',
                offsetY: 120
              },
              value: {
                show: true,
                offsetY: -10,
                fontSize: '18px',
                color: theme.textPrimary || '#333',
                formatter: (val) => `${val}%`
              }
            }
          }
        },
        labels: widget.labels || [],
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { height: 280 },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: { fontSize: '12px' },
                  value: { fontSize: '16px' }
                }
              }
            }
          }
        }]
      };
    }

    return baseOptions;
  };

  const cardStyle = {
    background: theme.cardBackground,
    borderRadius: theme.borderRadius,
    border: 'none',
    boxShadow: theme.cardShadow,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    opacity: isVisible ? 1 : 0,
    transition: `all ${theme.animationDuration} ease-out`,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className={className}>
      <Card style={cardStyle}>
        <Card.Header 
          className="border-0 pb-0"
          style={{ 
            background: 'transparent',
            borderBottom: 'none'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0" style={{ color: theme.textPrimary }}>
                {widget.title}
              </h5>
              <small style={{ color: theme.textSecondary }}>
                Live data updates every {Math.floor(widget.refreshInterval / 1000)}s
              </small>
            </div>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
            
            {/* Status indicator */}
            <div className="d-flex align-items-center">
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.successGradient,
                  marginRight: '8px',
                  animation: 'pulse 2s infinite'
                }}
              />
              <small style={{ color: theme.textSecondary }}>Live</small>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="pt-2">
          {isVisible && chartData && (
            <Chart
              options={getChartOptions()}
              series={Array.isArray(chartData) ? (
                widget.type === 'radial_bar' ? chartData : 
                (chartData.length > 0 && typeof chartData[0] === 'object' && chartData[0].data) ? chartData : 
                [{ name: 'Data', data: Array.isArray(chartData) ? chartData : [] }]
              ) : [{ name: 'Data', data: [] }]}
              type={widget.type === 'area_spline' ? 'area' : 'radialBar'}
              height={widget.height || 350}
            />
          )}
          
          {!isVisible && (
            <div className="d-flex justify-content-center align-items-center" style={{ height: (widget.height || 350) + 'px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </Card.Body>

        {/* Animated background pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 40%, ${theme.primaryGradient.replace('linear-gradient(135deg,', '').replace(')', '').split(',')[0]}08 50%, transparent 60%)`,
            opacity: 0.5,
            pointerEvents: 'none',
            animation: 'backgroundShift 20s ease-in-out infinite'
          }}
        />
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes backgroundShift {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default RealTimeChart;
