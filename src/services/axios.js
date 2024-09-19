import axios from 'axios'

const Api = axios.create({
    baseURL:'https://pdf-uploader-server-theta.vercel.app/',
    withCredentials:true
})

export default Api