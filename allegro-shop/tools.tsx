import React from 'react';
import ReactDOM from 'react-dom';

type token = {
    access_token: string,
    token_type: string,
    refresh_token: string,
    expires_in: number,
    allegro_api: boolean,
    jti: string
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// const userTokenTemp = '{"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDE3MDk1MTEsInVzZXJfbmFtZSI6IjkwODAwMjQ2IiwianRpIjoiY2QxZTUyMDctMWM5NC00YTgxLTk1ZTctMTg5MTA0YjIxOWZkIiwiY2xpZW50X2lkIjoiOGM1ODQ2ODUxMmY1NGJiMzlmY2MxZDIxMzBkZWJmZmMiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpvcmRlcnM6cmVhZCIsImFsbGVncm86YXBpOnByb2ZpbGU6d3JpdGUiLCJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczp3cml0ZSIsImFsbGVncm86YXBpOmJpbGxpbmc6cmVhZCIsImFsbGVncm86YXBpOmNhbXBhaWducyIsImFsbGVncm86YXBpOmRpc3B1dGVzIiwiYWxsZWdybzphcGk6YmlkcyIsImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOnJlYWQiLCJhbGxlZ3JvOmFwaTpvcmRlcnM6d3JpdGUiLCJhbGxlZ3JvOmFwaTphZHMiLCJhbGxlZ3JvOmFwaTpwYXltZW50czp3cml0ZSIsImFsbGVncm86YXBpOnNhbGU6c2V0dGluZ3M6d3JpdGUiLCJhbGxlZ3JvOmFwaTpwcm9maWxlOnJlYWQiLCJhbGxlZ3JvOmFwaTpyYXRpbmdzIiwiYWxsZWdybzphcGk6c2FsZTpzZXR0aW5nczpyZWFkIiwiYWxsZWdybzphcGk6cGF5bWVudHM6cmVhZCJdLCJhbGxlZ3JvX2FwaSI6dHJ1ZX0.yQ5GRSyoQ6f8VzFWZ4B_WhENLgR6TNiv5p13KAb8692lDWKzifrU3Ksk4TUMlpqT4KfIVLU7Vig7uRdmGgBGfb_C2BZKHoALy7g_oNJqNADTan2FRiYnSe7UkzD_hvud08R7Eur4Ccoc1PaHER6xh9-m7Xj0-EP7kLod2MnFKw9qGiP_9AqhWukilcgNHKiKHf-gzL9PUbKuYZ2NCbjJtSxdOYOEQR6fJuJyXC8TZ7dxHrbibm7Yl2JprIRTJPt9lfYy-8pnTjkbhPaQR_h0PdYmTBjgepVHNaP6PQTnG9Az7zMiCtNp18OfJnSS-YeYduWu31l7bEuMie6aecel_g","token_type":"bearer","refresh_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI5MDgwMDI0NiIsInNjb3BlIjpbImFsbGVncm86YXBpOm9yZGVyczpyZWFkIiwiYWxsZWdybzphcGk6cHJvZmlsZTp3cml0ZSIsImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOndyaXRlIiwiYWxsZWdybzphcGk6YmlsbGluZzpyZWFkIiwiYWxsZWdybzphcGk6Y2FtcGFpZ25zIiwiYWxsZWdybzphcGk6ZGlzcHV0ZXMiLCJhbGxlZ3JvOmFwaTpiaWRzIiwiYWxsZWdybzphcGk6c2FsZTpvZmZlcnM6cmVhZCIsImFsbGVncm86YXBpOm9yZGVyczp3cml0ZSIsImFsbGVncm86YXBpOmFkcyIsImFsbGVncm86YXBpOnBheW1lbnRzOndyaXRlIiwiYWxsZWdybzphcGk6c2FsZTpzZXR0aW5nczp3cml0ZSIsImFsbGVncm86YXBpOnByb2ZpbGU6cmVhZCIsImFsbGVncm86YXBpOnJhdGluZ3MiLCJhbGxlZ3JvOmFwaTpzYWxlOnNldHRpbmdzOnJlYWQiLCJhbGxlZ3JvOmFwaTpwYXltZW50czpyZWFkIl0sImFsbGVncm9fYXBpIjp0cnVlLCJhdGkiOiJjZDFlNTIwNy0xYzk0LTRhODEtOTVlNy0xODkxMDRiMjE5ZmQiLCJleHAiOjE2MDk0NDIzMTEsImp0aSI6ImM1OGZjY2RmLWUzYTUtNDU4Ny04ZDQ3LTMwYzcyMDIyZGFlMCIsImNsaWVudF9pZCI6IjhjNTg0Njg1MTJmNTRiYjM5ZmNjMWQyMTMwZGViZmZjIn0.1-dTvNphGvFlVWwLHMEVGClZqIx8WQcjm9srx39xq8CL9BC_RMRnnr03K0mXvj74HBRlUIY8aIoE7N-SpSFR3A9k-68c3UneQGlF8jY1Bc3aDF5gy4FGC2LIMLPxHYsV-Mh2MQZ2SOK-gC0PemsSC3GDSHnWyYZmW_wUuS0ybugBykbmSMMn5XbNzl5mH4VGtxgk3PdeZuNWQnfgasmRhunOGt0GcyNnuChR8KnYVidNFdbMMohiUyu-LTA1Bikciug5e-EPYWqAKNXQMkzlVLo1prPc1nPH9UfToiJlluYjmDJ4gAfZySfEzKoa9lawOiyAcO8rk8AjRo3DExBo9Q","expires_in":43199,"scope":"allegro:api:orders:read allegro:api:profile:write allegro:api:sale:offers:write allegro:api:billing:read allegro:api:campaigns allegro:api:disputes allegro:api:bids allegro:api:sale:offers:read allegro:api:orders:write allegro:api:ads allegro:api:payments:write allegro:api:sale:settings:write allegro:api:profile:read allegro:api:ratings allegro:api:sale:settings:read allegro:api:payments:read","allegro_api":true,"jti":"cd1e5207-1c94-4a81-95e7-189104b219fd"}';
// userToken = JSON.parse(userTokenTemp);


const
    clientId = "8c58468512f54bb39fcc1d2130debffc",
    clientSecret = "unxKwVGzWhulSvVXXlIOzmZQwkUn0l9MrRJYLG3VJGtJdDw7NtvMzWN9wnbTi6km",
    redirectURL = "https://valerii.educationhost.cloud",
    authUserURL = `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURL}`,
    apiHost = "https://api.allegro.pl",
    // corsApiUrl = 'https://cors-anywhere.herokuapp.com/',
    corsApiUrl = 'https://thingproxy.freeboard.io/fetch/',
    // corsApiUrl = 'http://www.whateverorigin.org/get?url=',
    // getAppTokenURL = corsApiUrl + "https://allegro.pl/auth/oauth/token?grant_type=client_credentials",
    endHost = corsApiUrl + apiHost,

    // getAppToken = async () =>
    //     (await fetch(getAppTokenURL, {
    //         headers: {
    //             "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
    //         }
    //     })).json(),

    getUserToken = async () => {
        let a = document.createElement('a');
        a.href = authUserURL;
        a.textContent = "User authentication";
        a.onclick = () => setTimeout(() => {
            fetch(`${corsApiUrl}${redirectURL}?clientId=${clientId}&clientSecret=${clientSecret}`)
                .then(resp => resp.json())
                .then(updateUserToken)
        }, 1000);
        a.target = "_blank";
        a.click();
        console.log(a);
    },

    updateUserToken = async (newUserToken: token) => {
        newUserToken.expires_in += Date.now() / 1000 - 60;
        localStorage.setItem('userToken', JSON.stringify(newUserToken));
    },

    refreshUserToken = async (refresh_token: string) => {
        return fetch(`${corsApiUrl}https://allegro.pl/auth/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}&redirect_uri=${redirectURL}`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
                }
            }).then(resp => resp.json()).then(updateUserToken);
    },

    sendReq = async (path: string, method: string | undefined = undefined, body: string | undefined = undefined) => {
        localStorage.getItem('userToken') || await getUserToken();
        while (!localStorage.getItem('userToken')) await sleep(1300);
        let userToken = JSON.parse(localStorage.getItem('userToken') as string);
        if (userToken.expires_in < (Date.now() / 1000))
            await refreshUserToken(userToken);
        userToken = JSON.parse(localStorage.getItem('userToken') as string);
        return (await fetch(endHost + path, {
            method,
            body,
            headers: {
                "Authorization":
                    `Bearer ${userToken.access_token}`
                ,
                "Accept": "application/vnd.allegro.public.v1+json",
                // 'Accept-Language': 'en-US',
                'content-type': 'application/vnd.allegro.public.v1+json'
            }
        })).json();
    },

    getCategories = async (parentCategoryId: string) => {
        return (await sendReq(
            `/sale/categories?parent.id=${parentCategoryId}`
        )).categories;
    }


export {sendReq, getCategories};
