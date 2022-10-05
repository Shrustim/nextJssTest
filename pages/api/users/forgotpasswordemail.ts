import jwt from 'jsonwebtoken';
import { query } from "../../../lib/db";
import { apiHandler } from '../../../helpers/api';
import {BaseURL,EmailAddress,EmailPassword} from "../../../constants"
import { SMTPClient } from 'emailjs';
import { insertQuery, updateQuery,selectQuery } from "../../../helpers/sqlquerys";

export default apiHandler(handler);

function handler(req: any, res: any) {
   

    const forgotpasswordemail = async() => {
        const { email } = req.body;
        const isValidate = BodyValidation();
        if(isValidate === true){
            const querySqlCheck = await selectQuery("users",["id"],"email='"+email+"' AND isActive = 1 AND isDeleted = 0")
            // const querySqlCheck ="SELECT id FROM users WHERE email='"+email+"' AND isActive = 1 AND isDeleted = 0";
            const dataUser:any = await query({ querys: querySqlCheck, values: [] });
            if (dataUser.length != 0) {
                const querySqlCheckExits = await selectQuery("forgotpassword",["id"],"email='"+email+"' AND userId = '"+dataUser[0].id+"' AND isDeleted = 0")
                // const querySqlCheckExits ="SELECT id FROM forgotpassword WHERE email='"+email+"' AND userId = '"+dataUser[0].id+"' AND isDeleted = 0";
                const dataCheckExits:any = await query({ querys: querySqlCheckExits, values: [] });
                const code = ""+Math.floor(10000 + Math.random() * 90000)+dataUser[0].id+"";
                if (dataCheckExits.length != 0) {
                    // console.log("exits")
                    const today = new Date();
                    const updateData = {
                        "code":code,
                        "createdDttm": today.getTime()
                    };
                    const whereCondition = 'id = '+dataCheckExits[0].id+'';
                    const querySqlUpdate = await updateQuery(updateData,"forgotpassword",whereCondition)
                    //  const querySqlUpdate ='UPDATE forgotpassword SET code = "'+code+'", createdDttm = "'+ today.getTime()+'"  WHERE id = '+dataCheckExits[0].id+'';
                     await query({ querys: querySqlUpdate, values: [] });
                     await sendEmail(req.body,BaseURL+"resetpassword/"+code)
                    return res.status(200).json({});
                }else{
                    // console.log("not exits")
                     const today = new Date();
                     const insertObj = {
                        "userId":dataUser[0].id,
                        "email":email,
                        "code":code,
                        "createdDttm":today.getTime()
                      }
                      const querySqlInsert = await insertQuery(insertObj,"forgotpassword")
                    //  const querySqlInsert ='INSERT INTO forgotpassword (userId, email, code, createdDttm)'+
                    //  'VALUES ("'+dataUser[0].id+'", "'+email+'", "'+code+'","'+ today.getTime()+'")';
                     await query({ querys: querySqlInsert, values: [] });
                     await sendEmail(req.body,BaseURL+"resetpassword/"+code)
                     return res.status(200).json({});
                }
               
            } else{
                throw 'Email is not exits.'
            };
                
        }else{
                throw isValidate;
        }
    }
    const BodyValidation = ()=>{
        const { email } = req.body;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(email && regex.test(email) ){
            return true;
        }else{
            return "Invalid email.";
        }
    }

    const sendEmail = (data: any,link: any) =>{
        const client = new SMTPClient({
            user: EmailAddress,
            password: EmailPassword,
            host: 'smtp.gmail.com',
            ssl:true
          });
          client.send(
            {
                text: '',
                from: EmailAddress,
                to: data.email,
                subject: 'MySoftwareUpdate - Reset Password Request',
                attachment: [
                    { data: `
                    <!doctype html>
                    <html lang="en-US">
                    
                    <head>
                        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                        <title>Reset Password Email Template</title>
                        <meta name="description" content="Reset Password Email Template.">
                        <style type="text/css">
                            a:hover {text-decoration: underline !important;}
                        </style>
                    </head>
                    
                    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                        <!--100% body table-->
                        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                            <tr>
                                <td>
                                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                        align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="height:80px;">&nbsp;</td>
                                        </tr>
                                        <!-- <tr>
                                            <td style="text-align:center;">
                                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                                <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                                              </a>
                                            </td>
                                        </tr> -->
                                        <tr>
                                            <td style="height:20px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                    <tr>
                                                        <td style="height:40px;">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding:0 35px;">
                                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                                requested to reset your password</h1>
                                                            <span
                                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                                We cannot simply send you your old password. A unique link to reset your
                                                                password has been generated for you. To reset your password, click the
                                                                following link and follow the instructions.
                                                            </p>
                                                            <a href="${link}"
                                                                style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                                Password</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="height:40px;">&nbsp;</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        <tr>
                                            <td style="height:20px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">
                                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.mysoftwareupdate.com</strong></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:80px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!--/100% body table-->
                    </body>
                    
                    </html>`
                    
                     , alternative: true 
                    }
                ],
            },
            (err, message) => {
                // console.log(err || message);
            }
          )
    }
    switch (req.method) {
        case 'POST':
            return forgotpasswordemail();
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
