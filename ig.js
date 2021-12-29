import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const IG_URL = 'https://api.ig.com/gateway/deal'

// Init instance of axios which works with BASE_URL
const axiosInstance = axios.create({ baseURL: IG_URL });

const createSession = async () => {
  console.log("create session")
  const authParams = {
    "identifier": username,
    "password": password,
    "encryptedPassword": null
  }
  const headers = {
    headers:
    {
      "X-IG-API-KEY": api_key
    }
  } 
  const resp = await axios.post(IG_URL, authParams)
  const [cookie] = resp.headers["set-cookie"];// get cookie from request
  axiosInstance.defaults.headers.Cookie = cookie;// attach cookie to axiosInstance for future requests
  return cookie; // return Promise<cookie> cause func is async
};

class igClient {

    constructor(url = IG_URL, api_key = process.env.IG_API_KEY, username = process.env.IG_IDENTIFIER, password = process.env.IG_PASSWORD) {
        this.url = url
        this.apikey = api_key
        this.username = username
        this.password = password
        this.client = axios.create(
          {
            baseURL: this.url,
            timeout: 360000,
            headers:
            {
              'Accept': 'application/json; charset=UTF-8',
              'Content-Type': 'application/json; charset=UTF-8',
              'x-ig-api-key': this.apikey
            }
          }
        )
        console.log('client created...')
    }

    connect() {
        
      this.headers = this.client.post(
          '/session', 
          {
            "identifier": this.username,
            "password": this.password,
            "encryptedPassword": null
          }
        ).then(response => {
          console.log('Connected...');
          this.client.defaults.headers.common['X-SECURITY-TOKEN'] = response.headers['x-security-token']
          this.client.defaults.headers.common['CST'] = response.headers.cst
          return response.headers
 
          
        })
        .catch(error => {
          console.log('did not connect!')
        });
        

        
    }

    getPositions() {
      return this.getReq('/positions') 
    }

    getAccounts() {
      return this.getReq('/accounts') 
    }
    
    getReq(url, data=null) {
      return this.client['get'](
        url,
        {
          data
        }
      ).then(response => {
        return response.data
      })
      .catch(error => {
        console.log('did not get data from '+url+'!')
        console.log(error)
      });
    }


}

export default igClient 