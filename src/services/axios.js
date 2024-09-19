import axios from 'axios'

const Api = axios.create({
    baseURL:'https://pdf-uploader-server-vert.vercel.app',
    withCredentials:true
})

export default Api