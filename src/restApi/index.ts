import axios from "axios";
import Cookies from 'js-cookie'
export const baseUrl = "https://adminpanel-decorate.herokuapp.com/api/"; // dev


export default class api {
  request(name: any, postData: any, method: any) {
    return new Promise(function (resolve, reject) {
      var url = baseUrl + name;
      var headers: any={ "Content-Type": "application/json" };
      
      if (Cookies.get('token')) {
        headers={ "Content-Type": "application/json", 'authorization':'Bearer '+Cookies.get('token')+"" }
      }
      if (method === undefined) {
        method = "post";
      }

      axios
        .request({
          method: method,
          url: url,
          data: postData,
          headers: headers,
        })
        .then(async (response) => {
          resolve(response);
        })
        .catch(function (err) {
          reject(JSON.parse(err.response.request.response));
        });
    });
  }

  _request(name: any, postData: any, method: any) {
    return new Promise(function (resolve, reject) {
      var url = baseUrl + name;
      if (localStorage.getItem("access_token")) {
        if (url.indexOf("?") !== -1) {
          url += "&access_token=" + localStorage.getItem("access_token");
        } else {
          url += "?access_token=" + localStorage.getItem("access_token");
        }
      }
      if (method === undefined) {
        method = "post";
      }

      axios
        .request({
          method: method,
          url: url,
          data: postData,
          headers: { "Content-Type": "application/json" },
        })
        .then(async (response) => {
          resolve(response);
        })
        .catch(function (err) {
          reject(JSON.parse(err.response.request.response));
        });
    });
  }
  requestWithoutToken(name: any, postData: any, method: any) {
    return new Promise(function (resolve, reject) {
      var url = baseUrl + name; // + "?access_token=" + sessionStorage.token;
      if (method === undefined) {
        method = "post";
      }
      axios
        .request({
          method: method,
          url: url,
          data: postData,
          headers: { "Content-Type": "application/json" },
        })
        .then(async (response) => {
          resolve(response);
        })
        .catch(function (err) {
          reject(JSON.parse(err.response.request.response));
        });
    });
  }
}
