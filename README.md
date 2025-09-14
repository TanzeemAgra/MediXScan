# 🏥 MediXScan - Radiology Management System

A comprehensive medical radiology management platform built with Django REST Framework and React.

## 🚀 Features

- **Patient Management**: Complete CRUD operations for patient records
- **AI-Powered Analysis**: OpenAI integration for medical report analysis
- **Secure Authentication**: JWT-based authentication system
- **Real-time Dashboard**: Interactive patient dashboard with analytics
- **File Processing**: Medical document and image handling
- **Report Generation**: Automated radiology report creation

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **OpenAI API** - AI analysis integration
- **Celery + Redis** - Background task processing

### Frontend
- **React 18** - Frontend framework
- **Bootstrap 5** - UI components
- **JWT Authentication** - Secure user sessions
- **Axios** - API communication

## 📦 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 12+
- Redis (for background tasks)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment

- **Backend**: Railway (with PostgreSQL)
- **Frontend**: Vercel
- **Database**: Railway PostgreSQL

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [Railway Database Migration Guide](RAILWAY-DATABASE-MIGRATION-GUIDE.md)
- [Vercel Frontend Deployment](VERCEL-FRONTEND-DEPLOYMENT-GUIDE.md)
- [Deployment Readiness Report](DEPLOYMENT-READINESS-REPORT.md)

## 🔒 Security

- Environment variable management
- Rate limiting protection
- CORS configuration
- JWT token security
- Input sanitization

## 📄 License

This project is proprietary software for medical radiology management.

## 👥 Contributing

Contact the development team for contribution guidelines.

---
**MediXScan** - Advanced Radiology Management Solution