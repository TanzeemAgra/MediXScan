import axios from 'axios';

const API_URL = 'http://localhost:8005';

export const anonymizeFile = async (file) => {
  try {
    // Create a new FormData instance
    const formData = new FormData();
    
    // Append the file with the correct field name that matches the backend
    formData.append('file', file);
    
    // Add a timeout to the request
    const response = await axios.post(`${API_URL}/anonymize`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error anonymizing file:', error);
    throw error;
  }
};

export const downloadAnonymizedFile = async (anonymizedData, fileFormat) => {
  try {
    const formData = new FormData();
    formData.append('file_content', anonymizedData);
    formData.append('file_format', fileFormat);

    const response = await axios.post(`${API_URL}/download_anonymized`, formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout
    });

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename based on format
    const extension = fileFormat === 'txt' ? '.txt' : 
                      fileFormat === 'excel' ? '.xlsx' : 
                      fileFormat === 'docx' ? '.docx' : '';
    link.setAttribute('download', `anonymized_file${extension}`);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error downloading anonymized file:', error);
    throw error;
  }
};
