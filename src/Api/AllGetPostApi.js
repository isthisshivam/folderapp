import { api } from "./Configs/axiosConfig"
import { defineCancelApiObject } from "./Configs/axiosUtils"

export const AllGetPostRequestResponse = {

    getRequest: async function (token, cancel = false, endPont) {
        const response = await api.request({
          url: endPont,
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          // retrieving the signal value by using the property name
          signal: cancel ? cancelApiObject[this.getRequest.name].handleRequestCancellation().signal : undefined,
        })
    
        // returning the product returned by the API
        return response.data
      },

      postRequest: async function (request, cancel = false, Endurl) {
        const response = await api.request({
          url: Endurl,
          method: "POST",
          headers: { "Content-Type": "multipart/form-data" },
          data: request,
          signal: cancel ? cancelApiObject[this.postRequest.name].handleRequestCancellation().signal : undefined,
        })

        return response.data

      },
      postRequestWithToken: async function (request, cancel = false, Endurl, token) {
        const response = await api.request({
          url: Endurl,
          method: "POST",
          headers: { "Content-Type": "multipart/form-data",  Authorization: `Bearer ${token}` },
          data: request,
          signal: cancel ? cancelApiObject[this.postRequest.name].handleRequestCancellation().signal : undefined,
        })

        return response.data

      },
   
}
// defining the cancel API object for AllGetPostRequestResponse
const cancelApiObject = defineCancelApiObject(AllGetPostRequestResponse);