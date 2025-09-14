import axios from 'axios';

export class ProxyService {
    private pythonServiceUrl: string;

    constructor() {
        this.pythonServiceUrl = 'http://localhost:8000'; // Adjust the URL as needed
    }

    async generate(data: any): Promise<any> {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/generate`, data);
            return response.data;
        } catch (error) {
            console.error('Error in generate:', error);
            throw new Error('Failed to generate data');
        }
    }

    async refine(data: any): Promise<any> {
        try {
            const response = await axios.post(`${this.pythonServiceUrl}/refine`, data);
            return response.data;
        } catch (error) {
            console.error('Error in refine:', error);
            throw new Error('Failed to refine data');
        }
    }
}