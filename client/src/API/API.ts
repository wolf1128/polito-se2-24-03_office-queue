import { Service, Ticket, NotificationsResponse } from '../interfaces/types.ts';

const baseURL = "http://localhost:3001/api/";

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise: Promise<Response>): Promise<any> {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response: Response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json: any) => resolve(json))
            .catch((err: any) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj: any) => reject(obj)) // error msg in the response body
            .catch((err: any) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err: any) => reject({ error: "Cannot communicate" })); // connection error
  });
}

/** ------------------- Services APIs ------------------------ */

/*
 * This API retrieves the list of available services
 * for which a customer can request a ticket.
 */
async function getAllServices(): Promise<Service[]> {
  // call  /api/services
  const response = await fetch(baseURL + "services/");
  const services: Service[] = await response.json();
  if (response.ok) {
    return services;
  } else {
    throw new Error("Failed to fetch services: " + response.statusText);
  }
}

  /** ------------------- Notifications APIs ------------------------ */
/*
 * This API retrieves notifications including ticket information and waiting queue details.
 */
async function getNotifications(ticketID: number): Promise<NotificationsResponse> {
    // call /api/notifications
    const response = await fetch(baseURL + 'tickets/' + ticketID + '/notifications/');
    const notifications: NotificationsResponse = await response.json();
    if(response.ok){
      return notifications
    } else {
      throw new Error("Failed to fetch notifications: " + response.statusText);
    }
  }

/** ------------------- Tickets APIs ------------------------ */
/*
This API creates a new ticket for the specified service.
*/
function createTicket(serviceID: number): Promise<Ticket> {
  return getJson(
    fetch(baseURL + "tickets/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ServiceID: serviceID }),
    })
  ) as Promise<Ticket>;
}

function nextCustomer(officerID: number): Promise<Ticket> {
  return getJson(
    fetch(`${baseURL}tickets/next-customer/${officerID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ) as Promise<Ticket>;
}

const API = {
  getNotifications,
  getAllServices,
  createTicket,
  nextCustomer,
};
export default API;
