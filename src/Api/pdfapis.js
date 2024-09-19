import Api from "../services/axios"

export const uploadPdf = async (formData) =>{
    const result = await Api.post('/upload',formData)
    return result
}

export const extractPdf = async (formData) =>{
    const result = await Api.post('/extract',formData,{responseType:'blob'})
    return result
}