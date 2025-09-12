from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

class ReportAnalysis(models.Model):
    """Model to store radiology report analysis results"""
    
    ANALYSIS_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'), 
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='report_analyses'
    )
    original_text = models.TextField(help_text="Original radiology report text")
    analyzed_text = models.TextField(blank=True, null=True, help_text="Analyzed text with corrections")
    highlighted_report = models.TextField(blank=True, null=True, help_text="HTML highlighted report")
    
    # Analysis Results
    diagnostic_discrepancies = models.JSONField(default=list, blank=True, help_text="List of found errors")
    summary = models.TextField(blank=True, null=True, help_text="Analysis summary")
    confidence_score = models.FloatField(default=0.0, help_text="Analysis confidence score")
    
    # Metadata
    status = models.CharField(max_length=20, choices=ANALYSIS_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processing_time = models.FloatField(null=True, blank=True, help_text="Time taken for analysis in seconds")
    
    # File handling
    uploaded_file = models.FileField(
        upload_to='reports/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['txt', 'pdf', 'doc', 'docx'])],
        blank=True,
        null=True,
        help_text="Original uploaded file"
    )
    file_name = models.CharField(max_length=255, blank=True, null=True)
    file_size = models.PositiveIntegerField(blank=True, null=True, help_text="File size in bytes")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Report Analysis"
        verbose_name_plural = "Report Analyses"
    
    def __str__(self):
        return f"Analysis by {self.user.username} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class ErrorCategory(models.Model):
    """Model to categorize different types of errors found in reports"""
    
    ERROR_TYPES = [
        ('medical', 'Medical Error'),
        ('typographical', 'Typographical Error'),
        ('misspelled', 'Misspelled Word'),
        ('grammatical', 'Grammatical Error'),
        ('formatting', 'Formatting Error'),
    ]
    
    name = models.CharField(max_length=50, choices=ERROR_TYPES, unique=True)
    description = models.TextField(blank=True, null=True)
    severity_level = models.IntegerField(default=1, help_text="1=Low, 2=Medium, 3=High, 4=Critical")
    color_code = models.CharField(max_length=7, default="#FF0000", help_text="Hex color code for UI")
    
    class Meta:
        verbose_name = "Error Category"
        verbose_name_plural = "Error Categories"
    
    def __str__(self):
        return self.get_name_display()

class ReportError(models.Model):
    """Individual errors found in a report analysis"""
    
    analysis = models.ForeignKey(
        ReportAnalysis, 
        on_delete=models.CASCADE,
        related_name='errors'
    )
    category = models.ForeignKey(ErrorCategory, on_delete=models.CASCADE)
    
    # Error details
    original_text = models.CharField(max_length=500, help_text="Original incorrect text")
    corrected_text = models.CharField(max_length=500, help_text="Suggested correction")
    position_start = models.PositiveIntegerField(help_text="Start position in original text")
    position_end = models.PositiveIntegerField(help_text="End position in original text")
    context = models.TextField(blank=True, null=True, help_text="Surrounding context")
    
    # AI Analysis
    confidence_score = models.FloatField(default=0.0, help_text="Confidence in this correction")
    explanation = models.TextField(blank=True, null=True, help_text="Why this is an error")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['position_start']
        verbose_name = "Report Error"
        verbose_name_plural = "Report Errors"
    
    def __str__(self):
        return f"{self.category.name}: {self.original_text[:50]}..."

class ReportTemplate(models.Model):
    """Templates for common radiology report formats"""
    
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    template_content = models.TextField(help_text="Template content with placeholders")
    category = models.CharField(max_length=100, help_text="e.g., 'Chest X-Ray', 'CT Scan', etc.")
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_templates'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-usage_count', 'name']
        verbose_name = "Report Template"
        verbose_name_plural = "Report Templates"
    
    def __str__(self):
        return f"{self.name} ({self.category})"

class AnalyticsData(models.Model):
    """Store analytics data for dashboard"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='analytics'
    )
    
    # Daily analytics
    date = models.DateField()
    total_reports_analyzed = models.PositiveIntegerField(default=0)
    total_errors_found = models.PositiveIntegerField(default=0)
    avg_confidence_score = models.FloatField(default=0.0)
    avg_processing_time = models.FloatField(default=0.0)
    
    # Error breakdown
    medical_errors = models.PositiveIntegerField(default=0)
    typographical_errors = models.PositiveIntegerField(default=0)
    misspelled_errors = models.PositiveIntegerField(default=0)
    grammatical_errors = models.PositiveIntegerField(default=0)
    formatting_errors = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
        verbose_name = "Analytics Data"
        verbose_name_plural = "Analytics Data"
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"
