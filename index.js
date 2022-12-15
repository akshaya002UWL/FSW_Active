var express = require("express"); //requiring express module
var app = express(); //creating express instance
var querystring = require('querystring');
const axios = require('axios');
const host = '0.0.0.0';
const PORT = process.env.PORT || 5000;
var cors = require('cors')
app.use(cors())
var data = querystring.stringify({
        grant_type: "client_credentials",    
        client_id: "watson-orchestrate",    
        client_secret:"ca81109d-312d-4ed3-9cf0-19398e26ea9d"
 });

app.get('/getChannel',async (req,res) => {
        try { 
                const jwt_token= await axios.post('https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token',data,{     
                        headers: {      
                                'Content-Type': 'application/x-www-form-urlencoded',   
                                'Content-Length': Buffer.byteLength(data)  
                        }    
                }    );    
                let jobProf = req.query.jobProfile;
                let loc = req.query.location;
                let config = {
                        headers: { 'Authorization': 'Bearer ' + jwt_token.data.access_token },
                        params: {
                            jobProfile: jobProf,
                            location:loc
                        }
                    }
                const axiosInstance = axios.create({  
                        headers: {          
                        'Authorization': 'Bearer '+jwt_token.data.access_token   
                        }   
                 });    
                const response = await axiosInstance.get('https://education-dev.apps.openshift-01.knowis.cloud/candhun/api/huncan/getChannel',config);  
                var api_response = {
                    "instances":response.data
                }
                res.send(api_response)
        } 
        catch (error) {    console.log(error);}
});
app.get('/postJob',async (req,res) => {
        try {
                const jwt_token= await axios.post('https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token',data,{
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': Buffer.byteLength(data)
                        }
                }    );
                let chaName = req.query.channelName;
                let jobId = req.query.jobReqId;
                let config = {
                        headers: { 'Authorization': 'Bearer ' + jwt_token.data.access_token },
                        params: {
                                channelName: chaName,
                                jobReqId:jobId
                        }
                    }
                const axiosInstance = axios.create({
                        headers: {
                        'Authorization': 'Bearer '+jwt_token.data.access_token
                        }
                 });
                const response = await axiosInstance.get('https://education-dev.apps.openshift-01.knowis.cloud/jobpost/api/jobs/postJob',config);
                
                res.send(response.data)
        }
        catch (error) {    console.log(error);}
});
        
app.listen(PORT, function() { console.log("Node server is running..");});
