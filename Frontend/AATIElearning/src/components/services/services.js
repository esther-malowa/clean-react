import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

const handleError = (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.clear()
        throw new Error('‼️‼️ Oops !Session expired. Please log in again.');
    } else if (error.response && error.response.status === 500) {
        throw new Error('‼️‼️ Oops! Server Error. Please try again later.');
    } else if (error.response && error.response.data) {
        // Extract error message from Django
        const messages = Object.values(error.response.data).flat().join(' ');
        throw new Error(messages);
    } else if (error.response && error.response.status === 404) {
        throw new Error('‼️‼️ Oops! Invalid request made. Please contact admin.');
    } else {
        throw new Error("Something went wrong.")
    }

}


class BackendConnection {
    setHeaders(token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    async register(formData) {
        try {
            const response = await apiClient.post('/users/register/', formData)

            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async resendEmail(email) {
        try {
            const response = await apiClient.post('/users/resend_email/', { email: email })
            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async login(formData) {
        try {
            const response = await apiClient.post('/users/login/', formData)
            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async forgotPasword(email) {
        try {
            const response = await apiClient.post('/users/forgot_password/', { email: email })
            return response.data
        } catch (error) {
            handleError(error)
        }
    }

    async resetPassword(uid, token, formData) {
        try {
            const response = await apiClient.post(`/users/reset_password/${uid}/${token}/`, formData)
            return response.data
        } catch (error) {
            handleError(error)
        }
    }
}


export default new BackendConnection();