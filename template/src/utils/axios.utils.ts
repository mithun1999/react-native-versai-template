import axios, { AxiosInstance } from 'axios'
import envConfig from '../config/env.config'

export const axiosInstance: AxiosInstance = axios.create({ baseURL: envConfig.apiUrl })
