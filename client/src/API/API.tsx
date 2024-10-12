
const baseURL = "http://localhost:3001/"

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise: any) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response: any) => {
          if (response.ok) {
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( (json: any) => resolve(json) )
              .catch( (err: any) => reject({ error: "Cannot parse server response" }))
          } else {
            // analyzing the cause of error
            response.json()
              .then((obj: any) => 
                reject(obj)
                ) // error msg in the response body
              .catch((err: any) => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch((err: any) => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
  }

/** ------------------- Services APIs ------------------------ */

/* 
* This API retrieves the list of available services 
* for which a customer can request a ticket.
 */
async function getAllServices() {
    // call  /api/services
    const response = await fetch(baseURL+'api/services/');
    const services = await response.json(); 
    if (response.ok) {
        return services
    } else {
        throw new Error("Failed to fetch services: " + response.statusText);
    }
  }

/** ------------------- Tickets APIs ------------------------ */
/*
This API creates a new ticket for the specified service.
*/
function createTicket(serviceID: number) {
    return getJson(
      fetch(baseURL + "api/tickets/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({'ServiceID': serviceID}) 
      })
    )
  }



const API = {
    getAllServices, createTicket
  };
  export default API;